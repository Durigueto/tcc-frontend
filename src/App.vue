<template>
  <v-app class="app-background">
    <!-- Top App Bar -->
    <v-app-bar color="#0a0f1d" elevation="2" border="b">
      <template v-slot:prepend>
        <v-avatar color="primary" variant="tonal" class="mr-2">
          <v-icon icon="mdi-soccer" color="primary"></v-icon>
        </v-avatar>
      </template>

      <v-app-bar-title class="font-weight-bold text-h6 text-md-h5">
        <span class="text-primary font-weight-black">METRICA</span> TRACKING
        <span class="text-caption text-medium-emphasis ml-2 d-none d-sm-inline">
          Analise de Cinematica & Fisiologia no Futebol
        </span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-chip size="small" color="success" variant="flat" class="mr-2 font-weight-medium">
        <v-icon start icon="mdi-checkbox-marked-circle-outline" size="14"></v-icon>
        Backend Online (3000)
      </v-chip>

      <v-chip size="small" color="info" variant="tonal" class="d-none d-sm-inline-flex font-weight-medium">
        <v-icon start icon="mdi-database-check" size="14"></v-icon>
        Supabase PostgreSQL
      </v-chip>
    </v-app-bar>

    <v-main class="py-6 px-4 px-md-8">
      <!-- Container Principal -->
      <v-container fluid class="pa-0 max-content-width">

        <!-- Banner de Ingestao de Dados -->
        <v-card class="glass-card mb-6" elevation="0">
          <v-card-item>
            <div class="d-flex flex-wrap align-center justify-space-between mb-3">
              <div>
                <h2 class="text-h5 font-weight-bold d-flex align-center">
                  <v-icon icon="mdi-cloud-upload-outline" color="secondary" class="mr-2"></v-icon>
                  Entrada de Dados Cinematicos
                </h2>
                <p class="text-body-2 text-medium-emphasis mt-1">
                  Envie o arquivo CSV de coordenadas ou informe a URL direta do repositorio da Metrica Sports.
                </p>
              </div>

              <!-- Abas de Entrada -->
              <v-tabs v-model="tabInput" density="compact" color="primary" class="mt-2 mt-sm-0">
                <v-tab value="file">
                  <v-icon start icon="mdi-file-upload-outline"></v-icon> Upload CSV
                </v-tab>
                <v-tab value="url">
                  <v-icon start icon="mdi-link-variant"></v-icon> URL Externa
                </v-tab>
              </v-tabs>
            </div>

            <v-window v-model="tabInput" class="mt-4">
              <!-- Aba 1: Upload de Arquivo -->
              <v-window-item value="file">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <v-file-input
                      v-model="arquivoSelecionado"
                      label="Selecione o arquivo CSV de rastreamento"
                      accept=".csv,text/csv"
                      prepend-icon="mdi-file-delimited-outline"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      clearable
                      show-size
                      hide-details
                      placeholder="Ex: dados_rastreamento.csv"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex gap-2">
                    <v-btn
                      color="primary"
                      size="large"
                      block
                      :loading="carregando"
                      :disabled="!arquivoSelecionado"
                      prepend-icon="mdi-play-speed"
                      @click="processarPorUpload"
                      class="font-weight-bold"
                    >
                      Processar Arquivo
                    </v-btn>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Aba 2: URL Metrica Sports -->
              <v-window-item value="url">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="urlArquivo"
                      label="URL Raw do CSV de Rastreamento (Metrica Sports)"
                      variant="outlined"
                      density="comfortable"
                      color="secondary"
                      hide-details
                      placeholder="https://raw.githubusercontent.com/metrica-sports/sample-data/..."
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="secondary"
                      size="large"
                      block
                      :loading="carregando"
                      :disabled="!urlArquivo"
                      prepend-icon="mdi-download-network-outline"
                      @click="processarPorUrl"
                      class="font-weight-bold"
                    >
                      Baixar & Processar
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Atalhos / Presets -->
                <div class="mt-3 d-flex flex-wrap align-center gap-2">
                  <span class="text-caption text-medium-emphasis mr-1">Atalhos rapidos:</span>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="secondary"
                    @click="aplicarPreset('home')"
                    prepend-icon="mdi-shield-home-outline"
                  >
                    Metrica Game 1 - Mandante (Home)
                  </v-chip>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="secondary"
                    @click="aplicarPreset('away')"
                    prepend-icon="mdi-shield-airplane-outline"
                  >
                    Metrica Game 1 - Visitante (Away)
                  </v-chip>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    @click="carregarMockDemonstracao"
                    prepend-icon="mdi-lightning-bolt"
                  >
                    Carregar Demonstracao Instantanea
                  </v-chip>
                </div>
              </v-window-item>
            </v-window>
          </v-card-item>
        </v-card>

        <!-- Alerta de Erro -->
        <v-alert
          v-if="mensagemErro"
          type="error"
          variant="tonal"
          closable
          class="mb-6"
          @click:close="mensagemErro = ''"
        >
          {{ mensagemErro }}
        </v-alert>

        <!-- Alerta de Sucesso -->
        <v-alert
          v-if="mensagemSucesso"
          type="success"
          variant="tonal"
          closable
          class="mb-6"
          @click:close="mensagemSucesso = ''"
        >
          {{ mensagemSucesso }}
        </v-alert>

        <!-- Secao de Metricas (Exibida quando houver dados) -->
        <div v-if="atletas.length > 0">
          <!-- KPIs Gerais -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                        Atletas Rastreados
                      </div>
                      <div class="text-h4 font-weight-black mt-1 text-primary">
                        {{ atletas.length }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Campo: 105m x 68m
                      </div>
                    </div>
                    <v-avatar color="primary" variant="tonal" size="52">
                      <v-icon icon="mdi-account-group" size="28" color="primary"></v-icon>
                    </v-avatar>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                        Distancia Total Coletiva
                      </div>
                      <div class="text-h4 font-weight-black mt-1 text-secondary">
                        {{ (distanciaColetivaKm).toFixed(2) }} <span class="text-h6">km</span>
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Media: {{ (distanciaColetivaKm / atletas.length).toFixed(2) }} km/atleta
                      </div>
                    </div>
                    <v-avatar color="secondary" variant="tonal" size="52">
                      <v-icon icon="mdi-map-marker-distance" size="28" color="secondary"></v-icon>
                    </v-avatar>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                        Velocidade de Pico
                      </div>
                      <div class="text-h4 font-weight-black mt-1 text-warning">
                        {{ maiorVelocidade.toFixed(1) }} <span class="text-h6">km/h</span>
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Atleta #{{ atletaMaisRapido?.id || '-' }}
                      </div>
                    </div>
                    <v-avatar color="warning" variant="tonal" size="52">
                      <v-icon icon="mdi-speedometer" size="28" color="warning"></v-icon>
                    </v-avatar>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                        Distancia em Sprint
                      </div>
                      <div class="text-h4 font-weight-black mt-1 text-error">
                        {{ totalSprintM.toFixed(0) }} <span class="text-h6">m</span>
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Acima de 19.8 km/h
                      </div>
                    </div>
                    <v-avatar color="error" variant="tonal" size="52">
                      <v-icon icon="mdi-run-fast" size="28" color="error"></v-icon>
                    </v-avatar>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>

          <!-- Legenda das Zonas de Intensidade -->
          <v-card class="glass-card mb-6" elevation="0">
            <v-card-item>
              <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center">
                <v-icon icon="mdi-chart-bar-stacked" class="mr-2" color="primary"></v-icon>
                Classificacao Fisiologica por Zonas de Velocidade
              </div>
              <v-row dense>
                <v-col cols="6" sm="3">
                  <div class="d-flex align-center">
                    <span class="zone-badge zone-walk mr-2"></span>
                    <div>
                      <div class="text-caption font-weight-bold">Z1 - Caminhada</div>
                      <div class="text-caption text-medium-emphasis">0.0 a 7.2 km/h</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="d-flex align-center">
                    <span class="zone-badge zone-jog mr-2"></span>
                    <div>
                      <div class="text-caption font-weight-bold">Z2 - Trote</div>
                      <div class="text-caption text-medium-emphasis">7.2 a 14.4 km/h</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="d-flex align-center">
                    <span class="zone-badge zone-run mr-2"></span>
                    <div>
                      <div class="text-caption font-weight-bold">Z3 - Corrida</div>
                      <div class="text-caption text-medium-emphasis">14.4 a 19.8 km/h</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="d-flex align-center">
                    <span class="zone-badge zone-sprint mr-2"></span>
                    <div>
                      <div class="text-caption font-weight-bold">Z4 - Sprint</div>
                      <div class="text-caption text-medium-emphasis">> 19.8 km/h</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>

          <!-- Tabela de Atletas -->
          <v-card class="glass-card mb-6" elevation="0">
            <v-card-title class="pa-4 d-flex flex-wrap align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon icon="mdi-clipboard-list-outline" color="primary" class="mr-2"></v-icon>
                <span>Relatorio Individual dos Atletas</span>
              </div>
              <v-text-field
                v-model="filtroBusca"
                placeholder="Buscar por ID ou Camisa..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 260px"
              ></v-text-field>
            </v-card-title>

            <v-divider></v-divider>

            <v-table hover class="bg-transparent table-custom">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">Atleta</th>
                  <th class="text-left font-weight-bold">Distancia Total</th>
                  <th class="text-left font-weight-bold">Velocidade Max.</th>
                  <th class="text-left font-weight-bold">Distribuicao por Zonas</th>
                  <th class="text-center font-weight-bold">Carga Interna (Borg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="atleta in atletasFiltrados" :key="atleta.id">
                  <!-- ID Jogador -->
                  <td>
                    <div class="d-flex align-center py-2">
                      <v-avatar color="surface-variant" size="36" class="mr-3 font-weight-bold">
                        #{{ atleta.id }}
                      </v-avatar>
                      <div>
                        <div class="font-weight-bold">Jogador {{ atleta.id }}</div>
                        <div class="text-caption text-medium-emphasis">Metrica Player</div>
                      </div>
                    </div>
                  </td>

                  <!-- Distancia Total -->
                  <td>
                    <div class="font-weight-bold text-body-1">
                      {{ (atleta.distanciaTotal).toFixed(1) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ (atleta.distanciaTotal / 1000).toFixed(2) }} km
                    </div>
                  </td>

                  <!-- Velocidade Maxima -->
                  <td>
                    <v-chip
                      size="small"
                      :color="atleta.velocidadeMaxima >= 28 ? 'error' : atleta.velocidadeMaxima >= 20 ? 'warning' : 'primary'"
                      variant="tonal"
                      class="font-weight-bold"
                    >
                      <v-icon start icon="mdi-speedometer" size="14"></v-icon>
                      {{ atleta.velocidadeMaxima.toFixed(1) }} km/h
                    </v-chip>
                  </td>

                  <!-- Distribuicao das Zonas (Barra Segmentada) -->
                  <td style="min-width: 220px;">
                    <div class="segmented-bar mb-1">
                      <div
                        class="seg-walk"
                        :style="{ width: percentualZona(atleta, 'distanciaAndando') + '%' }"
                        :title="'Caminhada: ' + atleta.distanciaAndando.toFixed(1) + 'm'"
                      ></div>
                      <div
                        class="seg-jog"
                        :style="{ width: percentualZona(atleta, 'distanciaTrotando') + '%' }"
                        :title="'Trote: ' + atleta.distanciaTrotando.toFixed(1) + 'm'"
                      ></div>
                      <div
                        class="seg-run"
                        :style="{ width: percentualZona(atleta, 'distanciaCorrendo') + '%' }"
                        :title="'Corrida: ' + atleta.distanciaCorrendo.toFixed(1) + 'm'"
                      ></div>
                      <div
                        class="seg-sprint"
                        :style="{ width: percentualZona(atleta, 'distanciaSprint') + '%' }"
                        :title="'Sprint: ' + atleta.distanciaSprint.toFixed(1) + 'm'"
                      ></div>
                    </div>
                    <div class="text-caption text-medium-emphasis d-flex justify-space-between">
                      <span>Sprint: {{ atleta.distanciaSprint.toFixed(1) }}m</span>
                      <span>Corrida: {{ atleta.distanciaCorrendo.toFixed(1) }}m</span>
                    </div>
                  </td>

                  <!-- Acao Cruzar com Borg -->
                  <td class="text-center">
                    <v-btn
                      size="small"
                      color="primary"
                      variant="tonal"
                      prepend-icon="mdi-heart-pulse"
                      @click="abrirModalBorg(atleta)"
                    >
                      Simular Borg
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>

        <!-- Estado Vazio (Nenhum dado carregado ainda) -->
        <v-card v-else class="glass-card text-center pa-10" elevation="0">
          <v-icon icon="mdi-soccer-field" size="64" color="medium-emphasis" class="mb-3"></v-icon>
          <h3 class="text-h5 font-weight-bold">Aguardando Envio de Dados</h3>
          <p class="text-body-2 text-medium-emphasis mt-2" style="max-width: 520px; margin: 0 auto;">
            Faca o upload do arquivo CSV acima ou utilize um dos atalhos da Metrica Sports para ver os dados cinematicos e os calculos fisiologicos dos atletas em tempo real.
          </p>
          <v-btn
            color="primary"
            class="mt-4 font-weight-bold"
            prepend-icon="mdi-lightning-bolt"
            @click="carregarMockDemonstracao"
          >
            Carregar Demonstracao Instantanea
          </v-btn>
        </v-card>

      </v-container>
    </v-main>

    <!-- Modal de Cruzamento Fisiologico com a Escala de Borg -->
    <v-dialog v-model="modalBorgAberto" max-width="620">
      <v-card class="glass-card pa-2" elevation="10" border>
        <v-card-item>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar color="primary" variant="tonal" class="mr-3">
                <v-icon icon="mdi-heart-pulse" color="primary"></v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold">Analise Carga Externa x Borg (PSE)</h3>
                <div class="text-caption text-medium-emphasis">
                  Atleta #{{ atletaSelecionado?.id }} - Cruzamento Fisiologico da Comissao Tecnica
                </div>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" size="small" @click="modalBorgAberto = false"></v-btn>
          </div>
        </v-card-item>

        <v-divider class="my-2"></v-divider>

        <v-card-text>
          <!-- Resumo da Carga Externa (GPS/Algoritmo) -->
          <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
            1. Carga Externa Coletada (Algoritmo de Rastreamento)
          </div>
          <v-row dense class="mb-4">
            <v-col cols="6" sm="4">
              <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                <div class="text-caption text-medium-emphasis">Distancia Total</div>
                <div class="text-h6 font-weight-bold text-primary">
                  {{ atletaSelecionado?.distanciaTotal.toFixed(1) }} m
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4">
              <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                <div class="text-caption text-medium-emphasis">Velocidade Max.</div>
                <div class="text-h6 font-weight-bold text-warning">
                  {{ atletaSelecionado?.velocidadeMaxima.toFixed(1) }} km/h
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                <div class="text-caption text-medium-emphasis">Volume Sprint</div>
                <div class="text-h6 font-weight-bold text-error">
                  {{ atletaSelecionado?.distanciaSprint.toFixed(1) }} m
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Input da Escala de Borg -->
          <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
            2. Carga Interna (Escala de Borg CR-10 / PSE)
          </div>

          <div class="px-2">
            <div class="d-flex justify-space-between align-center mb-1">
              <span class="text-body-2 font-weight-bold">Classificacao do Esforco Subjetivo:</span>
              <v-chip size="small" :color="corBorg(valorBorg)" class="font-weight-black">
                Borg {{ valorBorg }} - {{ descricaoBorg(valorBorg) }}
              </v-chip>
            </div>
            <v-slider
              v-model="valorBorg"
              :min="0"
              :max="10"
              :step="1"
              show-ticks="always"
              tick-size="4"
              color="primary"
              track-color="surface-variant"
            ></v-slider>
          </div>

          <v-row dense class="mt-2">
            <v-col cols="6">
              <v-text-field
                v-model.number="duracaoSessaoMinutos"
                label="Duracao da Sessao (minutos)"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-card color="surface-variant" class="pa-2 text-center" elevation="0">
                <div class="text-caption text-medium-emphasis">Carga da Sessao (Foster)</div>
                <div class="text-h6 font-weight-bold text-secondary">
                  {{ valorBorg * duracaoSessaoMinutos }} <span class="text-caption">U.A.</span>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Diagnostico Automatico da Comissao Tecnica -->
          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
            3. Diagnostico Integrado da Comissao Tecnica
          </div>

          <v-alert
            :type="diagnosticoAtleta.tipo"
            variant="tonal"
            density="compact"
            class="mb-0"
          >
            <template v-slot:title>
              <div class="font-weight-bold">{{ diagnosticoAtleta.titulo }}</div>
            </template>
            {{ diagnosticoAtleta.mensagem }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="modalBorgAberto = false">Fechar</v-btn>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-check" @click="salvarSimulacaoBorg">
            Confirmar Avaliacao
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estado da UI
const tabInput = ref('file')
const arquivoSelecionado = ref(null)
const urlArquivo = ref('')
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const filtroBusca = ref('')

// Dados dos Atletas
const atletas = ref([])

// Estado do Modal de Borg
const modalBorgAberto = ref(false)
const atletaSelecionado = ref(null)
const valorBorg = ref(6)
const duracaoSessaoMinutos = ref(90)

// Presets da Metrica Sports
const URL_METRICA_HOME = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv'
const URL_METRICA_AWAY = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv'

function aplicarPreset(tipo) {
  tabInput.value = 'url'
  if (tipo === 'home') urlArquivo.value = URL_METRICA_HOME
  if (tipo === 'away') urlArquivo.value = URL_METRICA_AWAY
}

// Computeds
const atletasFiltrados = computed(() => {
  if (!filtroBusca.value) return atletas.value
  const termo = filtroBusca.value.toLowerCase().trim()
  return atletas.value.filter(a => String(a.id).toLowerCase().includes(termo))
})

const distanciaColetivaKm = computed(() => {
  const totalM = atletas.value.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
  return totalM / 1000
})

const maiorVelocidade = computed(() => {
  if (atletas.value.length === 0) return 0
  return Math.max(...atletas.value.map(a => a.velocidadeMaxima || 0))
})

const atletaMaisRapido = computed(() => {
  if (atletas.value.length === 0) return null
  return [...atletas.value].sort((a, b) => b.velocidadeMaxima - a.velocidadeMaxima)[0]
})

const totalSprintM = computed(() => {
  return atletas.value.reduce((acc, a) => acc + (a.distanciaSprint || 0), 0)
})

function percentualZona(atleta, campo) {
  if (!atleta.distanciaTotal || atleta.distanciaTotal === 0) return 0
  return ((atleta[campo] || 0) / atleta.distanciaTotal) * 100
}

// Envio para o Backend (Upload de Arquivo)
async function processarPorUpload() {
  if (!arquivoSelecionado.value) return

  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    const formData = new FormData()
    formData.append('file', arquivoSelecionado.value)

    const response = await fetch('http://localhost:3000/api/rastreamento', {
      method: 'POST',
      body: formData
    })

    const json = await response.json()
    if (!json.sucesso) throw new Error(json.erro || 'Falha ao processar arquivo.')

    atletas.value = json.dados
    mensagemSucesso.value = `Sucesso! Foram calculadas as metricas de ${json.quantidadeJogadores} atletas e sincronizadas com o Supabase.`
  } catch (err) {
    console.error('Erro na requisicao:', err)
    mensagemErro.value = `Erro ao comunicar com o servidor: ${err.message}. Verifique se o backend esta rodando na porta 3000.`
  } finally {
    carregando.value = false
  }
}

// Envio para o Backend (URL da Metrica)
async function processarPorUrl() {
  if (!urlArquivo.value) return

  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    const formData = new FormData()
    formData.append('url', urlArquivo.value)

    const response = await fetch('http://localhost:3000/api/rastreamento', {
      method: 'POST',
      body: formData
    })

    const json = await response.json()
    if (!json.sucesso) throw new Error(json.erro || 'Falha ao processar URL.')

    atletas.value = json.dados
    mensagemSucesso.value = `Sucesso! Rastreamento processado para ${json.quantidadeJogadores} atletas e salvo no Supabase.`
  } catch (err) {
    console.error('Erro na requisicao:', err)
    mensagemErro.value = `Erro ao baixar/processar da URL: ${err.message}`
  } finally {
    carregando.value = false
  }
}

// Mock de Demonstracao Instantanea
function carregarMockDemonstracao() {
  atletas.value = [
    { id: '11', distanciaTotal: 10420.5, velocidadeMaxima: 32.4, distanciaAndando: 3800.2, distanciaTrotando: 4200.5, distanciaCorrendo: 1820.3, distanciaSprint: 599.5 },
    { id: '7',  distanciaTotal: 11250.0, velocidadeMaxima: 34.2, distanciaAndando: 3600.0, distanciaTrotando: 4650.0, distanciaCorrendo: 2150.0, distanciaSprint: 850.0 },
    { id: '10', distanciaTotal: 9850.3,  velocidadeMaxima: 29.8, distanciaAndando: 4100.0, distanciaTrotando: 3900.0, distanciaCorrendo: 1450.3, distanciaSprint: 400.0 },
    { id: '4',  distanciaTotal: 9200.0,  velocidadeMaxima: 28.5, distanciaAndando: 4500.0, distanciaTrotando: 3400.0, distanciaCorrendo: 1100.0, distanciaSprint: 200.0 },
    { id: '9',  distanciaTotal: 10100.2, velocidadeMaxima: 33.1, distanciaAndando: 3950.2, distanciaTrotando: 3850.0, distanciaCorrendo: 1600.0, distanciaSprint: 700.0 },
    { id: '2',  distanciaTotal: 10800.0, velocidadeMaxima: 31.9, distanciaAndando: 3700.0, distanciaTrotando: 4400.0, distanciaCorrendo: 1950.0, distanciaSprint: 750.0 }
  ]
  mensagemSucesso.value = 'Dados simulados de demonstracao carregados com sucesso!'
}

// Funcoes do Modal de Borg
function abrirModalBorg(atleta) {
  atletaSelecionado.value = atleta
  valorBorg.value = 6
  duracaoSessaoMinutos.value = 90
  modalBorgAberto.value = true
}

function descricaoBorg(val) {
  if (val <= 1) return 'Muito Leve'
  if (val <= 3) return 'Leve / Moderado'
  if (val <= 5) return 'Pesado'
  if (val <= 7) return 'Muito Pesado'
  if (val <= 9) return 'Extremamente Intenso'
  return 'Exaustao Maxima'
}

function corBorg(val) {
  if (val <= 3) return 'success'
  if (val <= 6) return 'info'
  if (val <= 8) return 'warning'
  return 'error'
}

const diagnosticoAtleta = computed(() => {
  if (!atletaSelecionado.value) return { tipo: 'info', titulo: '', mensagem: '' }

  const sprint = atletaSelecionado.value.distanciaSprint
  const borg = valorBorg.value

  if (borg >= 8 && sprint < 400) {
    return {
      tipo: 'error',
      titulo: 'Alerta Vermelho: Risco de Lesao / Sobrecarga Residual',
      mensagem: 'O atleta reportou esforco desproporcionalmente alto para um volume baixo de sprints. Pode indicar fadiga muscular acumulada ou estresse fisiologico elevado.'
    }
  } else if (borg <= 5 && sprint >= 600) {
    return {
      tipo: 'success',
      titulo: 'Otima Eficiencia Fisica (Prontidao Excelente)',
      mensagem: 'O atleta manteve alta demanda fisica em alta intensidade com baixa percepcao de fadiga subjetiva. Excelente resposta adaptativa.'
    }
  } else if (borg >= 7) {
    return {
      tipo: 'warning',
      titulo: 'Carga Interna Elevada',
      mensagem: 'Sessao com alto desgaste fisiologico. Recomenda-se protocolo ativo de recuperacao (crioterapia / sono monitorado) nas proximas 24 horas.'
    }
  } else {
    return {
      tipo: 'info',
      titulo: 'Resposta Fisiologica Dentro do Padrao',
      mensagem: 'Relacao entre volume de corrida externa e percepcao de esforco interna esperada para a duracao da partida.'
    }
  }
})

function salvarSimulacaoBorg() {
  mensagemSucesso.value = `Avaliacao de Borg (${valorBorg.value}) registrada para o Atleta #${atletaSelecionado.value.id}. Carga: ${valorBorg.value * duracaoSessaoMinutos.value} U.A.`
  modalBorgAberto.value = false
}
</script>

<style scoped>
.app-background {
  background: radial-gradient(circle at 10% 20%, #0d1a30 0%, #080d1a 90%) !important;
  color: #e2e8f0;
  min-height: 100vh;
}

.max-content-width {
  max-width: 1400px;
  margin: 0 auto;
}

.glass-card {
  background: rgba(19, 30, 51, 0.75) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.3) !important;
}

.zone-badge {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.zone-walk { background-color: #3b82f6; }
.zone-jog { background-color: #06b6d4; }
.zone-run { background-color: #f59e0b; }
.zone-sprint { background-color: #ef4444; }

.segmented-bar {
  display: flex;
  height: 10px;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
}

.seg-walk { background-color: #3b82f6; transition: width 0.4s ease; }
.seg-jog { background-color: #06b6d4; transition: width 0.4s ease; }
.seg-run { background-color: #f59e0b; transition: width 0.4s ease; }
.seg-sprint { background-color: #ef4444; transition: width 0.4s ease; }

.table-custom th {
  color: #94a3b8 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.table-custom td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
</style>
