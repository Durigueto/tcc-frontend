// =========================================================================
// SERVIÇO DE AUTENTICAÇÃO E ISOLAMENTO DE DADOS - VISÃO 90
// Gerencia sessões, credenciais, cadastro e persistência isolada por usuário
// =========================================================================

const CHAVE_SESSAO = 'visao90_sessao_ativa'
const CHAVE_USUARIOS = 'visao90_usuarios_cadastrados'
const PREFIXO_PARTIDAS = 'visao90_partidas_'

// Usuário padrão principal com todas as 3 partidas oficiais centralizadas
export const USUARIO_PADRAO = {
  id: 'usr_joaopedro',
  nome: 'João Pedro Dias',
  email: 'joaopedrodias895@gmail.com',
  senha: '123',
  cargo: 'Fisiologista / Analista de Desempenho',
  clube: 'Comissão Técnica',
  avatar: 'JP',
  cor: '#2E6B66',
  partidasIniciaisMeta: [
    {
      id: '1',
      nome: 'Campeonato Oficial - Rodada 4 (vs Santos FC)',
      adversario: 'Santos FC',
      data: '07/09/2026',
      duracao: 90,
      placar: '2 x 1 (Vitória Mandante)',
      fator: 1.0
    },
    {
      id: '2',
      nome: 'Campeonato Oficial - Rodada 3 (vs Palmeiras)',
      adversario: 'Palmeiras',
      data: '31/08/2026',
      duracao: 90,
      placar: '1 x 1 (Empate Fora)',
      fator: 1.05
    },
    {
      id: '3',
      nome: 'Campeonato Oficial - Rodada 2 (vs Corinthians)',
      adversario: 'Corinthians',
      data: '24/08/2026',
      duracao: 90,
      placar: '3 x 0 (Vitória Mandante)',
      fator: 0.96
    }
  ]
}

