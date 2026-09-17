<template>
  <div class="login-wrapper d-flex align-center justify-center pa-4">
    <!-- Fundo Tático Abstrato -->
    <div class="login-bg-overlay"></div>

    <v-card class="login-card elevation-12 pa-6 pa-md-8 w-100" max-width="540">
      <!-- Cabeçalho com Logo Oficial e Tipografia do Visão 90 -->
      <div class="text-center mb-6">
        <div class="logo-box mb-3 d-inline-block">
          <img
            src="/visao90-header.png"
            alt="Visão 90"
            class="login-logo-img"
          />
        </div>
        <h1 class="text-h5 font-weight-black text-ivory tracking-wide">
          Visão 90
        </h1>
        <p class="text-caption text-slate-400 mt-1">
          Inteligência Fisiológica, Métricas Cinemáticas & Rastreamento Tático
        </p>

        <!-- Badge de Isolamento de Dados -->
        <div class="d-inline-flex align-center mt-2 px-3 py-1 rounded-pill isolation-badge">
          <v-icon icon="mdi-shield-lock-outline" size="14" color="warning" class="mr-1"></v-icon>
          <span class="text-caption font-weight-bold text-amber-300">
            Ambiente Seguro & Isolamento de Dados por Usuário
          </span>
        </div>
      </div>

      <!-- Abas de Navegação do Card -->
      <v-tabs
        v-model="abaAtiva"
        color="secondary"
        align-tabs="center"
        grow
        density="compact"
        class="login-tabs mb-6 rounded-lg"
      >
        <v-tab value="login" class="font-weight-bold">
          <v-icon start icon="mdi-login" size="18"></v-icon>
          Entrar
        </v-tab>
        <v-tab value="cadastro" class="font-weight-bold">
          <v-icon start icon="mdi-account-plus-outline" size="18"></v-icon>
          Criar Conta
        </v-tab>
        <v-tab value="demo" class="font-weight-bold">
          <v-icon start icon="mdi-account-switch-outline" size="18"></v-icon>
          Modo Banca TCC
        </v-tab>
      </v-tabs>

      <!-- Mensagens de Feedback / Alerta -->
      <v-alert
        v-if="mensagemErro"
        type="error"
        variant="tonal"
        density="compact"
        closable
        @click:close="mensagemErro = ''"
        class="mb-4 text-caption font-weight-bold"
      >
        {{ mensagemErro }}
      </v-alert>

      <v-alert
        v-if="mensagemSucesso"
        type="success"
        variant="tonal"
        density="compact"
        closable
        @click:close="mensagemSucesso = ''"
        class="mb-4 text-caption font-weight-bold"
      >
        {{ mensagemSucesso }}
      </v-alert>

      <!-- =================================================================== -->
      <!-- ABA 1: ENTRAR (LOGIN COM E-MAIL E SENHA)                            -->
      <!-- =================================================================== -->
      <v-window v-model="abaAtiva">
        <v-window-item value="login">
          <v-form @submit.prevent="submeterLogin" ref="formLoginRef">
            <v-text-field
              v-model="emailLogin"
              label="E-mail Profissional"
              placeholder="ex: fisiologista@clube.com.br"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              color="secondary"
              :rules="[regras.obrigatorio, regras.email]"
              class="mb-2 input-custom"
            ></v-text-field>

            <v-text-field
              v-model="senhaLogin"
              :type="mostrarSenhaLogin ? 'text' : 'password'"
              label="Senha de Acesso"
              placeholder="Digite sua senha"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="mostrarSenhaLogin ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="mostrarSenhaLogin = !mostrarSenhaLogin"
              variant="outlined"
              density="comfortable"
              color="secondary"
              :rules="[regras.obrigatorio]"
              class="mb-3 input-custom"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between mb-4">
              <v-checkbox
                v-model="lembrarMe"
                label="Lembrar neste navegador"
                density="compact"
                hide-details
                color="secondary"
                class="text-caption"
              ></v-checkbox>

              <a
                href="javascript:void(0)"
                @click="abaAtiva = 'demo'"
                class="text-caption text-gold font-weight-bold text-decoration-none"
              >
                Esqueceu a senha?
              </a>
            </div>

            <v-btn
              type="submit"
              color="secondary"
              size="large"
              block
              :loading="carregando"
              prepend-icon="mdi-arrow-right-bold-circle-outline"
              class="font-weight-bold text-uppercase py-3 btn-login"
            >
              Acessar Painéis
            </v-btn>

            <div class="text-center mt-4 text-caption text-medium-emphasis">
              Ainda não possui conta?
              <a
                href="javascript:void(0)"
                @click="abaAtiva = 'cadastro'"
                class="text-secondary font-weight-bold ml-1 text-decoration-none"
              >
                Cadastre-se gratuitamente
              </a>
            </div>
          </v-form>
        </v-window-item>

        <!-- =================================================================== -->
        <!-- ABA 2: CRIAR CONTA (CADASTRO NOVO COM ISOLAMENTO DE DADOS)          -->
        <!-- =================================================================== -->
        <v-window-item value="cadastro">
          <v-form @submit.prevent="submeterCadastro" ref="formCadastroRef">
            <v-text-field
              v-model="novoNome"
              label="Nome Completo"
              placeholder="Ex: Dra. Mariana Costa"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              density="comfortable"
              color="secondary"
              :rules="[regras.obrigatorio]"
              class="mb-2 input-custom"
            ></v-text-field>

            <v-text-field
              v-model="novoEmail"
              label="E-mail Institucional"
              placeholder="Ex: mariana@fisiologia.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              color="secondary"
              :rules="[regras.obrigatorio, regras.email]"
              class="mb-2 input-custom"
            ></v-text-field>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoCargo"
                  label="Cargo / Função"
                  placeholder="Ex: Fisiologista Chefe"
                  prepend-inner-icon="mdi-badge-account-outline"
                  variant="outlined"
                  density="comfortable"
                  color="secondary"
                  class="mb-2 input-custom"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoClube"
                  label="Clube / Instituição"
                  placeholder="Ex: Santos FC"
                  prepend-inner-icon="mdi-shield-outline"
                  variant="outlined"
                  density="comfortable"
                  color="secondary"
                  class="mb-2 input-custom"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="novaSenha"
              :type="mostrarNovaSenha ? 'text' : 'password'"
              label="Senha de Acesso"
              placeholder="Mínimo 3 caracteres"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="mostrarNovaSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="mostrarNovaSenha = !mostrarNovaSenha"
              variant="outlined"
              density="comfortable"
              color="secondary"
              :rules="[regras.obrigatorio, regras.minimoSenha]"
              class="mb-4 input-custom"
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="carregando"
              prepend-icon="mdi-account-check-outline"
              class="font-weight-bold text-uppercase py-3 btn-login"
            >
              Criar Conta & Iniciar
            </v-btn>

            <div class="text-center mt-3 text-caption text-medium-emphasis">
              Já possui conta cadastrada?
              <a
                href="javascript:void(0)"
                @click="abaAtiva = 'login'"
                class="text-secondary font-weight-bold ml-1 text-decoration-none"
              >
                Fazer login
              </a>
            </div>
          </v-form>
        </v-window-item>

        <!-- =================================================================== -->
        <!-- ABA 3: MODO BANCA TCC (ACESSO RÁPIDO PARA TESTAR ISOLAMENTO)        -->
        <!-- =================================================================== -->
        <v-window-item value="demo">
          <div class="mb-3">
            <p class="text-caption text-slate-300">
              Clique em qualquer um dos perfis abaixo para testar o sistema imediatamente. Note como <strong>cada conta visualiza apenas suas próprias partidas</strong>:
            </p>
          </div>

          <div class="d-flex flex-column gap-3">
            <!-- Card 1: Dr. Carlos (Santos FC) -->
            <v-card
              class="demo-card pa-3 border cursor-pointer"
              @click="selecionarPerfilDemo('usr_carlos')"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="#1B2530" size="42" class="border font-weight-black text-ivory">
                    CS
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-body-2 text-ivory">Dr. Carlos Silva</div>
                    <div class="text-caption text-gold font-weight-medium">Fisiologista Chefe &bull; Santos FC</div>
                    <div class="text-3xs text-slate-400 mt-1">
                      <v-icon icon="mdi-database-check" size="12" class="mr-1" color="success"></v-icon>
                      2 partidas do Santos FC cadastradas
                    </div>
                  </div>
                </div>
                <v-btn size="small" color="secondary" variant="tonal" class="font-weight-bold">
                  Entrar
                </v-btn>
              </div>
            </v-card>

            <!-- Card 2: Prof. Marcos (Palmeiras) -->
            <v-card
              class="demo-card pa-3 border cursor-pointer"
              @click="selecionarPerfilDemo('usr_marcos')"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="#2E6B66" size="42" class="border font-weight-black text-ivory">
                    ML
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-body-2 text-ivory">Prof. Marcos Lima</div>
                    <div class="text-caption text-gold font-weight-medium">Preparador Físico &bull; SE Palmeiras</div>
                    <div class="text-3xs text-slate-400 mt-1">
                      <v-icon icon="mdi-database-check" size="12" class="mr-1" color="success"></v-icon>
                      1 partida do Palmeiras cadastrada
                    </div>
                  </div>
                </div>
                <v-btn size="small" color="secondary" variant="tonal" class="font-weight-bold">
                  Entrar
                </v-btn>
              </div>
            </v-card>

            <!-- Card 3: Convidado da Banca (Conta Limpa) -->
            <v-card
              class="demo-card pa-3 border cursor-pointer"
              @click="selecionarPerfilDemo('usr_convidado')"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="#B38C40" size="42" class="border font-weight-black text-ivory">
                    BT
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-body-2 text-ivory">Avaliador da Banca</div>
                    <div class="text-caption text-gold font-weight-medium">Banca Examinadora TCC</div>
                    <div class="text-3xs text-slate-400 mt-1">
                      <v-icon icon="mdi-folder-plus-outline" size="12" class="mr-1" color="info"></v-icon>
                      Conta limpa (0 partidas) para importar novo CSV
                    </div>
                  </div>
                </div>
                <v-btn size="small" color="primary" variant="tonal" class="font-weight-bold">
                  Entrar
                </v-btn>
              </div>
            </v-card>
          </div>
        </v-window-item>
      </v-window>

      <!-- Rodapé do Card -->
      <div class="text-center mt-6 pt-4 border-t text-3xs text-medium-emphasis">
        Desenvolvido para Trabalho de Conclusão de Curso (TCC) &bull; Metodologia Científica Aplicada ao Futebol
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService, USUARIOS_DEMO } from '@/services/authService'

