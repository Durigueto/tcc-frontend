<template>
  <v-app class="app-background">
    <!-- Top App Bar -->
    <v-app-bar color="#070c18" elevation="2" border="b">
      <template v-slot:prepend>
        <v-avatar color="primary" variant="tonal" class="mr-2">
          <v-icon icon="mdi-soccer" color="primary"></v-icon>
        </v-avatar>
      </template>

      <v-app-bar-title class="font-weight-bold text-h6 text-md-h5">
        <span class="text-primary font-weight-black">METRICA</span> TRACKING
        <span class="text-caption text-medium-emphasis ml-2 d-none d-sm-inline">
          Plataforma de Ciencia do Esporte, Cinematica & Fisiologia no Futebol
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
                  Envie o arquivo CSV de coordenadas 25 FPS ou utilize o repositorio da Metrica Sports para calculo em tempo real.
                </p>
              </div>

              <!-- Abas de Entrada -->
              <v-tabs v-model="tabInput" density="compact" color="primary" class="mt-2 mt-sm-0">
                <v-tab value="file">
                  <v-icon start icon="mdi-file-upload-outline"></v-icon> Upload CSV
                </v-tab>
                <v-tab value="url">
                  <v-icon start icon="mdi-link-variant"></v-icon> URL Metrica
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
                  <v-col cols="12" md="4">
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
                      Calcular Metricas
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
                  <span class="text-caption text-medium-emphasis mr-1">Atalhos oficiais:</span>
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
                    variant="flat"
                    color="primary"
                    @click="carregarMockDemonstracao"
                    prepend-icon="mdi-lightning-bolt"
                    class="font-weight-bold"
                  >
                    Carregar Demonstracao Completa (11 Atletas)
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
          <!-- KPIs Gerais do Elenco (Coletivo) -->
          <v-row class="mb-6">
            <!-- 1. Atletas Rastreados -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Atletas
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-primary">
                    {{ atletas.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Campo: 105m x 68m
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- 2. Distancia Coletiva -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Distancia Total
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-secondary">
                    {{ distanciaColetivaKm.toFixed(1) }} <span class="text-caption">km</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Media: {{ (distanciaColetivaKm / atletas.length).toFixed(1) }} km
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- 3. Intensidade Media (M/min) -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Intensidade Media
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-info">
                    {{ mediaMetrosPorMinuto.toFixed(0) }} <span class="text-caption">M/min</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Padrao Pro: 100-125
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- 4. Velocidade de Pico -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Pico de Velocidade
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-warning">
                    {{ maiorVelocidade.toFixed(1) }} <span class="text-caption">km/h</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Atleta #{{ atletaMaisRapido?.id || '-' }}
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- 5. Aceleracoes Explosivas Coletivas -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Acel. Explosivas
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-success">
                    {{ totalAceleracoesAltas }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    > 2.5 m/s² (Coletivo)
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- 6. Alta Potencia Metabolica (HPMD) -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="glass-card kpi-card" elevation="0">
                <v-card-item>
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    HPMD Coletivo
                  </div>
                  <div class="text-h4 font-weight-black mt-1 text-error">
                    {{ (totalHpmdM / 1000).toFixed(1) }} <span class="text-caption">km</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Metabolic > 20 W/kg
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
                Classificacao Fisiologica por Zonas de Velocidade (Padrao FIFA / Prozone)
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
                      <div class="text-caption font-weight-bold">Z3 - Corrida / Media</div>
                      <div class="text-caption text-medium-emphasis">14.4 a 19.8 km/h</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="d-flex align-center">
                    <span class="zone-badge zone-sprint mr-2"></span>
                    <div>
                      <div class="text-caption font-weight-bold">Z4 - Sprint / Alta</div>
                      <div class="text-caption text-medium-emphasis">> 19.8 km/h</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>

          <!-- Tabela Completa de Atletas -->
          <v-card class="glass-card mb-6" elevation="0">
            <v-card-title class="pa-4 d-flex flex-wrap align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon icon="mdi-account-details" color="primary" class="mr-2"></v-icon>
                <span>Relatorio Fisico-Cinematico Individual dos Atletas</span>
              </div>
              <v-text-field
                v-model="filtroBusca"
                placeholder="Buscar por ID ou Posicao..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 280px"
              ></v-text-field>
            </v-card-title>

            <v-divider></v-divider>

            <v-table hover class="bg-transparent table-custom">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">Atleta & Posicao</th>
                  <th class="text-left font-weight-bold">Distancia Total</th>
                  <th class="text-left font-weight-bold">Intensidade (M/min)</th>
                  <th class="text-left font-weight-bold">Vel. Max / Media</th>
                  <th class="text-left font-weight-bold">Acel. / Desacel.</th>
                  <th class="text-left font-weight-bold">Sprints</th>
                  <th class="text-left font-weight-bold">Player Load</th>
                  <th class="text-center font-weight-bold">Acao</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="atleta in atletasFiltrados" :key="atleta.id">
                  <!-- ID & Posicao -->
                  <td>
                    <div class="d-flex align-center py-2">
                      <v-avatar color="surface-variant" size="38" class="mr-3 font-weight-black">
                        #{{ atleta.id }}
                      </v-avatar>
                      <div>
                        <div class="font-weight-bold">Jogador {{ atleta.id }}</div>
                        <div class="text-caption text-primary">
                          {{ atleta.posicaoSugerida || 'Em Campo' }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Distancia Total -->
                  <td>
                    <div class="font-weight-bold text-body-1">
                      {{ (atleta.distanciaTotal).toFixed(0) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ (atleta.distanciaTotal / 1000).toFixed(2) }} km
                    </div>
                  </td>

                  <!-- M/min -->
                  <td>
                    <v-chip
                      size="small"
                      :color="atleta.metrosPorMinuto >= 120 ? 'error' : atleta.metrosPorMinuto >= 105 ? 'warning' : 'info'"
                      variant="tonal"
                      class="font-weight-bold"
                    >
                      {{ atleta.metrosPorMinuto ? atleta.metrosPorMinuto.toFixed(1) : '-' }} M/min
                    </v-chip>
                  </td>

                  <!-- Velocidade Max e Media -->
                  <td>
                    <div class="font-weight-bold">
                      {{ atleta.velocidadeMaxima.toFixed(1) }} km/h
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Med: {{ atleta.velocidadeMedia ? atleta.velocidadeMedia.toFixed(1) : '-' }} km/h
                    </div>
                  </td>

                  <!-- Aceleracoes vs Desaceleracoes -->
                  <td>
                    <div class="d-flex align-center gap-1">
                      <span class="text-success font-weight-bold" title="Acelerações > 2.5 m/s²">
                        +{{ atleta.aceleracoesAltas || 0 }}
                      </span>
                      <span class="text-medium-emphasis">/</span>
                      <span class="text-error font-weight-bold" title="Desacelerações < -2.5 m/s²">
                        -{{ atleta.desaceleracoesAltas || 0 }}
                      </span>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Pico: +{{ atleta.aceleracaoMaxima?.toFixed(1) || 0 }} m/s²
                    </div>
                  </td>

                  <!-- Sprints -->
                  <td>
                    <div class="font-weight-bold text-error">
                      {{ atleta.sprintsContagem || 0 }} tiros
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ atleta.distanciaSprint?.toFixed(0) || 0 }} m
                    </div>
                  </td>

                  <!-- Player Load -->
                  <td>
                    <div class="font-weight-bold text-warning">
                      {{ atleta.playerLoad?.toFixed(0) || '-' }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ atleta.potenciaMetabolicaMedia?.toFixed(1) || '-' }} W/kg
                    </div>
                  </td>

                  <!-- Botao Ver Detalhes -->
                  <td class="text-center">
                    <v-btn
                      size="small"
                      color="primary"
                      variant="flat"
                      prepend-icon="mdi-account-search"
                      @click="abrirPerfilDetalhado(atleta)"
                      class="font-weight-bold"
                    >
                      Ver Perfil
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>

        <!-- Estado Vazio (Nenhum dado carregado ainda) -->
        <v-card v-else class="glass-card text-center pa-10" elevation="0">
          <v-icon icon="mdi-soccer-field" size="72" color="medium-emphasis" class="mb-3"></v-icon>
          <h3 class="text-h5 font-weight-bold">Aguardando Envio de Dados de Rastreamento</h3>
          <p class="text-body-2 text-medium-emphasis mt-2" style="max-width: 560px; margin: 0 auto;">
            Envie o arquivo CSV de coordenadas 25 FPS da Metrica Sports ou carregue a demonstracao completa com 11 atletas para explorar todas as metricas cinematicas, inerciais, potencia metabolica e mapa tatico no gramado.
          </p>
          <v-btn
            color="primary"
            size="large"
            class="mt-5 font-weight-bold"
            prepend-icon="mdi-lightning-bolt"
            @click="carregarMockDemonstracao"
          >
            Carregar Demonstracao Completa (11 Atletas)
          </v-btn>
        </v-card>

      </v-container>
    </v-main>

    <!-- MODAL COMPLETO: PERFIL & ANALISE APROFUNDADA DO ATLETA -->
    <v-dialog v-model="modalDetalhesAberto" max-width="960" scrollable>
      <v-card class="glass-card pa-2" elevation="10" border v-if="atletaSelecionado">
        <!-- Header do Modal -->
        <v-card-item class="pb-2">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="48" class="mr-3 font-weight-black text-h6">
                #{{ atletaSelecionado.id }}
              </v-avatar>
              <div>
                <div class="d-flex align-center gap-2">
                  <h3 class="text-h6 font-weight-bold">Atleta #{{ atletaSelecionado.id }}</h3>
                  <v-chip size="small" color="secondary" variant="flat" class="font-weight-bold">
                    {{ atletaSelecionado.posicaoSugerida }}
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">
                  Analise Esportiva Aprofundada &middot; Centroide: X={{ atletaSelecionado.centroideX }}m, Y={{ atletaSelecionado.centroideY }}m
                </div>
              </div>
            </div>

            <v-btn icon="mdi-close" variant="text" size="small" @click="modalDetalhesAberto = false"></v-btn>
          </div>

          <!-- Abas de Navegacao no Modal -->
          <v-tabs v-model="abaModal" color="primary" density="compact" class="mt-4">
            <v-tab value="cinematica">
              <v-icon start icon="mdi-speedometer"></v-icon> Cinematica
            </v-tab>
            <v-tab value="inercial">
              <v-icon start icon="mdi-axis-arrow"></v-icon> Dinamica Inercial
            </v-tab>
            <v-tab value="campo">
              <v-icon start icon="mdi-soccer-field"></v-icon> Campo Tatico
            </v-tab>
            <v-tab value="radar">
              <v-icon start icon="mdi-radar"></v-icon> Radar vs Time
            </v-tab>
            <v-tab value="fisiologia">
              <v-icon start icon="mdi-heart-pulse"></v-icon> Escala de Borg
            </v-tab>
          </v-tabs>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text style="max-height: 650px;" class="py-4">
          <v-window v-model="abaModal">
            
            <!-- ABA 1: CINEMATICA & INTENSIDADE -->
            <v-window-item value="cinematica">
              <v-row dense class="mb-4">
                <v-col cols="6" sm="3">
                  <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Distancia Total</div>
                    <div class="text-h5 font-weight-black text-primary">
                      {{ (atletaSelecionado.distanciaTotal).toFixed(0) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ (atletaSelecionado.distanciaTotal / 1000).toFixed(2) }} km
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Intensidade (M/min)</div>
                    <div class="text-h5 font-weight-black text-info">
                      {{ atletaSelecionado.metrosPorMinuto?.toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Metros/Minuto</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Velocidade Maxima</div>
                    <div class="text-h5 font-weight-black text-warning">
                      {{ atletaSelecionado.velocidadeMaxima?.toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">km/h</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Velocidade Media</div>
                    <div class="text-h5 font-weight-black text-success">
                      {{ atletaSelecionado.velocidadeMedia?.toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">km/h</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Distribuicao por Zonas de Velocidade -->
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Distribuicao do Volume por Zonas de Velocidade
              </div>

              <div class="segmented-bar mb-3" style="height: 16px;">
                <div
                  class="seg-walk"
                  :style="{ width: percentualZona(atletaSelecionado, 'distanciaAndando') + '%' }"
                ></div>
                <div
                  class="seg-jog"
                  :style="{ width: percentualZona(atletaSelecionado, 'distanciaTrotando') + '%' }"
                ></div>
                <div
                  class="seg-run"
                  :style="{ width: percentualZona(atletaSelecionado, 'distanciaCorrendo') + '%' }"
                ></div>
                <div
                  class="seg-sprint"
                  :style="{ width: percentualZona(atletaSelecionado, 'distanciaSprint') + '%' }"
                ></div>
              </div>

              <v-row dense>
                <v-col cols="6" sm="3">
                  <v-card class="pa-3" variant="outlined" border>
                    <div class="d-flex align-center mb-1">
                      <span class="zone-badge zone-walk mr-2"></span>
                      <span class="text-caption font-weight-bold">Z1 - Caminhada</span>
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ atletaSelecionado.distanciaAndando?.toFixed(1) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ percentualZona(atletaSelecionado, 'distanciaAndando').toFixed(1) }}% do total
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3" variant="outlined" border>
                    <div class="d-flex align-center mb-1">
                      <span class="zone-badge zone-jog mr-2"></span>
                      <span class="text-caption font-weight-bold">Z2 - Trote</span>
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ atletaSelecionado.distanciaTrotando?.toFixed(1) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ percentualZona(atletaSelecionado, 'distanciaTrotando').toFixed(1) }}% do total
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3" variant="outlined" border>
                    <div class="d-flex align-center mb-1">
                      <span class="zone-badge zone-run mr-2"></span>
                      <span class="text-caption font-weight-bold">Z3 - Corrida</span>
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ atletaSelecionado.distanciaCorrendo?.toFixed(1) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ percentualZona(atletaSelecionado, 'distanciaCorrendo').toFixed(1) }}% do total
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3" variant="outlined" border>
                    <div class="d-flex align-center mb-1">
                      <span class="zone-badge zone-sprint mr-2"></span>
                      <span class="text-caption font-weight-bold">Z4 - Sprint</span>
                    </div>
                    <div class="text-h6 font-weight-bold text-error">
                      {{ atletaSelecionado.distanciaSprint?.toFixed(1) }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ percentualZona(atletaSelecionado, 'distanciaSprint').toFixed(1) }}% do total
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- ABA 2: DINAMICA INERCIAL & CARGAS MECANICAS -->
            <v-window-item value="inercial">
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Acelerações, Desacelerações e Esforço Neuromuscular
              </div>

              <v-row dense class="mb-4">
                <!-- Aceleracoes -->
                <v-col cols="12" sm="6">
                  <v-card color="surface-variant" class="pa-3" elevation="0">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="font-weight-bold text-success d-flex align-center">
                        <v-icon icon="mdi-arrow-up-bold" class="mr-1"></v-icon>
                        Acelerações Intensas
                      </span>
                      <v-chip size="small" color="success" variant="flat">
                        Pico: +{{ atletaSelecionado.aceleracaoMaxima?.toFixed(2) }} m/s²
                      </v-chip>
                    </div>
                    <div class="d-flex justify-space-around text-center mt-2">
                      <div>
                        <div class="text-caption text-medium-emphasis">Ações > 2.5 m/s²</div>
                        <div class="text-h5 font-weight-black text-success">
                          {{ atletaSelecionado.aceleracoesAltas || 0 }}
                        </div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Explosivas > 3.0 m/s²</div>
                        <div class="text-h5 font-weight-black text-success">
                          {{ atletaSelecionado.aceleracoesExplosivas || 0 }}
                        </div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Distancia</div>
                        <div class="text-h6 font-weight-bold">
                          {{ atletaSelecionado.distanciaAcelerando?.toFixed(0) || 0 }} m
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <!-- Desaceleracoes -->
                <v-col cols="12" sm="6">
                  <v-card color="surface-variant" class="pa-3" elevation="0">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="font-weight-bold text-error d-flex align-center">
                        <v-icon icon="mdi-arrow-down-bold" class="mr-1"></v-icon>
                        Desacelerações Bruscas (Carga Excêntrica)
                      </span>
                      <v-chip size="small" color="error" variant="flat">
                        Pico: {{ atletaSelecionado.desaceleracaoMaxima?.toFixed(2) }} m/s²
                      </v-chip>
                    </div>
                    <div class="d-flex justify-space-around text-center mt-2">
                      <div>
                        <div class="text-caption text-medium-emphasis">Ações < -2.5 m/s²</div>
                        <div class="text-h5 font-weight-black text-error">
                          {{ atletaSelecionado.desaceleracoesAltas || 0 }}
                        </div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Críticas < -3.0 m/s²</div>
                        <div class="text-h5 font-weight-black text-error">
                          {{ atletaSelecionado.desaceleracoesCriticas || 0 }}
                        </div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Distancia</div>
                        <div class="text-h6 font-weight-bold">
                          {{ atletaSelecionado.distanciaDesacelerando?.toFixed(0) || 0 }} m
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Sprints e Potencia Metabolica -->
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Potência Metabólica (Di Prampero & Osgnach) & Tiros de Sprint
              </div>

              <v-row dense>
                <v-col cols="6" sm="3">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">Contagem de Sprints</div>
                    <div class="text-h5 font-weight-black text-error">
                      {{ atletaSelecionado.sprintsContagem || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Tiros > 19.8 km/h</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">Media por Sprint</div>
                    <div class="text-h5 font-weight-black text-error">
                      {{ atletaSelecionado.distanciaMediaSprint?.toFixed(1) || 0 }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Metros/tiro</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">Potência Metabólica</div>
                    <div class="text-h5 font-weight-black text-warning">
                      {{ atletaSelecionado.potenciaMetabolicaMedia?.toFixed(1) || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">W/kg (Média)</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">HPMD (> 20 W/kg)</div>
                    <div class="text-h5 font-weight-black text-secondary">
                      {{ atletaSelecionado.distanciaAltaPotenciaMetabolica?.toFixed(0) || 0 }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Alta Potência Metabólica</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- ABA 3: CAMPO TATICO E MAPA ESPACIAL -->
            <v-window-item value="campo">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis">
                  Dispersao Espacial & Centroide Tatico (Campo Oficial 105m x 68m)
                </div>
                <div class="text-caption text-medium-emphasis">
                  Centroide: ({{ atletaSelecionado.centroideX }}m, {{ atletaSelecionado.centroideY }}m) &middot; Raio de Acao: &plusmn;{{ atletaSelecionado.raioAcao }}m
                </div>
              </div>

              <!-- Mini Pitch SVG -->
              <div class="pitch-container pa-3">
                <svg
                  viewBox="0 0 1050 680"
                  class="soccer-pitch"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Fundo de Grama com Faixas Verticais -->
                  <defs>
                    <pattern id="grass-stripes" width="105" height="680" patternUnits="userSpaceOnUse">
                      <rect x="0" width="52.5" height="680" fill="#133826" />
                      <rect x="52.5" width="52.5" height="680" fill="#0f2f1f" />
                    </pattern>
                  </defs>
                  <rect width="1050" height="680" fill="url(#grass-stripes)" rx="16" />

                  <!-- Linhas Regulamentares Brancas -->
                  <!-- Borda do Campo -->
                  <rect x="40" y="40" width="970" height="600" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  
                  <!-- Linha Central -->
                  <line x1="525" y1="40" x2="525" y2="640" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  
                  <!-- Circulo Central -->
                  <circle cx="525" cy="340" r="91.5" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="525" cy="340" r="6" fill="rgba(255,255,255,0.9)" />

                  <!-- Grande Area Esquerda -->
                  <rect x="40" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <!-- Pequena Area Esquerda -->
                  <rect x="40" y="245" width="55" height="190" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <!-- Ponto Penal Esquerdo -->
                  <circle cx="150" cy="340" r="5" fill="rgba(255,255,255,0.9)" />
                  <!-- Gol Esquerdo -->
                  <rect x="15" y="295" width="25" height="90" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />

                  <!-- Grande Area Direita -->
                  <rect x="845" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <!-- Pequena Area Direita -->
                  <rect x="955" y="245" width="55" height="190" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <!-- Ponto Penal Direito -->
                  <circle cx="900" cy="340" r="5" fill="rgba(255,255,255,0.9)" />
                  <!-- Gol Direito -->
                  <rect x="1010" y="295" width="25" height="90" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />

                  <!-- Amostras de Trilha Espacial (Pontos de GPS) -->
                  <g opacity="0.6">
                    <circle
                      v-for="(pt, idx) in atletaSelecionado.amostrasPosicao"
                      :key="'pt-' + idx"
                      :cx="pt.x * 10"
                      :cy="pt.y * 10"
                      r="7"
                      fill="#10b981"
                      opacity="0.35"
                    />
                  </g>

                  <!-- Raio de Acao do Atleta (Area de Cobertura) -->
                  <circle
                    :cx="atletaSelecionado.centroideX * 10"
                    :cy="atletaSelecionado.centroideY * 10"
                    :r="Math.max(40, (atletaSelecionado.raioAcao || 15) * 10)"
                    fill="rgba(16, 185, 129, 0.18)"
                    stroke="#10b981"
                    stroke-width="2"
                    stroke-dasharray="6,4"
                  />

                  <!-- Centroide Tatico (Posicao Media do Atleta) -->
                  <g :transform="'translate(' + (atletaSelecionado.centroideX * 10) + ',' + (atletaSelecionado.centroideY * 10) + ')'">
                    <circle r="22" fill="#ef4444" stroke="#ffffff" stroke-width="3" />
                    <text
                      x="0"
                      y="7"
                      text-anchor="middle"
                      fill="#ffffff"
                      font-size="16"
                      font-weight="bold"
                      font-family="sans-serif"
                    >
                      {{ atletaSelecionado.id }}
                    </text>
                  </g>
                </svg>
              </div>

              <div class="d-flex justify-space-between align-center mt-3 text-caption text-medium-emphasis">
                <span>&bull; Marcador Vermelho: Centroide Posicional (#{{ atletaSelecionado.id }})</span>
                <span>&bull; Circulo Pontilhado: Raio de Acao Tatico</span>
                <span>&bull; Pontos Verdes: Amostragem das Coordenadas no Tempo</span>
              </div>
            </v-window-item>

            <!-- ABA 4: RADAR COMPARATIVO (ATLETA VS TIME) -->
            <v-window-item value="radar">
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Comparativo Multidimensional: Atleta #{{ atletaSelecionado.id }} vs Media do Elenco
              </div>

              <v-row align="center">
                <!-- Grafico de Radar em SVG -->
                <v-col cols="12" md="7">
                  <div class="radar-container pa-2 text-center">
                    <svg viewBox="0 0 400 400" class="radar-svg">
                      <!-- Circulos / Poligonos de Nivel do Radar (20%, 40%, 60%, 80%, 100%) -->
                      <polygon
                        v-for="nivel in [0.2, 0.4, 0.6, 0.8, 1.0]"
                        :key="'grid-' + nivel"
                        :points="gerarPoligonoGrid(nivel)"
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        stroke-width="1.5"
                      />

                      <!-- Linhas dos Eixos Radiais -->
                      <line
                        v-for="(eixo, i) in eixosRadar"
                        :key="'axis-' + i"
                        x1="200"
                        y1="200"
                        :x2="calcularCoordenadaRadar(i, 1.0).x"
                        :y2="calcularCoordenadaRadar(i, 1.0).y"
                        stroke="rgba(255,255,255,0.15)"
                        stroke-width="1"
                      />

                      <!-- Camada 1: Media do Time -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarTime)"
                        fill="rgba(56, 189, 248, 0.25)"
                        stroke="#38bdf8"
                        stroke-width="2"
                      />

                      <!-- Camada 2: Atleta Selecionado -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarAtleta)"
                        fill="rgba(16, 185, 129, 0.45)"
                        stroke="#10b981"
                        stroke-width="3"
                      />

                      <!-- Vertices do Atleta -->
                      <circle
                        v-for="(val, i) in dadosRadarAtleta"
                        :key="'vert-' + i"
                        :cx="calcularCoordenadaRadar(i, val).x"
                        :cy="calcularCoordenadaRadar(i, val).y"
                        r="5"
                        fill="#10b981"
                        stroke="#ffffff"
                        stroke-width="1.5"
                      />

                      <!-- Rotulos dos Eixos -->
                      <text
                        v-for="(eixo, i) in eixosRadar"
                        :key="'label-' + i"
                        :x="calcularCoordenadaRadar(i, 1.18).x"
                        :y="calcularCoordenadaRadar(i, 1.18).y + 4"
                        text-anchor="middle"
                        fill="#94a3b8"
                        font-size="11"
                        font-weight="bold"
                      >
                        {{ eixo }}
                      </text>
                    </svg>
                  </div>

                  <div class="d-flex justify-center gap-4 mt-2">
                    <div class="d-flex align-center">
                      <span style="display:inline-block; width:14px; height:14px; background:#10b981; border-radius:3px;" class="mr-2"></span>
                      <span class="text-caption font-weight-bold">Atleta #{{ atletaSelecionado.id }}</span>
                    </div>
                    <div class="d-flex align-center ml-4">
                      <span style="display:inline-block; width:14px; height:14px; background:#38bdf8; border-radius:3px;" class="mr-2"></span>
                      <span class="text-caption font-weight-bold">Média do Elenco</span>
                    </div>
                  </div>
                </v-col>

                <!-- Tabela dos 6 Pilares -->
                <v-col cols="12" md="5">
                  <v-card color="surface-variant" class="pa-3" elevation="0">
                    <div class="text-caption font-weight-bold text-uppercase mb-2 text-primary">
                      Metricas Normalizadas do Radar
                    </div>
                    <div class="d-flex flex-column gap-2 text-body-2">
                      <div class="d-flex justify-space-between py-1 border-b">
                        <span>Volume (Distancia):</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.distanciaTotal.toFixed(0) }} m</span>
                      </div>
                      <div class="d-flex justify-space-between py-1 border-b">
                        <span>Intensidade (M/min):</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.metrosPorMinuto.toFixed(1) }} M/min</span>
                      </div>
                      <div class="d-flex justify-space-between py-1 border-b">
                        <span>Velocidade Maxima:</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.velocidadeMaxima.toFixed(1) }} km/h</span>
                      </div>
                      <div class="d-flex justify-space-between py-1 border-b">
                        <span>Tiros de Sprint:</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.sprintsContagem || 0 }} ações</span>
                      </div>
                      <div class="d-flex justify-space-between py-1 border-b">
                        <span>Acelerações Altas:</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.aceleracoesAltas || 0 }} ações</span>
                      </div>
                      <div class="d-flex justify-space-between py-1">
                        <span>Player Load:</span>
                        <span class="font-weight-bold">{{ atletaSelecionado.playerLoad.toFixed(0) }}</span>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- ABA 5: FISIOLOGIA & ESCALA DE BORG -->
            <v-window-item value="fisiologia">
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Cruzamento Carga Externa (Rastreamento) x Carga Interna (Escala de Borg CR-10)
              </div>

              <!-- Input da Escala de Borg -->
              <v-card color="surface-variant" class="pa-4 mb-4" elevation="0">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-bold">Percepção Subjetiva de Esforço (PSE / Borg CR-10):</span>
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
                  track-color="surface"
                ></v-slider>

                <v-row dense class="mt-2">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="duracaoSessaoMinutos"
                      label="Duração da Sessão (minutos)"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card color="surface" class="pa-2 text-center" elevation="0">
                      <div class="text-caption text-medium-emphasis">Carga da Sessão (Método Foster)</div>
                      <div class="text-h6 font-weight-bold text-secondary">
                        {{ valorBorg * duracaoSessaoMinutos }} <span class="text-caption">U.A. (Unidades Arbitrárias)</span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Índices Avançados de Eficiência -->
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Índices de Eficiência Física & Relação Carga/Esforço
              </div>

              <v-row dense class="mb-4">
                <v-col cols="6" sm="6">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">Índice HSR / Borg</div>
                    <div class="text-h5 font-weight-black text-primary">
                      {{ ((atletaSelecionado.distanciaSprint || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Metros de Sprint por ponto de PSE</div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="6">
                  <v-card class="pa-3 text-center" variant="outlined" border>
                    <div class="text-caption text-medium-emphasis">Player Load / Borg</div>
                    <div class="text-h5 font-weight-black text-warning">
                      {{ ((atletaSelecionado.playerLoad || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Carga Mecânica por ponto de PSE</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Parecer Fisiológico da Comissão Técnica -->
              <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-2">
                Diagnóstico Fisiológico Integrado da Comissão Técnica
              </div>

              <v-alert
                :type="diagnosticoAtleta.tipo"
                variant="tonal"
                class="mb-0"
              >
                <template v-slot:title>
                  <div class="font-weight-bold">{{ diagnosticoAtleta.titulo }}</div>
                </template>
                <div class="text-body-2 mb-2">{{ diagnosticoAtleta.mensagem }}</div>
                <div class="text-caption font-weight-bold text-primary">
                  Conduta Recomendada: {{ diagnosticoAtleta.recomendacao }}
                </div>
              </v-alert>
            </v-window-item>

          </v-window>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="modalDetalhesAberto = false">Fechar</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-check"
            @click="salvarSimulacaoBorg"
            class="font-weight-bold"
          >
            Registrar Avaliação Fisiológica
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estado da UI
const tabInput = ref('url')
const arquivoSelecionado = ref(null)
const urlArquivo = ref('')
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const filtroBusca = ref('')

// Dados dos Atletas
const atletas = ref([])

// Estado do Modal de Detalhes
const modalDetalhesAberto = ref(false)
const atletaSelecionado = ref(null)
const abaModal = ref('cinematica')
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

// Computeds Gerais
const atletasFiltrados = computed(() => {
  if (!filtroBusca.value) return atletas.value
  const termo = filtroBusca.value.toLowerCase().trim()
  return atletas.value.filter(a => 
    String(a.id).toLowerCase().includes(termo) ||
    String(a.posicaoSugerida || '').toLowerCase().includes(termo)
  )
})

const distanciaColetivaKm = computed(() => {
  const totalM = atletas.value.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
  return totalM / 1000
})

const mediaMetrosPorMinuto = computed(() => {
  if (atletas.value.length === 0) return 0
  const soma = atletas.value.reduce((acc, a) => acc + (a.metrosPorMinuto || 0), 0)
  return soma / atletas.value.length
})

const maiorVelocidade = computed(() => {
  if (atletas.value.length === 0) return 0
  return Math.max(...atletas.value.map(a => a.velocidadeMaxima || 0))
})

const atletaMaisRapido = computed(() => {
  if (atletas.value.length === 0) return null
  return [...atletas.value].sort((a, b) => b.velocidadeMaxima - a.velocidadeMaxima)[0]
})

const totalAceleracoesAltas = computed(() => {
  return atletas.value.reduce((acc, a) => acc + (a.aceleracoesAltas || 0), 0)
})

const totalHpmdM = computed(() => {
  return atletas.value.reduce((acc, a) => acc + (a.distanciaAltaPotenciaMetabolica || 0), 0)
})

function percentualZona(atleta, campo) {
  if (!atleta || !atleta.distanciaTotal || atleta.distanciaTotal === 0) return 0
  return ((atleta[campo] || 0) / atleta.distanciaTotal) * 100
}

// Radar de Performance (SVG)
const eixosRadar = ['Volume', 'Intensidade', 'Vel. Max', 'Sprints', 'Acelerações', 'Player Load']

const dadosRadarTime = computed(() => {
  if (atletas.value.length === 0) return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  // Normalização relativa (0 a 1) para o time
  return [0.7, 0.7, 0.75, 0.65, 0.7, 0.7]
})

const dadosRadarAtleta = computed(() => {
  if (!atletaSelecionado.value || atletas.value.length === 0) return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  const a = atletaSelecionado.value

  const maxDist = Math.max(...atletas.value.map(x => x.distanciaTotal || 1))
  const maxMmin = Math.max(...atletas.value.map(x => x.metrosPorMinuto || 1))
  const maxVmax = Math.max(...atletas.value.map(x => x.velocidadeMaxima || 1))
  const maxSpr = Math.max(...atletas.value.map(x => x.sprintsContagem || 1))
  const maxAcel = Math.max(...atletas.value.map(x => x.aceleracoesAltas || 1))
  const maxPL = Math.max(...atletas.value.map(x => x.playerLoad || 1))

  return [
    Math.min(1.0, Math.max(0.1, (a.distanciaTotal || 0) / maxDist)),
    Math.min(1.0, Math.max(0.1, (a.metrosPorMinuto || 0) / maxMmin)),
    Math.min(1.0, Math.max(0.1, (a.velocidadeMaxima || 0) / maxVmax)),
    Math.min(1.0, Math.max(0.1, (a.sprintsContagem || 0) / maxSpr)),
    Math.min(1.0, Math.max(0.1, (a.aceleracoesAltas || 0) / maxAcel)),
    Math.min(1.0, Math.max(0.1, (a.playerLoad || 0) / maxPL))
  ]
})

function calcularCoordenadaRadar(indice, proporcao) {
  const centroX = 200
  const centroY = 200
  const raioMax = 140
  const angulo = (indice / 6) * 2 * Math.PI - Math.PI / 2
  const r = raioMax * proporcao
  return {
    x: centroX + r * Math.cos(angulo),
    y: centroY + r * Math.sin(angulo)
  }
}

function gerarPontosRadar(dados) {
  return dados.map((val, idx) => {
    const pt = calcularCoordenadaRadar(idx, val)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

function gerarPoligonoGrid(proporcao) {
  return [0, 1, 2, 3, 4, 5].map(idx => {
    const pt = calcularCoordenadaRadar(idx, proporcao)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

// Modal de Detalhes
function abrirPerfilDetalhado(atleta) {
  atletaSelecionado.value = atleta
  abaModal.value = 'cinematica'
  valorBorg.value = 6
  duracaoSessaoMinutos.value = 90
  modalDetalhesAberto.value = true
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
    mensagemSucesso.value = `Sucesso! Foram calculadas as metricas detalhadas de ${json.quantidadeJogadores} atletas e sincronizadas com o Supabase.`
  } catch (err) {
    console.error('Erro na requisicao:', err)
    mensagemErro.value = `Erro ao comunicar com o backend: ${err.message}`
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

// Mock de Demonstracao Completa (11 Atletas)
function carregarMockDemonstracao() {
  atletas.value = [
    {
      id: '1',
      posicaoSugerida: 'Goleiro',
      distanciaTotal: 4850.0,
      velocidadeMaxima: 24.2,
      velocidadeMedia: 3.2,
      metrosPorMinuto: 53.8,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3800.0,
      distanciaTrotando: 850.0,
      distanciaCorrendo: 180.0,
      distanciaSprint: 20.0,
      aceleracoesAltas: 8,
      aceleracoesExplosivas: 3,
      desaceleracoesAltas: 9,
      desaceleracoesCriticas: 2,
      distanciaAcelerando: 120.0,
      distanciaDesacelerando: 130.0,
      aceleracaoMaxima: 3.1,
      desaceleracaoMaxima: -3.3,
      playerLoad: 280.0,
      sprintsContagem: 2,
      distanciaMediaSprint: 10.0,
      potenciaMetabolicaMedia: 5.4,
      distanciaAltaPotenciaMetabolica: 320.0,
      centroideX: 12.5,
      centroideY: 34.0,
      raioAcao: 9.5,
      amostrasPosicao: [
        { x: 12.0, y: 34.0 }, { x: 11.5, y: 32.0 }, { x: 13.0, y: 36.0 }, { x: 14.2, y: 33.5 }, { x: 10.8, y: 34.5 }
      ]
    },
    {
      id: '2',
      posicaoSugerida: 'Lateral Direito',
      distanciaTotal: 10850.0,
      velocidadeMaxima: 33.8,
      velocidadeMedia: 7.2,
      metrosPorMinuto: 120.5,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3700.0,
      distanciaTrotando: 4400.0,
      distanciaCorrendo: 1950.0,
      distanciaSprint: 800.0,
      aceleracoesAltas: 48,
      aceleracoesExplosivas: 19,
      desaceleracoesAltas: 52,
      desaceleracoesCriticas: 22,
      distanciaAcelerando: 810.0,
      distanciaDesacelerando: 840.0,
      aceleracaoMaxima: 4.3,
      desaceleracaoMaxima: -4.8,
      playerLoad: 760.0,
      sprintsContagem: 32,
      distanciaMediaSprint: 25.0,
      potenciaMetabolicaMedia: 11.8,
      distanciaAltaPotenciaMetabolica: 1850.0,
      centroideX: 55.0,
      centroideY: 58.0,
      raioAcao: 24.5,
      amostrasPosicao: [
        { x: 35.0, y: 56.0 }, { x: 48.0, y: 59.0 }, { x: 65.0, y: 62.0 }, { x: 78.0, y: 60.0 }, { x: 42.0, y: 57.0 }
      ]
    },
    {
      id: '3',
      posicaoSugerida: 'Zagueiro Central',
      distanciaTotal: 9600.0,
      velocidadeMaxima: 29.5,
      velocidadeMedia: 6.4,
      metrosPorMinuto: 106.6,
      tempoTotalSegundos: 5400,
      distanciaAndando: 4200.0,
      distanciaTrotando: 3800.0,
      distanciaCorrendo: 1300.0,
      distanciaSprint: 300.0,
      aceleracoesAltas: 28,
      aceleracoesExplosivas: 10,
      desaceleracoesAltas: 34,
      desaceleracoesCriticas: 14,
      distanciaAcelerando: 450.0,
      distanciaDesacelerando: 490.0,
      aceleracaoMaxima: 3.6,
      desaceleracaoMaxima: -4.1,
      playerLoad: 580.0,
      sprintsContagem: 14,
      distanciaMediaSprint: 21.4,
      potenciaMetabolicaMedia: 9.1,
      distanciaAltaPotenciaMetabolica: 1120.0,
      centroideX: 32.0,
      centroideY: 26.0,
      raioAcao: 16.8,
      amostrasPosicao: [
        { x: 26.0, y: 24.0 }, { x: 34.0, y: 27.0 }, { x: 38.0, y: 25.0 }, { x: 29.0, y: 28.0 }
      ]
    },
    {
      id: '4',
      posicaoSugerida: 'Zagueiro Central',
      distanciaTotal: 9400.0,
      velocidadeMaxima: 28.9,
      velocidadeMedia: 6.2,
      metrosPorMinuto: 104.4,
      tempoTotalSegundos: 5400,
      distanciaAndando: 4300.0,
      distanciaTrotando: 3750.0,
      distanciaCorrendo: 1150.0,
      distanciaSprint: 200.0,
      aceleracoesAltas: 24,
      aceleracoesExplosivas: 8,
      desaceleracoesAltas: 30,
      desaceleracoesCriticas: 11,
      distanciaAcelerando: 410.0,
      distanciaDesacelerando: 430.0,
      aceleracaoMaxima: 3.4,
      desaceleracaoMaxima: -3.9,
      playerLoad: 550.0,
      sprintsContagem: 10,
      distanciaMediaSprint: 20.0,
      potenciaMetabolicaMedia: 8.8,
      distanciaAltaPotenciaMetabolica: 980.0,
      centroideX: 33.0,
      centroideY: 42.0,
      raioAcao: 15.9,
      amostrasPosicao: [
        { x: 28.0, y: 40.0 }, { x: 35.0, y: 44.0 }, { x: 39.0, y: 41.0 }, { x: 30.0, y: 43.0 }
      ]
    },
    {
      id: '6',
      posicaoSugerida: 'Lateral Esquerdo',
      distanciaTotal: 10600.0,
      velocidadeMaxima: 32.6,
      velocidadeMedia: 7.0,
      metrosPorMinuto: 117.7,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3850.0,
      distanciaTrotando: 4300.0,
      distanciaCorrendo: 1800.0,
      distanciaSprint: 650.0,
      aceleracoesAltas: 44,
      aceleracoesExplosivas: 16,
      desaceleracoesAltas: 49,
      desaceleracoesCriticas: 19,
      distanciaAcelerando: 740.0,
      distanciaDesacelerando: 790.0,
      aceleracaoMaxima: 4.1,
      desaceleracaoMaxima: -4.5,
      playerLoad: 720.0,
      sprintsContagem: 26,
      distanciaMediaSprint: 25.0,
      potenciaMetabolicaMedia: 11.2,
      distanciaAltaPotenciaMetabolica: 1680.0,
      centroideX: 52.0,
      centroideY: 12.0,
      raioAcao: 23.8,
      amostrasPosicao: [
        { x: 34.0, y: 11.0 }, { x: 49.0, y: 13.0 }, { x: 67.0, y: 10.0 }, { x: 75.0, y: 14.0 }
      ]
    },
    {
      id: '5',
      posicaoSugerida: 'Volante / Primeiro Meio-Campo',
      distanciaTotal: 11400.0,
      velocidadeMaxima: 30.2,
      velocidadeMedia: 7.6,
      metrosPorMinuto: 126.6,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3400.0,
      distanciaTrotando: 5100.0,
      distanciaCorrendo: 2400.0,
      distanciaSprint: 500.0,
      aceleracoesAltas: 54,
      aceleracoesExplosivas: 20,
      desaceleracoesAltas: 58,
      desaceleracoesCriticas: 24,
      distanciaAcelerando: 880.0,
      distanciaDesacelerando: 920.0,
      aceleracaoMaxima: 3.9,
      desaceleracaoMaxima: -4.4,
      playerLoad: 840.0,
      sprintsContagem: 22,
      distanciaMediaSprint: 22.7,
      potenciaMetabolicaMedia: 12.4,
      distanciaAltaPotenciaMetabolica: 2100.0,
      centroideX: 48.0,
      centroideY: 34.0,
      raioAcao: 21.0,
      amostrasPosicao: [
        { x: 42.0, y: 30.0 }, { x: 50.0, y: 38.0 }, { x: 55.0, y: 33.0 }, { x: 45.0, y: 36.0 }
      ]
    },
    {
      id: '8',
      posicaoSugerida: 'Meio-Campista Central',
      distanciaTotal: 11650.0,
      velocidadeMaxima: 31.4,
      velocidadeMedia: 7.7,
      metrosPorMinuto: 129.4,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3300.0,
      distanciaTrotando: 5200.0,
      distanciaCorrendo: 2500.0,
      distanciaSprint: 650.0,
      aceleracoesAltas: 58,
      aceleracoesExplosivas: 22,
      desaceleracoesAltas: 62,
      desaceleracoesCriticas: 26,
      distanciaAcelerando: 910.0,
      distanciaDesacelerando: 950.0,
      aceleracaoMaxima: 4.0,
      desaceleracaoMaxima: -4.6,
      playerLoad: 870.0,
      sprintsContagem: 27,
      distanciaMediaSprint: 24.0,
      potenciaMetabolicaMedia: 12.7,
      distanciaAltaPotenciaMetabolica: 2240.0,
      centroideX: 56.0,
      centroideY: 36.0,
      raioAcao: 22.4,
      amostrasPosicao: [
        { x: 46.0, y: 32.0 }, { x: 58.0, y: 40.0 }, { x: 66.0, y: 35.0 }, { x: 52.0, y: 38.0 }
      ]
    },
    {
      id: '10',
      posicaoSugerida: 'Meio-Campista Ofensivo / Armador',
      distanciaTotal: 10200.0,
      velocidadeMaxima: 31.1,
      velocidadeMedia: 6.8,
      metrosPorMinuto: 113.3,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3900.0,
      distanciaTrotando: 4200.0,
      distanciaCorrendo: 1600.0,
      distanciaSprint: 500.0,
      aceleracoesAltas: 42,
      aceleracoesExplosivas: 18,
      desaceleracoesAltas: 46,
      desaceleracoesCriticas: 18,
      distanciaAcelerando: 690.0,
      distanciaDesacelerando: 720.0,
      aceleracaoMaxima: 4.2,
      desaceleracaoMaxima: -4.3,
      playerLoad: 690.0,
      sprintsContagem: 20,
      distanciaMediaSprint: 25.0,
      potenciaMetabolicaMedia: 10.6,
      distanciaAltaPotenciaMetabolica: 1540.0,
      centroideX: 62.0,
      centroideY: 32.0,
      raioAcao: 19.5,
      amostrasPosicao: [
        { x: 54.0, y: 28.0 }, { x: 64.0, y: 35.0 }, { x: 72.0, y: 30.0 }, { x: 60.0, y: 34.0 }
      ]
    },
    {
      id: '7',
      posicaoSugerida: 'Ponta / Extremo Direito',
      distanciaTotal: 11250.0,
      velocidadeMaxima: 34.8,
      velocidadeMedia: 7.5,
      metrosPorMinuto: 125.0,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3600.0,
      distanciaTrotando: 4650.0,
      distanciaCorrendo: 2150.0,
      distanciaSprint: 850.0,
      aceleracoesAltas: 52,
      aceleracoesExplosivas: 25,
      desaceleracoesAltas: 55,
      desaceleracoesCriticas: 25,
      distanciaAcelerando: 880.0,
      distanciaDesacelerando: 910.0,
      aceleracaoMaxima: 4.6,
      desaceleracaoMaxima: -5.1,
      playerLoad: 810.0,
      sprintsContagem: 36,
      distanciaMediaSprint: 23.6,
      potenciaMetabolicaMedia: 12.3,
      distanciaAltaPotenciaMetabolica: 2080.0,
      centroideX: 68.0,
      centroideY: 55.0,
      raioAcao: 24.2,
      amostrasPosicao: [
        { x: 55.0, y: 52.0 }, { x: 72.0, y: 58.0 }, { x: 88.0, y: 56.0 }, { x: 64.0, y: 54.0 }
      ]
    },
    {
      id: '11',
      posicaoSugerida: 'Ponta / Extremo Esquerdo',
      distanciaTotal: 10950.0,
      velocidadeMaxima: 34.1,
      velocidadeMedia: 7.3,
      metrosPorMinuto: 121.6,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3750.0,
      distanciaTrotando: 4500.0,
      distanciaCorrendo: 1950.0,
      distanciaSprint: 750.0,
      aceleracoesAltas: 48,
      aceleracoesExplosivas: 21,
      desaceleracoesAltas: 50,
      desaceleracoesCriticas: 22,
      distanciaAcelerando: 820.0,
      distanciaDesacelerando: 850.0,
      aceleracaoMaxima: 4.4,
      desaceleracaoMaxima: -4.9,
      playerLoad: 780.0,
      sprintsContagem: 31,
      distanciaMediaSprint: 24.2,
      potenciaMetabolicaMedia: 11.9,
      distanciaAltaPotenciaMetabolica: 1920.0,
      centroideX: 66.0,
      centroideY: 15.0,
      raioAcao: 23.5,
      amostrasPosicao: [
        { x: 52.0, y: 14.0 }, { x: 70.0, y: 12.0 }, { x: 85.0, y: 16.0 }, { x: 62.0, y: 13.0 }
      ]
    },
    {
      id: '9',
      posicaoSugerida: 'Centroavante / Atacante',
      distanciaTotal: 10100.0,
      velocidadeMaxima: 33.5,
      velocidadeMedia: 6.7,
      metrosPorMinuto: 112.2,
      tempoTotalSegundos: 5400,
      distanciaAndando: 3950.0,
      distanciaTrotando: 3850.0,
      distanciaCorrendo: 1600.0,
      distanciaSprint: 700.0,
      aceleracoesAltas: 40,
      aceleracoesExplosivas: 19,
      desaceleracoesAltas: 45,
      desaceleracoesCriticas: 20,
      distanciaAcelerando: 710.0,
      distanciaDesacelerando: 760.0,
      aceleracaoMaxima: 4.3,
      desaceleracaoMaxima: -4.8,
      playerLoad: 690.0,
      sprintsContagem: 28,
      distanciaMediaSprint: 25.0,
      potenciaMetabolicaMedia: 10.8,
      distanciaAltaPotenciaMetabolica: 1680.0,
      centroideX: 74.0,
      centroideY: 34.0,
      raioAcao: 18.2,
      amostrasPosicao: [
        { x: 62.0, y: 31.0 }, { x: 75.0, y: 35.0 }, { x: 88.0, y: 33.0 }, { x: 70.0, y: 37.0 }
      ]
    }
  ]
  mensagemSucesso.value = 'Demonstracao completa carregada com sucesso! 11 atletas distribuidos por posicoes taticas com calculos inerciais, metabolicos e espaciais.'
}

// Funcoes Fisiologicas (Borg CR-10)
function descricaoBorg(val) {
  if (val <= 1) return 'Muito Leve / Repouso'
  if (val <= 3) return 'Leve / Moderado'
  if (val <= 5) return 'Pesado / Desafiador'
  if (val <= 7) return 'Muito Pesado / Intenso'
  if (val <= 9) return 'Extremamente Intenso'
  return 'Exaustão Máxima'
}

function corBorg(val) {
  if (val <= 3) return 'success'
  if (val <= 6) return 'info'
  if (val <= 8) return 'warning'
  return 'error'
}

const diagnosticoAtleta = computed(() => {
  if (!atletaSelecionado.value) return { tipo: 'info', titulo: '', mensagem: '', recomendacao: '' }

  const sprint = atletaSelecionado.value.distanciaSprint || 0
  const borg = valorBorg.value

  if (borg >= 8 && sprint < 450) {
    return {
      tipo: 'error',
      titulo: 'Alerta Vermelho: Fadiga Residual / Risco Neuromuscular',
      mensagem: 'O atleta relatou esforço desproporcionalmente alto (PSE >= 8) para um volume baixo de corrida de alta intensidade. Indica estresse acumulado ou recuperação insuficiente.',
      recomendacao: 'Protocolo regenerativo prioritário: crioterapia, drenagem, sono estendido e teste de Creatina Quinase (CK).'
    }
  } else if (borg <= 5 && sprint >= 650) {
    return {
      tipo: 'success',
      titulo: 'Excelente Eficiência Física (Alta Prontidão)',
      mensagem: 'O atleta sustentou alta demanda física e múltiplos tiros de sprint mantendo baixa percepção subjetiva de esforço. Ótima capacidade cardiorrespiratória.',
      recomendacao: 'Atleta em pico de forma competitiva. Manter a carga programada e rotina nutricional habitual.'
    }
  } else if (borg >= 7) {
    return {
      tipo: 'warning',
      titulo: 'Carga Interna Elevada (Desgaste Fisiológico)',
      mensagem: 'Partida com alto estresse metabólico compatível com a exigência física do jogo.',
      recomendacao: 'Reidratação monitorada com eletrólitos e carga de carboidratos nas primeiras 4 horas pós-sessão.'
    }
  } else {
    return {
      tipo: 'info',
      titulo: 'Resposta Fisiológica Equilibrada',
      mensagem: 'A relação entre volume de corrida externa e percepção de esforço interna está perfeitamente alinhada para a duração da partida.',
      recomendacao: 'Seguir o plano padrão de treinos e recuperação do microciclo.'
    }
  }
})

function salvarSimulacaoBorg() {
  mensagemSucesso.value = `Avaliação registrada para o Atleta #${atletaSelecionado.value.id}! Carga Foster: ${valorBorg.value * duracaoSessaoMinutos.value} U.A. (Borg ${valorBorg.value}).`
  modalDetalhesAberto.value = false
}
</script>

<style scoped>
.app-background {
  background: radial-gradient(circle at 10% 15%, #0a1329 0%, #050811 90%) !important;
  color: #e2e8f0;
  min-height: 100vh;
}

.max-content-width {
  max-width: 1440px;
  margin: 0 auto;
}

.glass-card {
  background: rgba(14, 23, 42, 0.78) !important;
  backdrop-filter: blur(14px);
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
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.08);
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

/* Pitch & Radar Containers */
.pitch-container {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.soccer-pitch {
  width: 100%;
  max-height: 480px;
  border-radius: 10px;
}

.radar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
}
</style>
