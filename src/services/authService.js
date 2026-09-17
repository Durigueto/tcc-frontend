// =========================================================================
// SERVIÇO DE AUTENTICAÇÃO E ISOLAMENTO DE DADOS - VISÃO 90
// Gerencia sessões, credenciais, cadastro e persistência isolada por usuário
// =========================================================================

const CHAVE_SESSAO = 'visao90_sessao_ativa'
const CHAVE_USUARIOS = 'visao90_usuarios_cadastrados'
const PREFIXO_PARTIDAS = 'visao90_partidas_'

export const USUARIOS_DEMO = [
  {
    id: 'usr_carlos',
    nome: 'Dr. Carlos Silva',
    email: 'carlos@santosfc.com.br',
    senha: '123',
    cargo: 'Fisiologista Chefe',
    clube: 'Santos FC',
    avatar: 'CS',
    cor: '#1B2530',
    descricao: 'Acesso com 2 partidas oficiais do Santos FC cadastradas.',
    partidasIniciaisMeta: [
      {
        id: 'carlos_p1',
        nome: 'Campeonato Paulista - Rodada 4 (Santos FC x Palmeiras)',
        adversario: 'Palmeiras',
        data: '07/09/2026',
        duracao: 90,
        placar: '2 x 1 (Vitória Mandante)',
        fator: 1.0
      },
      {
        id: 'carlos_p2',
        nome: 'Amistoso de Intertemporada - Santos FC x Grêmio',
        adversario: 'Grêmio',
        data: '14/09/2026',
        duracao: 90,
        placar: '1 x 0 (Vitória Mandante)',
        fator: 0.94
      }
    ]
  },
  {
    id: 'usr_marcos',
    nome: 'Prof. Marcos Lima',
    email: 'marcos@palmeiras.com.br',
    senha: '123',
    cargo: 'Preparador Físico',
    clube: 'SE Palmeiras',
    avatar: 'ML',
    cor: '#2E6B66',
    descricao: 'Acesso com 1 partida do Palmeiras cadastrada.',
    partidasIniciaisMeta: [
      {
        id: 'marcos_p1',
        nome: 'Campeonato Brasileiro - Rodada 12 (Palmeiras x Corinthians)',
        adversario: 'Corinthians',
        data: '31/08/2026',
        duracao: 90,
        placar: '1 x 1 (Empate Fora)',
        fator: 1.06
      }
    ]
  },
  {
    id: 'usr_convidado',
    nome: 'Avaliador da Banca',
    email: 'banca@tcc.com.br',
    senha: '123',
    cargo: 'Membro da Banca Examinadora',
    clube: 'Avaliação Acadêmica TCC',
    avatar: 'BT',
    cor: '#B38C40',
    descricao: 'Conta nova vazia (0 partidas) para testar a importação de CSV do zero.',
    partidasIniciaisMeta: []
  }
]

export const authService = {
  // Inicializa o banco local de usuários com os perfis de demo caso ainda não existam
  inicializarUsuarios() {
    try {
      const cadastrados = localStorage.getItem(CHAVE_USUARIOS)
      if (!cadastrados) {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(USUARIOS_DEMO))
      }
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
      return data ? JSON.parse(data) : USUARIOS_DEMO
    } catch (e) {
      return USUARIOS_DEMO
    }
  },

  // Autenticação tradicional por E-mail e Senha
  fazerLogin(email, senha) {
    this.inicializarUsuarios()
    const usuarios = this.obterTodosUsuarios()
    const emailNormalizado = email.trim().toLowerCase()

    const usuario = usuarios.find(
      u => u.email.trim().toLowerCase() === emailNormalizado && u.senha === senha
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

  // Acesso rápido por Perfil de Demonstração (Facilita a Banca do TCC)
  fazerLoginDemo(idUsuarioDemo) {
    this.inicializarUsuarios()
    const usuario = USUARIOS_DEMO.find(u => u.id === idUsuarioDemo) || USUARIOS_DEMO[0]
    const sessao = this.salvarSessao(usuario)
    return {
      sucesso: true,
      usuario: sessao
    }
  },

  // Cadastro de nova conta
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
      clube: clube?.trim() || 'Clube Independente',
      avatar: iniciais,
      cor: '#2E6B66',
      partidasIniciaisMeta: []
    }

    usuarios.push(novoUsuario)
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios))

    // Inicia com lista de partidas vazia para o novo usuário
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
        return JSON.parse(partidasSalvas)
      }

      // Se não há partidas salvas ainda, verifica se é um usuário demo com dados semente
      const usuarioDemo = USUARIOS_DEMO.find(u => u.id === usuarioId)
      if (usuarioDemo && usuarioDemo.partidasIniciaisMeta && usuarioDemo.partidasIniciaisMeta.length > 0) {
        const partidasSemente = usuarioDemo.partidasIniciaisMeta.map(meta => ({
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