export const authService = {
  // Inicializa o banco local de usuários garantindo a conta principal
  inicializarUsuarios() {
    try {
      const cadastradosStr = localStorage.getItem(CHAVE_USUARIOS)
      let cadastrados = cadastradosStr ? JSON.parse(cadastradosStr) : []

      // Garante que o usuário joaopedrodias895@gmail.com sempre exista e esteja atualizado
      const index = cadastrados.findIndex(u => u.email === USUARIO_PADRAO.email)
      if (index === -1) {
        cadastrados.unshift(USUARIO_PADRAO)
      } else {
        cadastrados[index] = { ...cadastrados[index], ...USUARIO_PADRAO }
      }
      localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(cadastrados))
    } catch (e) {
      console.warn('Erro ao inicializar localStorage de usuários:', e)
    }
  },

  // Obtém a sessão do usuário atualmente autenticado
  obterSessaoAtiva() {
    try {
      const sessaoStr = localStorage.getItem(CHAVE_SESSAO)
      if (!sessaoStr) return null
      return JSON.parse(sessaoStr)
    } catch (e) {
      console.error('Erro ao recuperar sessão:', e)
      return null
    }
  },

  // Salva a sessão ativa
  salvarSessao(usuario) {
    try {
      const { senha, ...dadosSeguros } = usuario
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dadosSeguros))
      return dadosSeguros
    } catch (e) {
      console.error('Erro ao salvar sessão:', e)
      return usuario
    }
  },

  // Encerra a sessão atual
  fazerLogout() {
    try {
      localStorage.removeItem(CHAVE_SESSAO)
    } catch (e) {
      console.error('Erro no logout:', e)
    }
  },

  // Obtém a lista completa de usuários cadastrados
  obterTodosUsuarios() {
    try {
      this.inicializarUsuarios()
      const data = localStorage.getItem(CHAVE_USUARIOS)
      return data ? JSON.parse(data) : [USUARIO_PADRAO]
    } catch (e) {
      return [USUARIO_PADRAO]
    }
  },

  // Autenticação tradicional por E-mail e Senha
  fazerLogin(email, senha) {
    this.inicializarUsuarios()
    const usuarios = this.obterTodosUsuarios()
    const emailNormalizado = email.trim().toLowerCase()

    const usuario = usuarios.find(
      u => u.email.trim().toLowerCase() === emailNormalizado && String(u.senha) === String(senha)
    )

    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'E-mail ou senha incorretos. Verifique suas credenciais.'
      }
    }

    const sessao = this.salvarSessao(usuario)
    return {
      sucesso: true,
      usuario: sessao
    }
  },

  // Cadastro de nova conta independente
  cadastrarUsuario({ nome, email, senha, cargo, clube }) {
    this.inicializarUsuarios()
    const usuarios = this.obterTodosUsuarios()
    const emailNormalizado = email.trim().toLowerCase()

    if (usuarios.some(u => u.email.trim().toLowerCase() === emailNormalizado)) {
      return {
        sucesso: false,
        mensagem: 'Este e-mail já está cadastrado no sistema.'
      }
    }

    const iniciais = nome
      .split(' ')
      .filter(p => p.length > 0)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('') || 'US'

    const novoUsuario = {
      id: 'usr_' + Date.now(),
      nome: nome.trim(),
      email: emailNormalizado,
      senha: senha,
      cargo: cargo?.trim() || 'Fisiologista / Analista',
      clube: clube?.trim() || 'Comissão Técnica',
      avatar: iniciais,
      cor: '#2E6B66',
      partidasIniciaisMeta: []
    }

    usuarios.push(novoUsuario)
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios))

    // Inicia com lista de partidas vazia para a nova conta
    this.salvarPartidasDoUsuario(novoUsuario.id, [])

    const sessao = this.salvarSessao(novoUsuario)
    return {
      sucesso: true,
      usuario: sessao
    }
  },

  // Carrega as partidas exclusivas daquele usuário
  obterPartidasDoUsuario(usuarioId, geradorAtletasCallback) {
    try {
      const chave = PREFIXO_PARTIDAS + usuarioId
      const partidasSalvas = localStorage.getItem(chave)

      if (partidasSalvas) {
        const parsed = JSON.parse(partidasSalvas)
        // Se a conta for do João Pedro e por acaso estiver vazia no storage, re-popula com as 3 partidas
        if (usuarioId === USUARIO_PADRAO.id && (!parsed || parsed.length === 0)) {
          const partidasSemente = USUARIO_PADRAO.partidasIniciaisMeta.map(meta => ({
            id: meta.id,
            nome: meta.nome,
            adversario: meta.adversario,
            data: meta.data,
            duracao: meta.duracao,
            placar: meta.placar,
            atletas: geradorAtletasCallback ? geradorAtletasCallback(meta.adversario, meta.fator) : []
          }))
          localStorage.setItem(chave, JSON.stringify(partidasSemente))
          return partidasSemente
        }
        return parsed
      }

      // Se não há partidas salvas ainda, verifica se é o usuário principal
      if (usuarioId === USUARIO_PADRAO.id && USUARIO_PADRAO.partidasIniciaisMeta) {
        const partidasSemente = USUARIO_PADRAO.partidasIniciaisMeta.map(meta => ({
          id: meta.id,
          nome: meta.nome,
          adversario: meta.adversario,
          data: meta.data,
          duracao: meta.duracao,
          placar: meta.placar,
          atletas: geradorAtletasCallback ? geradorAtletasCallback(meta.adversario, meta.fator) : []
        }))

        localStorage.setItem(chave, JSON.stringify(partidasSemente))
        return partidasSemente
      }

      // Usuário novo ou sem partidas semente
      localStorage.setItem(chave, JSON.stringify([]))
      return []
    } catch (e) {
      console.error('Erro ao recuperar partidas do usuário:', e)
      return []
    }
  },

  // Persiste a lista de partidas isolada para o usuário informado
  salvarPartidasDoUsuario(usuarioId, partidas) {
    try {
      const chave = PREFIXO_PARTIDAS + usuarioId
      localStorage.setItem(chave, JSON.stringify(partidas))
      return true
    } catch (e) {
      console.error('Erro ao salvar partidas do usuário:', e)
      return false
    }
  },

  // Exclui uma partida específica do repositório do usuário
  excluirPartidaDoUsuario(usuarioId, partidaId) {
    const partidasAtuais = this.obterPartidasDoUsuario(usuarioId)
    const partidasFiltradas = partidasAtuais.filter(p => p.id !== partidaId)
    this.salvarPartidasDoUsuario(usuarioId, partidasFiltradas)
    return partidasFiltradas
  }
}