const emit = defineEmits(['login-sucesso'])

// Estado das abas
const abaAtiva = ref('login') // 'login' | 'cadastro' | 'demo'

// Estado do Login
const emailLogin = ref('carlos@santosfc.com.br')
const senhaLogin = ref('123')
const mostrarSenhaLogin = ref(false)
const lembrarMe = ref(true)

// Estado do Cadastro
const novoNome = ref('')
const novoEmail = ref('')
const novaSenha = ref('')
const novoCargo = ref('')
const novoClube = ref('')
const mostrarNovaSenha = ref(false)

// Feedbacks
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const formLoginRef = ref(null)
const formCadastroRef = ref(null)

const regras = {
  obrigatorio: v => !!v || 'Campo obrigatório',
  email: v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
  minimoSenha: v => (v && v.length >= 3) || 'Mínimo de 3 caracteres'
}

// Submissão do Login Tradicional
async function submeterLogin() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  if (!emailLogin.value || !senhaLogin.value) {
    mensagemErro.value = 'Preencha o e-mail e a senha para acessar.'
    return
  }

  carregando.value = true
  setTimeout(() => {
    const resultado = authService.fazerLogin(emailLogin.value, senhaLogin.value)
    carregando.value = false

    if (resultado.sucesso) {
      mensagemSucesso.value = `Bem-vindo(a), ${resultado.usuario.nome}!`
      emit('login-sucesso', resultado.usuario)
    } else {
      mensagemErro.value = resultado.mensagem
    }
  }, 450)
}

