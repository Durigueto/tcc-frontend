<template>
  <div class="login-wrapper d-flex align-center justify-center pa-4">
    <!-- Fundo Tático Abstrato -->
    <div class="login-bg-overlay"></div>

    <v-card class="login-card elevation-12 pa-4 pa-sm-6 pa-md-8 w-100" max-width="460">
      <!-- Cabeçalho: Apenas a Logo e o Slogan da aba "Análise de Desempenho no Futebol" -->
      <div class="text-center mb-6">
        <div class="logo-box mb-2 d-inline-block">
          <img
            src="/visao90-header.png"
            alt="Visão 90"
            class="login-logo-img"
          />
        </div>
        <p class="text-caption text-slate-300 font-weight-medium mt-1 mb-0">
          Análise de Desempenho no Futebol
        </p>
      </div>

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
      <!-- VISTA 1: FORMULÁRIO DE LOGIN (EMAIL & SENHA)                       -->
      <!-- =================================================================== -->
      <div v-if="!modoCadastro">
        <v-form @submit.prevent="submeterLogin" ref="formLoginRef">
          <v-text-field
            v-model="emailLogin"
            label="E-mail"
            placeholder="seu.email@exemplo.com"
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
            label="Senha"
            placeholder="Digite sua senha"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="mostrarSenhaLogin ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="mostrarSenhaLogin = !mostrarSenhaLogin"
            variant="outlined"
            density="comfortable"
            color="secondary"
            :rules="[regras.obrigatorio]"
            class="mb-4 input-custom"
          ></v-text-field>

          <!-- Botão Principal: "Entrar" -->
          <v-btn
            type="submit"
            color="secondary"
            size="large"
            block
            :loading="carregando"
            prepend-icon="mdi-login"
            class="font-weight-bold py-3 btn-login mb-3"
          >
            Entrar
          </v-btn>

          <!-- Botão Abaixo do Entrar: "Criar Conta" -->
          <v-btn
            variant="outlined"
            color="secondary"
            size="large"
            block
            prepend-icon="mdi-account-plus-outline"
            @click="abrirModoCadastro"
            class="font-weight-bold py-3 btn-cadastro"
          >
            Criar Conta
          </v-btn>
        </v-form>
      </div>

      <!-- =================================================================== -->
      <!-- VISTA 2: FORMULÁRIO DE CRIAR CONTA                                  -->
      <!-- =================================================================== -->
      <div v-else>
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-subtitle-1 font-weight-bold text-ivory">Nova Conta</h2>
          <v-btn
            variant="text"
            size="small"
            color="secondary"
            prepend-icon="mdi-arrow-left"
            @click="fecharModoCadastro"
            class="text-none font-weight-bold"
          >
            Voltar ao Login
          </v-btn>
        </div>

        <v-form @submit.prevent="submeterCadastro" ref="formCadastroRef">
          <v-text-field
            v-model="novoNome"
            label="Nome Completo"
            placeholder="Ex: João Pedro Dias"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            color="secondary"
            :rules="[regras.obrigatorio]"
            class="mb-2 input-custom"
          ></v-text-field>

          <v-text-field
            v-model="novoEmail"
            label="E-mail"
            placeholder="Ex: joaopedro@exemplo.com"
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
                placeholder="Ex: Fisiologista"
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
            label="Senha"
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
            color="secondary"
            size="large"
            block
            :loading="carregando"
            prepend-icon="mdi-account-check-outline"
            class="font-weight-bold py-3 btn-login mb-2"
          >
            Concluir Cadastro
          </v-btn>

          <v-btn
            variant="text"
            block
            color="grey-lighten-1"
            size="small"
            @click="fecharModoCadastro"
            class="text-none"
          >
            Cancelar
          </v-btn>
        </v-form>
      </div>

      <!-- Rodapé do Card -->
      <div class="text-center mt-6 pt-4 border-t text-3xs text-medium-emphasis">
        Sistema Visão 90 &bull; Análise de Desempenho & Rastreamento
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '@/services/authService'

const emit = defineEmits(['login-sucesso'])

// Alternância entre Login e Cadastro
const modoCadastro = ref(false)

// Estado do Login (Inicia completamente vazio por seguranca em qualquer aparelho)
const emailLogin = ref('')
const senhaLogin = ref('')
const mostrarSenhaLogin = ref(false)

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

function abrirModoCadastro() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  modoCadastro.value = true
}

function fecharModoCadastro() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  modoCadastro.value = false
}

// Submissão do Login
async function submeterLogin() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  if (!emailLogin.value || !senhaLogin.value) {
    mensagemErro.value = 'Informe o e-mail e a senha.'
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
  }, 400)
}

// Submissão do Cadastro
async function submeterCadastro() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  if (!novoNome.value || !novoEmail.value || !novaSenha.value) {
    mensagemErro.value = 'Preencha os campos obrigatórios.'
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
  }, 450)
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
    radial-gradient(circle at 20% 25%, rgba(46, 107, 102, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 80% 75%, rgba(179, 140, 64, 0.12) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(16, 24, 32, 0.95), rgba(16, 24, 32, 0.98));
  pointer-events: none;
}

.login-card {
  background: rgba(27, 37, 48, 0.92) !important; /* Slate */
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

.input-custom :deep(.v-field) {
  border-radius: 10px;
  background: rgba(16, 24, 32, 0.4) !important;
}

.btn-login {
  letter-spacing: 0.5px;
  border-radius: 10px;
}

.btn-cadastro {
  letter-spacing: 0.5px;
  border-radius: 10px;
  border-color: rgba(46, 107, 102, 0.6) !important;
}

.btn-cadastro:hover {
  background: rgba(46, 107, 102, 0.12) !important;
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
