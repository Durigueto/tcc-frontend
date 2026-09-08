<template>
  <v-app class="app-background">
    <!-- Barra Superior Institucional -->
    <v-app-bar color="#0b0f19" elevation="1" border="b" density="comfortable">
      <template v-slot:prepend>
        <div class="brand-badge mr-3">
          <span class="brand-text">V90</span>
        </div>
      </template>

      <div>
        <div class="d-flex align-center">
          <span class="text-h6 font-weight-black tracking-wider text-white">VISAO<span class="text-primary">90</span></span>
          <span class="text-caption text-medium-emphasis ml-2 d-none d-sm-inline border-s ps-2">
            Sistema de Análise Cinemática e Carga Fisiológica no Futebol
          </span>
        </div>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center gap-2">
        <v-chip size="small" variant="flat" color="surface-variant" class="font-weight-medium text-caption">
          <v-icon start icon="mdi-shield-check" size="14" color="success"></v-icon>
          Sessão Oficial
        </v-chip>

        <v-chip size="small" variant="outlined" color="primary" class="font-weight-medium text-caption d-none d-md-inline-flex">
          <v-icon start icon="mdi-database-check" size="14"></v-icon>
          Supabase PostgreSQL
        </v-chip>
      </div>
    </v-app-bar>

    <v-main class="py-6 px-4 px-md-8">
      <v-container fluid class="pa-0 max-content-width">

        <!-- Painel de Ingestao de Dados -->
        <v-card class="corporate-card mb-6" elevation="0">
          <v-card-item class="pa-5">
            <div class="d-flex flex-wrap align-center justify-space-between mb-4">
              <div>
                <div class="text-overline text-primary font-weight-bold letter-spacing-1">
                  MÓDULO DE ENTRADA
                </div>
                <h2 class="text-h6 font-weight-bold text-white">
                  Ingestão de Dados de Rastreamento
                </h2>
                <p class="text-caption text-medium-emphasis mt-1">
                  Importe as coordenadas espaciais dos atletas (25 Hz / 105 × 68 m) via arquivo CSV ou repositório de dados.
                </p>
              </div>

              <!-- Abas de Entrada -->
              <v-tabs v-model="tabInput" density="compact" color="primary" class="corporate-tabs">
                <v-tab value="file">
                  <v-icon start icon="mdi-file-delimited-outline" size="18"></v-icon> Arquivo CSV
                </v-tab>
                <v-tab value="url">
                  <v-icon start icon="mdi-cloud-download-outline" size="18"></v-icon> Repositório Online
                </v-tab>
              </v-tabs>
            </div>

            <v-window v-model="tabInput" class="mt-2">
              <!-- Aba 1: Upload de Arquivo -->
              <v-window-item value="file">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <v-file-input
                      v-model="arquivoSelecionado"
                      label="Selecionar arquivo CSV de coordenadas"
                      accept=".csv,text/csv"
                      prepend-icon="mdi-file-table-outline"
                      variant="outlined"
                      density="compact"
                      color="primary"
                      clearable
                      show-size
                      hide-details
                      class="input-corporate"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="primary"
                      size="large"
                      block
                      :loading="carregando"
                      :disabled="!arquivoSelecionado"
                      @click="processarPorUpload"
                      class="font-weight-bold btn-corporate"
                    >
                      Processar Cinemática
                    </v-btn>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Aba 2: URL / Repositorio -->
              <v-window-item value="url">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="urlArquivo"
                      label="URL do arquivo de rastreamento ótico (.csv)"
                      variant="outlined"
                      density="compact"
                      color="primary"
                      hide-details
                      placeholder="https://..."
                      class="input-corporate"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="primary"
                      size="large"
                      block
                      :loading="carregando"
                      :disabled="!urlArquivo"
                      @click="processarPorUrl"
                      class="font-weight-bold btn-corporate"
                    >
                      Carregar & Processar
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Atalhos / Presets Tecnicos -->
                <div class="mt-4 d-flex flex-wrap align-center gap-2 pt-3 border-t">
                  <span class="text-caption text-medium-emphasis mr-2">Conjuntos de Teste:</span>
                  <v-btn
                    size="small"
                    variant="outlined"
                    color="secondary"
                    @click="aplicarPreset('home')"
                    class="text-caption font-weight-medium"
                  >
                    Equipe A (Mandante)
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="outlined"
                    color="secondary"
                    @click="aplicarPreset('away')"
                    class="text-caption font-weight-medium"
                  >
                    Equipe B (Visitante)
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    @click="carregarMockDemonstracao"
                    class="text-caption font-weight-bold ml-auto"
                    prepend-icon="mdi-account-group"
                  >
                    Carregar Amostra Completa (11 Atletas)
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-item>
        </v-card>

        <!-- Alertas de Feedback -->
        <v-alert
          v-if="mensagemErro"
          type="error"
          variant="tonal"
          closable
          class="mb-6 alert-corporate"
          @click:close="mensagemErro = ''"
        >
          {{ mensagemErro }}
        </v-alert>

        <v-alert
          v-if="mensagemSucesso"
          type="success"
          variant="tonal"
          closable
          class="mb-6 alert-corporate"
          @click:close="mensagemSucesso = ''"
        >
          {{ mensagemSucesso }}
        </v-alert>

        <!-- Dashboard do Elenco (Exibido quando houver atletas) -->
        <div v-if="atletas.length > 0">
          
          <!-- Secao: Indicadores Gerais do Elenco -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-overline text-medium-emphasis font-weight-bold">
              PAINEL EXECUTIVO &bull; RESUMO GERAL DO ELENCO
            </div>
            <div class="text-caption text-medium-emphasis">
              Dimensões do Gramado: 105m &times; 68m &bull; Total: 7.140 m²
            </div>
          </div>

          <v-row class="mb-6" dense>
            <!-- KPI 1: Efetivo -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Atletas Monitorados
                  </div>
                  <div class="text-h4 font-weight-bold text-white mt-1">
                    {{ atletas.length }}
                  </div>
                  <div class="text-caption text-success mt-1 d-flex align-center">
                    <v-icon icon="mdi-check-circle-outline" size="14" class="mr-1"></v-icon>
                    Sessão Integral
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- KPI 2: Distancia Coletiva -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Distância Total
                  </div>
                  <div class="text-h4 font-weight-bold text-primary mt-1">
                    {{ distanciaColetivaKm.toFixed(1) }} <span class="text-caption text-medium-emphasis">km</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Média: {{ (distanciaColetivaKm / atletas.length).toFixed(1) }} km/atleta
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- KPI 3: Intensidade Media -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Intensidade Média
                  </div>
                  <div class="text-h4 font-weight-bold text-white mt-1">
                    {{ mediaMetrosPorMinuto.toFixed(0) }} <span class="text-caption text-medium-emphasis">M/min</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Referência: 100 - 125
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- KPI 4: Velocidade de Pico -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Pico de Velocidade
                  </div>
                  <div class="text-h4 font-weight-bold text-warning mt-1">
                    {{ maiorVelocidade.toFixed(1) }} <span class="text-caption text-medium-emphasis">km/h</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Atleta #{{ atletaMaisRapido?.id || '-' }}
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- KPI 5: Aceleracoes Explosivas -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Acelerações > 2.5 m/s²
                  </div>
                  <div class="text-h4 font-weight-bold text-success mt-1">
                    {{ totalAceleracoesAltas }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Demanda Neuromuscular
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <!-- KPI 6: Carga Metabolica HPMD -->
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-card class="corporate-card kpi-box" elevation="0">
                <v-card-item class="pa-4">
                  <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Carga HPMD (> 20 W/kg)
                  </div>
                  <div class="text-h4 font-weight-bold text-info mt-1">
                    {{ (totalHpmdM / 1000).toFixed(1) }} <span class="text-caption text-medium-emphasis">km</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Potência Metabólica
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>

          <!-- Tabela Executiva dos Atletas -->
          <v-card class="corporate-card mb-6" elevation="0">
            <div class="pa-4 d-flex flex-wrap align-center justify-space-between border-b">
              <div>
                <div class="text-subtitle-1 font-weight-bold text-white">
                  Quadro Geral de Avaliação Individual
                </div>
                <div class="text-caption text-medium-emphasis">
                  Métricas físicas, inerciais e de intensidade registradas para cada jogador.
                </div>
              </div>
              <v-text-field
                v-model="filtroBusca"
                placeholder="Filtrar por número ou função tática..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 320px"
                class="input-corporate"
              ></v-text-field>
            </div>

            <v-table class="table-corporate">
              <thead>
                <tr>
                  <th class="text-left">Atleta</th>
                  <th class="text-left">Posição Tática</th>
                  <th class="text-right">Distância Total</th>
                  <th class="text-right">Intensidade</th>
                  <th class="text-right">Vel. Máxima</th>
                  <th class="text-center">Acel. / Desacel.</th>
                  <th class="text-right">Sprints</th>
                  <th class="text-right">Player Load</th>
                  <th class="text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="atleta in atletasFiltrados" :key="atleta.id">
                  <!-- Identificador -->
                  <td>
                    <div class="d-flex align-center py-2">
                      <div class="player-number mr-3">#{{ atleta.id }}</div>
                      <span class="font-weight-bold text-white">Jogador {{ atleta.id }}</span>
                    </div>
                  </td>

                  <!-- Posicao Tatica -->
                  <td>
                    <span class="text-caption font-weight-medium text-slate-300">
                      {{ atleta.posicaoSugerida || 'Em Campo' }}
                    </span>
                  </td>

                  <!-- Distancia Total -->
                  <td class="text-right font-mono">
                    <span class="font-weight-bold text-white">{{ (atleta.distanciaTotal).toFixed(0) }} m</span>
                    <span class="text-caption text-medium-emphasis ml-1">({{ (atleta.distanciaTotal / 1000).toFixed(2) }} km)</span>
                  </td>

                  <!-- Intensidade (M/min) -->
                  <td class="text-right font-mono">
                    <v-chip
                      size="x-small"
                      :color="atleta.metrosPorMinuto >= 120 ? 'error' : atleta.metrosPorMinuto >= 105 ? 'primary' : 'surface-variant'"
                      variant="flat"
                      class="font-weight-bold"
                    >
                      {{ atleta.metrosPorMinuto ? atleta.metrosPorMinuto.toFixed(1) : '-' }} M/min
                    </v-chip>
                  </td>

                  <!-- Vel. Maxima -->
                  <td class="text-right font-mono text-white font-weight-medium">
                    {{ atleta.velocidadeMaxima.toFixed(1) }} km/h
                  </td>

                  <!-- Aceleracoes vs Desaceleracoes -->
                  <td class="text-center font-mono">
                    <span class="text-success font-weight-bold">+{{ atleta.aceleracoesAltas || 0 }}</span>
                    <span class="text-medium-emphasis mx-1">/</span>
                    <span class="text-error font-weight-bold">-{{ atleta.desaceleracoesAltas || 0 }}</span>
                  </td>

                  <!-- Sprints -->
                  <td class="text-right font-mono">
                    <span class="font-weight-bold text-white">{{ atleta.sprintsContagem || 0 }}</span>
                    <span class="text-caption text-medium-emphasis ml-1">({{ atleta.distanciaSprint?.toFixed(0) || 0 }} m)</span>
                  </td>

                  <!-- Player Load -->
                  <td class="text-right font-mono font-weight-bold text-white">
                    {{ atleta.playerLoad?.toFixed(0) || '-' }}
                  </td>

                  <!-- Botao Ficha Tecnica -->
                  <td class="text-center">
                    <v-btn
                      size="small"
                      variant="outlined"
                      color="primary"
                      @click="abrirPerfilDetalhado(atleta)"
                      class="text-caption font-weight-bold btn-table"
                    >
                      Ficha Técnica
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>

        <!-- Estado Vazio -->
        <v-card v-else class="corporate-card text-center pa-10" elevation="0">
          <div class="empty-state-container">
            <v-icon icon="mdi-file-chart-outline" size="54" color="medium-emphasis" class="mb-3"></v-icon>
            <h3 class="text-h6 font-weight-bold text-white">Nenhum Registro de Sessão Carregado</h3>
            <p class="text-body-2 text-medium-emphasis mt-2" style="max-width: 520px; margin: 0 auto;">
              Utilize o módulo de ingestão acima para carregar as coordenadas de uma partida ou clique no botão abaixo para explorar o relatório técnico com um elenco completo de 11 jogadores.
            </p>
            <v-btn
              color="primary"
              class="mt-5 font-weight-bold btn-corporate px-6"
              prepend-icon="mdi-account-group"
              @click="carregarMockDemonstracao"
            >
              Carregar Dados da Partida (11 Atletas)
            </v-btn>
          </div>
        </v-card>

      </v-container>
    </v-main>

    <!-- MODAL EXECUTIVO: FICHA TÉCNICA E FISIOLÓGICA DO ATLETA -->
    <v-dialog v-model="modalDetalhesAberto" max-width="920" scrollable>
      <v-card class="corporate-modal pa-0" elevation="10" border v-if="atletaSelecionado">
        
        <!-- Cabecalho da Ficha -->
        <div class="pa-5 border-b d-flex align-center justify-space-between flex-wrap gap-3 bg-slate-900">
          <div class="d-flex align-center">
            <div class="player-avatar-large mr-4">
              #{{ atletaSelecionado.id }}
            </div>
            <div>
              <div class="d-flex align-center gap-2">
                <h3 class="text-h6 font-weight-bold text-white">Jogador {{ atletaSelecionado.id }}</h3>
                <v-chip size="small" variant="flat" color="primary" class="font-weight-bold text-caption">
                  {{ atletaSelecionado.posicaoSugerida }}
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                Relatório Técnico Individual &bull; Posicionamento Médio: X={{ atletaSelecionado.centroideX }}m, Y={{ atletaSelecionado.centroideY }}m
              </div>
            </div>
          </div>

          <v-btn icon="mdi-close" variant="text" size="small" @click="modalDetalhesAberto = false"></v-btn>
        </div>

        <!-- Barra de Abas Tecnicas -->
        <v-tabs v-model="abaModal" color="primary" density="compact" class="corporate-modal-tabs border-b px-3">
          <v-tab value="cinematica">Cinemática & Volume</v-tab>
          <v-tab value="inercial">Cargas Inerciais</v-tab>
          <v-tab value="campo">Prancheta Tática</v-tab>
          <v-tab value="radar">Radar vs Elenco</v-tab>
          <v-tab value="fisiologia">Escala de Borg (PSE)</v-tab>
        </v-tabs>

        <!-- Conteudo das Abas -->
        <v-card-text style="max-height: 600px;" class="pa-5">
          <v-window v-model="abaModal">
            
            <!-- ABA 1: CINEMATICA & VOLUME -->
            <v-window-item value="cinematica">
              <v-row dense class="mb-4">
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Distância Total</span>
                    <span class="metric-card-value font-mono">{{ (atletaSelecionado.distanciaTotal).toFixed(0) }} <small>m</small></span>
                    <span class="metric-card-sub font-mono">{{ (atletaSelecionado.distanciaTotal / 1000).toFixed(2) }} km</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Intensidade (M/min)</span>
                    <span class="metric-card-value font-mono text-primary">{{ atletaSelecionado.metrosPorMinuto?.toFixed(1) }}</span>
                    <span class="metric-card-sub">Metros por minuto</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Velocidade Máxima</span>
                    <span class="metric-card-value font-mono text-warning">{{ atletaSelecionado.velocidadeMaxima?.toFixed(1) }} <small>km/h</small></span>
                    <span class="metric-card-sub">Pico registrado</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Velocidade Média</span>
                    <span class="metric-card-value font-mono">{{ atletaSelecionado.velocidadeMedia?.toFixed(1) }} <small>km/h</small></span>
                    <span class="metric-card-sub">Média na sessão</span>
                  </div>
                </v-col>
              </v-row>

              <!-- Decomposicao por Zonas de Velocidade -->
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-2">
                Decomposição por Faixas de Velocidade (Padrão FIFA / Prozone)
              </div>

              <div class="segmented-bar mb-4">
                <div class="seg-walk" :style="{ width: percentualZona(atletaSelecionado, 'distanciaAndando') + '%' }"></div>
                <div class="seg-jog" :style="{ width: percentualZona(atletaSelecionado, 'distanciaTrotando') + '%' }"></div>
                <div class="seg-run" :style="{ width: percentualZona(atletaSelecionado, 'distanciaCorrendo') + '%' }"></div>
                <div class="seg-sprint" :style="{ width: percentualZona(atletaSelecionado, 'distanciaSprint') + '%' }"></div>
              </div>

              <v-table density="compact" class="table-corporate border">
                <thead>
                  <tr>
                    <th>Zona</th>
                    <th>Faixa de Velocidade</th>
                    <th class="text-right">Distância (m)</th>
                    <th class="text-right">% do Volume</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="zone-badge zone-walk mr-2"></span>Z1 - Caminhada</td>
                    <td class="text-medium-emphasis">0.0 a 7.2 km/h</td>
                    <td class="text-right font-mono">{{ atletaSelecionado.distanciaAndando?.toFixed(1) }} m</td>
                    <td class="text-right font-mono">{{ percentualZona(atletaSelecionado, 'distanciaAndando').toFixed(1) }}%</td>
                  </tr>
                  <tr>
                    <td><span class="zone-badge zone-jog mr-2"></span>Z2 - Trote</td>
                    <td class="text-medium-emphasis">7.2 a 14.4 km/h</td>
                    <td class="text-right font-mono">{{ atletaSelecionado.distanciaTrotando?.toFixed(1) }} m</td>
                    <td class="text-right font-mono">{{ percentualZona(atletaSelecionado, 'distanciaTrotando').toFixed(1) }}%</td>
                  </tr>
                  <tr>
                    <td><span class="zone-badge zone-run mr-2"></span>Z3 - Corrida</td>
                    <td class="text-medium-emphasis">14.4 a 19.8 km/h</td>
                    <td class="text-right font-mono">{{ atletaSelecionado.distanciaCorrendo?.toFixed(1) }} m</td>
                    <td class="text-right font-mono">{{ percentualZona(atletaSelecionado, 'distanciaCorrendo').toFixed(1) }}%</td>
                  </tr>
                  <tr>
                    <td><span class="zone-badge zone-sprint mr-2"></span>Z4 - Sprint</td>
                    <td class="text-medium-emphasis">> 19.8 km/h</td>
                    <td class="text-right font-mono font-weight-bold text-error">{{ atletaSelecionado.distanciaSprint?.toFixed(1) }} m</td>
                    <td class="text-right font-mono font-weight-bold text-error">{{ percentualZona(atletaSelecionado, 'distanciaSprint').toFixed(1) }}%</td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <!-- ABA 2: CARGAS INERCIAIS -->
            <v-window-item value="inercial">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-3">
                Dinâmica Neuromuscular & Acelerações
              </div>

              <v-row dense class="mb-4">
                <v-col cols="12" sm="6">
                  <div class="metric-box-group">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <span class="text-caption text-uppercase font-weight-bold text-success">Acelerações Positivas</span>
                      <span class="text-caption text-medium-emphasis">Pico: +{{ atletaSelecionado.aceleracaoMaxima?.toFixed(2) }} m/s²</span>
                    </div>
                    <div class="d-flex justify-space-around text-center">
                      <div>
                        <div class="text-caption text-medium-emphasis">Intensas (> 2.5)</div>
                        <div class="text-h5 font-weight-bold text-success font-mono">{{ atletaSelecionado.aceleracoesAltas || 0 }}</div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Explosivas (> 3.0)</div>
                        <div class="text-h5 font-weight-bold text-success font-mono">{{ atletaSelecionado.aceleracoesExplosivas || 0 }}</div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Volume</div>
                        <div class="text-h6 font-weight-medium font-mono">{{ atletaSelecionado.distanciaAcelerando?.toFixed(0) || 0 }} m</div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="metric-box-group">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <span class="text-caption text-uppercase font-weight-bold text-error">Desacelerações (Carga Excêntrica)</span>
                      <span class="text-caption text-medium-emphasis">Pico: {{ atletaSelecionado.desaceleracaoMaxima?.toFixed(2) }} m/s²</span>
                    </div>
                    <div class="d-flex justify-space-around text-center">
                      <div>
                        <div class="text-caption text-medium-emphasis">Bruscas (&lt; -2.5)</div>
                        <div class="text-h5 font-weight-bold text-error font-mono">{{ atletaSelecionado.desaceleracoesAltas || 0 }}</div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Críticas (&lt; -3.0)</div>
                        <div class="text-h5 font-weight-bold text-error font-mono">{{ atletaSelecionado.desaceleracoesCriticas || 0 }}</div>
                      </div>
                      <div>
                        <div class="text-caption text-medium-emphasis">Volume</div>
                        <div class="text-h6 font-weight-medium font-mono">{{ atletaSelecionado.distanciaDesacelerando?.toFixed(0) || 0 }} m</div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-3">
                Potência Metabólica (Modelo Di Prampero & Osgnach) & Player Load
              </div>

              <v-row dense>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Tiros de Sprint</span>
                    <span class="metric-card-value font-mono text-error">{{ atletaSelecionado.sprintsContagem || 0 }}</span>
                    <span class="metric-card-sub">Ações > 19.8 km/h</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Média por Tiro</span>
                    <span class="metric-card-value font-mono">{{ atletaSelecionado.distanciaMediaSprint?.toFixed(1) || 0 }} <small>m</small></span>
                    <span class="metric-card-sub">Extensão média</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Potência Média</span>
                    <span class="metric-card-value font-mono text-warning">{{ atletaSelecionado.potenciaMetabolicaMedia?.toFixed(1) || 0 }}</span>
                    <span class="metric-card-sub">W/kg</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="metric-card">
                    <span class="metric-card-label">Player Load Total</span>
                    <span class="metric-card-value font-mono text-white">{{ atletaSelecionado.playerLoad?.toFixed(0) || 0 }}</span>
                    <span class="metric-card-sub">Carga inercial acumulada</span>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- ABA 3: PRANCHETA TATICA (CAMPO OFICIAL) -->
            <v-window-item value="campo">
              <div class="d-flex align-center justify-space-between mb-3">
                <div>
                  <span class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                    Prancheta Tática &bull; Ocupação Espacial do Gramado
                  </span>
                </div>
                <div class="text-caption text-slate-400 font-mono">
                  Centroide: ({{ atletaSelecionado.centroideX }}m, {{ atletaSelecionado.centroideY }}m) &bull; Dispersão: &plusmn;{{ atletaSelecionado.raioAcao }}m
                </div>
              </div>

              <!-- Campo Tatica SVG Estilizado -->
              <div class="pitch-frame pa-2">
                <svg
                  viewBox="0 0 1050 680"
                  class="tactical-pitch"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Textura de Gramado Sobrio -->
                  <defs>
                    <pattern id="tactical-stripes" width="105" height="680" patternUnits="userSpaceOnUse">
                      <rect x="0" width="52.5" height="680" fill="#143022" />
                      <rect x="52.5" width="52.5" height="680" fill="#10261b" />
                    </pattern>
                  </defs>
                  <rect width="1050" height="680" fill="url(#tactical-stripes)" rx="6" />

                  <!-- Linhas Regulamentares Oficiais em Branco Solido -->
                  <rect x="40" y="40" width="970" height="600" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />
                  <line x1="525" y1="40" x2="525" y2="640" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />
                  <circle cx="525" cy="340" r="91.5" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />
                  <circle cx="525" cy="340" r="4" fill="#ffffff" />

                  <!-- Grande Area e Pequena Area Esquerda -->
                  <rect x="40" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
                  <rect x="40" y="245" width="55" height="190" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
                  <circle cx="150" cy="340" r="4" fill="#ffffff" />

                  <!-- Grande Area e Pequena Area Direita -->
                  <rect x="845" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
                  <rect x="955" y="245" width="55" height="190" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
                  <circle cx="900" cy="340" r="4" fill="#ffffff" />

                  <!-- Trilha de Coordenadas do Atleta -->
                  <g>
                    <circle
                      v-for="(pt, idx) in atletaSelecionado.amostrasPosicao"
                      :key="'pt-' + idx"
                      :cx="pt.x * 10"
                      :cy="pt.y * 10"
                      r="5"
                      fill="#2563eb"
                      opacity="0.3"
                    />
                  </g>

                  <!-- Raio de Acao Tatico (Dispersao) -->
                  <circle
                    :cx="atletaSelecionado.centroideX * 10"
                    :cy="atletaSelecionado.centroideY * 10"
                    :r="Math.max(40, (atletaSelecionado.raioAcao || 16) * 10)"
                    fill="rgba(37, 99, 235, 0.12)"
                    stroke="#3b82f6"
                    stroke-width="1.5"
                    stroke-dasharray="6,4"
                  />

                  <!-- Centroide Tatico (Marcador do Jogador) -->
                  <g :transform="'translate(' + (atletaSelecionado.centroideX * 10) + ',' + (atletaSelecionado.centroideY * 10) + ')'">
                    <circle r="18" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                    <text
                      x="0"
                      y="6"
                      text-anchor="middle"
                      fill="#ffffff"
                      font-size="13"
                      font-weight="bold"
                      font-family="sans-serif"
                    >
                      {{ atletaSelecionado.id }}
                    </text>
                  </g>
                </svg>
              </div>

              <div class="d-flex justify-space-between align-center mt-3 text-caption text-medium-emphasis">
                <span>&bull; Marcador Azul (#{{ atletaSelecionado.id }}): Posição média do atleta</span>
                <span>&bull; Círculo Tracejado: Raio de Ação / Dispersão no gramado</span>
                <span>&bull; Pontos Azuis: Amostras temporais da movimentação</span>
              </div>
            </v-window-item>

            <!-- ABA 4: RADAR COMPARATIVO -->
            <v-window-item value="radar">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-3">
                Perfil de Desempenho &bull; Comparativo vs Média do Elenco
              </div>

              <v-row align="center">
                <v-col cols="12" md="7">
                  <div class="radar-box text-center pa-3">
                    <svg viewBox="0 0 400 400" class="radar-clean">
                      <!-- Grid Poligonal (Linhas de Nivel 20%, 40%, 60%, 80%, 100%) -->
                      <polygon
                        v-for="nivel in [0.2, 0.4, 0.6, 0.8, 1.0]"
                        :key="'grid-' + nivel"
                        :points="gerarPoligonoGrid(nivel)"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        stroke-width="1"
                      />

                      <!-- Eixos Radiais -->
                      <line
                        v-for="(eixo, i) in eixosRadar"
                        :key="'axis-' + i"
                        x1="200"
                        y1="200"
                        :x2="calcularCoordenadaRadar(i, 1.0).x"
                        :y2="calcularCoordenadaRadar(i, 1.0).y"
                        stroke="rgba(255,255,255,0.12)"
                        stroke-width="1"
                      />

                      <!-- Camada: Media do Elenco -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarTime)"
                        fill="rgba(148, 163, 184, 0.2)"
                        stroke="#94a3b8"
                        stroke-width="1.5"
                        stroke-dasharray="4,4"
                      />

                      <!-- Camada: Atleta Selecionado -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarAtleta)"
                        fill="rgba(37, 99, 235, 0.35)"
                        stroke="#2563eb"
                        stroke-width="2"
                      />

                      <!-- Vertices do Atleta -->
                      <circle
                        v-for="(val, i) in dadosRadarAtleta"
                        :key="'vert-' + i"
                        :cx="calcularCoordenadaRadar(i, val).x"
                        :cy="calcularCoordenadaRadar(i, val).y"
                        r="4"
                        fill="#2563eb"
                        stroke="#ffffff"
                        stroke-width="1.5"
                      />

                      <!-- Rotulos dos Eixos -->
                      <text
                        v-for="(eixo, i) in eixosRadar"
                        :key="'label-' + i"
                        :x="calcularCoordenadaRadar(i, 1.20).x"
                        :y="calcularCoordenadaRadar(i, 1.20).y + 4"
                        text-anchor="middle"
                        fill="#cbd5e1"
                        font-size="11"
                        font-weight="600"
                      >
                        {{ eixo }}
                      </text>
                    </svg>

                    <div class="d-flex justify-center gap-5 mt-2">
                      <div class="d-flex align-center">
                        <span class="legend-indicator bg-primary mr-2"></span>
                        <span class="text-caption font-weight-bold text-white">Jogador {{ atletaSelecionado.id }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="legend-indicator bg-slate-500 mr-2"></span>
                        <span class="text-caption text-medium-emphasis">Média do Time</span>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="5">
                  <v-table density="compact" class="table-corporate border">
                    <thead>
                      <tr>
                        <th>Pilar</th>
                        <th class="text-right">Atleta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Volume Total</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.distanciaTotal.toFixed(0) }} m</td>
                      </tr>
                      <tr>
                        <td>Intensidade (M/min)</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.metrosPorMinuto.toFixed(1) }}</td>
                      </tr>
                      <tr>
                        <td>Velocidade Máxima</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.velocidadeMaxima.toFixed(1) }} km/h</td>
                      </tr>
                      <tr>
                        <td>Tiros de Sprint</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.sprintsContagem || 0 }}</td>
                      </tr>
                      <tr>
                        <td>Acelerações > 2.5 m/s²</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.aceleracoesAltas || 0 }}</td>
                      </tr>
                      <tr>
                        <td>Player Load</td>
                        <td class="text-right font-mono font-weight-bold">{{ atletaSelecionado.playerLoad.toFixed(0) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- ABA 5: FISIOLOGIA & ESCALA DE BORG -->
            <v-window-item value="fisiologia">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-3">
                Cruzamento Carga Externa (GPS/Cinemática) &times; Carga Interna (Escala de Borg CR-10)
              </div>

              <div class="metric-box-group mb-4 pa-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-bold text-white">
                    Percepção Subjetiva de Esforço (PSE / Borg CR-10):
                  </span>
                  <v-chip size="small" :color="corBorg(valorBorg)" variant="flat" class="font-weight-bold">
                    Nível {{ valorBorg }} &bull; {{ descricaoBorg(valorBorg) }}
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
                  class="mt-2"
                ></v-slider>

                <v-row dense class="mt-1">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="duracaoSessaoMinutos"
                      label="Duração Monitorada (minutos)"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="input-corporate"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="metric-card pa-2 text-center">
                      <span class="metric-card-label">Carga da Sessão (Método Foster)</span>
                      <span class="metric-card-value font-mono text-primary">{{ valorBorg * duracaoSessaoMinutos }} <small>U.A.</small></span>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- Relação Carga Externa vs Carga Interna -->
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-3">
                Índices de Eficiência & Balanço Fisiológico
              </div>

              <v-row dense class="mb-4">
                <v-col cols="6">
                  <div class="metric-card">
                    <span class="metric-card-label">Índice HSR / Borg</span>
                    <span class="metric-card-value font-mono text-white">
                      {{ ((atletaSelecionado.distanciaSprint || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </span>
                    <span class="metric-card-sub">Metros de Sprint por ponto de PSE</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="metric-card">
                    <span class="metric-card-label">Player Load / Borg</span>
                    <span class="metric-card-value font-mono text-white">
                      {{ ((atletaSelecionado.playerLoad || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </span>
                    <span class="metric-card-sub">Carga Mecânica por ponto de PSE</span>
                  </div>
                </v-col>
              </v-row>

              <!-- Parecer Tecnico da Fisiologia -->
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-2">
                Parecer Técnico da Fisiologia / Preparação Física
              </div>

              <div class="clinical-report-box pa-4">
                <div class="d-flex align-center mb-2">
                  <v-icon :icon="diagnosticoAtleta.icone" :color="diagnosticoAtleta.cor" class="mr-2"></v-icon>
                  <span class="font-weight-bold text-white">{{ diagnosticoAtleta.titulo }}</span>
                </div>
                <p class="text-body-2 text-slate-300 mb-3">
                  {{ diagnosticoAtleta.mensagem }}
                </p>
                <div class="pt-2 border-t text-caption font-weight-bold text-primary">
                  Conduta Recomendada: <span class="text-slate-200 font-weight-regular">{{ diagnosticoAtleta.recomendacao }}</span>
                </div>
              </div>
            </v-window-item>

          </v-window>
        </v-card-text>

        <!-- Rodapé da Ficha -->
        <div class="pa-4 border-t d-flex justify-end gap-2 bg-slate-900">
          <v-btn variant="text" @click="modalDetalhesAberto = false" class="text-caption font-weight-bold">
            Fechar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="salvarSimulacaoBorg"
            class="text-caption font-weight-bold btn-corporate px-4"
          >
            Salvar Avaliação
          </v-btn>
        </div>

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

// Conjuntos de Teste
const URL_DATA_A = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv'
const URL_DATA_B = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv'

function aplicarPreset(tipo) {
  tabInput.value = 'url'
  if (tipo === 'home') urlArquivo.value = URL_DATA_A
  if (tipo === 'away') urlArquivo.value = URL_DATA_B
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

// Radar de Desempenho
const eixosRadar = ['Volume', 'Intensidade', 'Vel. Max', 'Sprints', 'Acelerações', 'Player Load']

const dadosRadarTime = computed(() => {
  return [0.65, 0.65, 0.70, 0.60, 0.65, 0.65]
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
  const raioMax = 135
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

// Upload CSV
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
    mensagemSucesso.value = `Processamento concluído com sucesso. ${json.quantidadeJogadores} atletas analisados e integrados ao banco de dados.`
  } catch (err) {
    console.error('Erro na requisição:', err)
    mensagemErro.value = `Erro de comunicação com o servidor: ${err.message}`
  } finally {
    carregando.value = false
  }
}

// URL Externa
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
    mensagemSucesso.value = `Análise concluída com sucesso para ${json.quantidadeJogadores} atletas.`
  } catch (err) {
    console.error('Erro na requisição:', err)
    mensagemErro.value = `Erro ao carregar do repositório: ${err.message}`
  } finally {
    carregando.value = false
  }
}

// Mock de 11 Atletas
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
      posicaoSugerida: 'Meio-Campista Ofensivo',
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
      posicaoSugerida: 'Centroavante',
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
  mensagemSucesso.value = 'Amostra carregada com sucesso: 11 atletas monitorados e distribuídos taticamente.'
}

// Escala de Borg CR-10
function descricaoBorg(val) {
  if (val <= 1) return 'Muito Leve'
  if (val <= 3) return 'Leve / Moderado'
  if (val <= 5) return 'Pesado'
  if (val <= 7) return 'Muito Pesado'
  if (val <= 9) return 'Extremamente Intenso'
  return 'Exaustão Máxima'
}

function corBorg(val) {
  if (val <= 3) return 'success'
  if (val <= 6) return 'primary'
  if (val <= 8) return 'warning'
  return 'error'
}

const diagnosticoAtleta = computed(() => {
  if (!atletaSelecionado.value) return { titulo: '', mensagem: '', recomendacao: '', cor: 'primary', icone: 'mdi-information-outline' }

  const sprint = atletaSelecionado.value.distanciaSprint || 0
  const borg = valorBorg.value

  if (borg >= 8 && sprint < 450) {
    return {
      titulo: 'Risco Elevado de Fadiga Residual',
      mensagem: 'O atleta reportou percepção de esforço desproporcionalmente alta para uma produção mecânica moderada em alta intensidade. Indica estresse neuromuscular acumulado.',
      recomendacao: 'Priorizar protocolo regenerativo nas 24h subsequentes (crioterapia, hidratação monitorada e monitoramento de biomarcadores musculares).',
      cor: 'error',
      icone: 'mdi-alert-octagon-outline'
    }
  } else if (borg <= 5 && sprint >= 650) {
    return {
      titulo: 'Alta Prontidão & Eficiência Fisiológica',
      mensagem: 'O atleta sustentou elevado volume de corrida de alta intensidade e sprints mantendo percepção moderada de esforço. Excelente resposta de adaptação cardiorrespiratória.',
      recomendacao: 'Manter programação normal do microciclo. Atleta em ótimas condições físicas.',
      cor: 'success',
      icone: 'mdi-check-decagram-outline'
    }
  } else if (borg >= 7) {
    return {
      titulo: 'Demanda Fisiológica Elevada',
      mensagem: 'A resposta subjetiva ao esforço reflete com precisão o alto volume e carga mecânica da sessão.',
      recomendacao: 'Reidratação eletrolítica e repouso ativo antes do próximo treino de alta intensidade.',
      cor: 'warning',
      icone: 'mdi-alert-circle-outline'
    }
  } else {
    return {
      titulo: 'Resposta Fisiológica Balanceada',
      mensagem: 'Relação equilibrada entre a demanda mecânica externa e a percepção subjetiva interna para os minutos monitorados.',
      recomendacao: 'Manter a progressão padrão da carga de treinamento.',
      cor: 'primary',
      icone: 'mdi-information-outline'
    }
  }
})

function salvarSimulacaoBorg() {
  mensagemSucesso.value = `Avaliação registrada para o Atleta #${atletaSelecionado.value.id}: Carga Foster = ${valorBorg.value * duracaoSessaoMinutos.value} U.A. (Borg ${valorBorg.value}).`
  modalDetalhesAberto.value = false
}
</script>

<style scoped>
/* Fundo Solido Corporativo */
.app-background {
  background-color: #0b0f19 !important;
  color: #f1f5f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.max-content-width {
  max-width: 1400px;
  margin: 0 auto;
}

/* Identidade / Marca */
.brand-badge {
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 900;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  border-radius: 4px;
}

.letter-spacing-1 {
  letter-spacing: 0.08em;
}

/* Cartoes Corporativos Solidos */
.corporate-card {
  background-color: #131b2e !important;
  border: 1px solid #1e293b !important;
  border-radius: 8px !important;
}

.kpi-box {
  border-left: 3px solid #3b82f6 !important;
}

/* Abas Corporativas */
.corporate-tabs {
  background-color: #0b0f19;
  border-radius: 6px;
  border: 1px solid #1e293b;
}

/* Inputs Corporativos */
.input-corporate :deep(.v-field) {
  background-color: #0b0f19 !important;
  border-radius: 6px !important;
}

.btn-corporate {
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  border-radius: 6px !important;
}

.btn-table {
  text-transform: none !important;
  border-radius: 4px !important;
  font-size: 0.75rem !important;
}

.alert-corporate {
  border-radius: 6px !important;
}

/* Tabela Corporativa */
.table-corporate {
  background-color: transparent !important;
}

.table-corporate th {
  background-color: #0f172a !important;
  color: #94a3b8 !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  border-bottom: 1px solid #1e293b !important;
  padding: 12px 16px !important;
}

.table-corporate td {
  border-bottom: 1px solid #1e293b !important;
  padding: 12px 16px !important;
  font-size: 0.85rem !important;
}

.player-number {
  background-color: #1e293b;
  color: #94a3b8;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Modal Corporativo */
.corporate-modal {
  background-color: #131b2e !important;
  border: 1px solid #334155 !important;
  border-radius: 8px !important;
  color: #f8fafc;
}

.corporate-modal-tabs {
  background-color: #0f172a !important;
}

.player-avatar-large {
  width: 44px;
  height: 44px;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

/* Metric Cards no Modal */
.metric-card {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.metric-card-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.metric-card-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 4px;
}

.metric-card-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.metric-box-group {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 14px;
}

/* Barras de Zonas */
.zone-badge {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.zone-walk { background-color: #3b82f6; }
.zone-jog { background-color: #06b6d4; }
.zone-run { background-color: #f59e0b; }
.zone-sprint { background-color: #ef4444; }

.segmented-bar {
  display: flex;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background-color: #1e293b;
}

.seg-walk { background-color: #3b82f6; }
.seg-jog { background-color: #06b6d4; }
.seg-run { background-color: #f59e0b; }
.seg-sprint { background-color: #ef4444; }

/* Prancheta Tatica */
.pitch-frame {
  background-color: #0a111a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

.tactical-pitch {
  width: 100%;
  max-height: 440px;
}

/* Radar */
.radar-box {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
}

.radar-clean {
  width: 100%;
  max-width: 340px;
  height: auto;
}

.legend-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.bg-slate-500 { background-color: #94a3b8; }

/* Relatorio Clinico / Fisiologico */
.clinical-report-box {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}
</style>