// Submissão do Cadastro de Nova Conta
async function submeterCadastro() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  if (!novoNome.value || !novoEmail.value || !novaSenha.value) {
    mensagemErro.value = 'Preencha os campos obrigatórios para criar sua conta.'
    return
  }

  carregando.value = true
  setTimeout(() => {
    const resultado = authService.cadastrarUsuario({
      nome: novoNome.value,
      email: novoEmail.value,
      senha: novaSenha.value,
      cargo: novoCargo.value,
      clube: novoClube.value
    })
    carregando.value = false

    if (resultado.sucesso) {
      mensagemSucesso.value = 'Conta criada com sucesso!'
      emit('login-sucesso', resultado.usuario)
    } else {
      mensagemErro.value = resultado.mensagem
    }
  }, 500)
}

// Acesso Rápido por Perfil Demo (Banca)
function selecionarPerfilDemo(idPerfil) {
  carregando.value = true
  mensagemErro.value = ''
  setTimeout(() => {
    const resultado = authService.fazerLoginDemo(idPerfil)
    carregando.value = false
    if (resultado.sucesso) {
      emit('login-sucesso', resultado.usuario)
    }
  }, 300)
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-color: #101820; /* Navy profundo */
  position: relative;
  overflow: hidden;
}

.login-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 15% 20%, rgba(46, 107, 102, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(179, 140, 64, 0.12) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(16, 24, 32, 0.95), rgba(16, 24, 32, 0.98));
  pointer-events: none;
}

.login-card {
  background: rgba(27, 37, 48, 0.92) !important; /* Slate com opacidade */
  border: 1px solid rgba(232, 230, 223, 0.12) !important;
  backdrop-filter: blur(16px);
  border-radius: 16px;
  position: relative;
  z-index: 2;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5) !important;
}

.logo-box {
  background: rgba(16, 24, 32, 0.6);
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(179, 140, 64, 0.25);
}

.login-logo-img {
  height: 48px;
  max-width: 180px;
  object-fit: contain;
}

.isolation-badge {
  background: rgba(179, 140, 64, 0.15);
  border: 1px solid rgba(179, 140, 64, 0.4);
}

.login-tabs {
  background: rgba(16, 24, 32, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.input-custom :deep(.v-field) {
  border-radius: 10px;
  background: rgba(16, 24, 32, 0.4) !important;
}

.btn-login {
  letter-spacing: 0.5px;
  border-radius: 10px;
}

.demo-card {
  background: rgba(16, 24, 32, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px;
  transition: all 0.25s ease;
}

.demo-card:hover {
  background: rgba(46, 107, 102, 0.15) !important;
  border-color: #2E6B66 !important;
  transform: translateY(-2px);
}

.text-ivory {
  color: #E8E6DF !important;
}

.text-gold {
  color: #B38C40 !important;
}

.text-3xs {
  font-size: 11px;
}
</style>
