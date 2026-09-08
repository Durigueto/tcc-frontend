<template>
  <v-app class="app-background">
    <!-- Top Header Institucional Visao90 -->
    <header class="app-header px-4 px-md-6 py-2">
      <div class="d-flex align-center justify-space-between flex-wrap gap-3">
        
        <!-- Logo e Slogan Oficial -->
        <div class="d-flex align-center">
          <div class="logo-wrapper mr-3">
            <svg viewBox="0 0 240 64" class="logo-svg" xmlns="http://www.w3.org/2000/svg">
              <!-- VISÃO -->
              <text x="5" y="44" fill="#ffffff" font-family="'Inter', 'Segoe UI', sans-serif" font-size="34" font-weight="900" letter-spacing="1">VISÃO</text>
              <!-- 9 (Verde Campo) -->
              <text x="142" y="44" fill="#3e885b" font-family="'Inter', 'Segoe UI', sans-serif" font-size="44" font-weight="900">9</text>
              <!-- 0 Estilizado como Circulo Central de Futebol -->
              <circle cx="198" cy="30" r="19" fill="none" stroke="#3e885b" stroke-width="7" />
              <line x1="198" y1="9" x2="198" y2="51" stroke="#ffffff" stroke-width="2.5" />
              <circle cx="198" cy="30" r="3.5" fill="#ffffff" />
            </svg>
          </div>

          <div class="d-none d-lg-flex flex-column border-s ps-3 text-left">
            <span class="text-caption font-weight-bold text-slate-300 letter-spacing-1">
              ANÁLISE DE DESEMPENHO NO FUTEBOL
            </span>
            <span class="text-xs text-muted">
              DO CAMPO PARA DECISÕES REAIS &bull; DADOS HOJE. EVOLUÇÃO SEMPRE.
            </span>
          </div>
        </div>

        <!-- Botoes de Acao e Modos de Visualizacao -->
        <div class="d-flex align-center gap-2 flex-wrap">
          <!-- Seletor de Visao -->
          <v-btn-toggle
            v-model="modoVisualizacao"
            mandatory
            density="compact"
            color="primary"
            class="view-toggle"
          >
            <v-btn value="elenco" size="small" class="text-caption font-weight-bold">
              <v-icon start icon="mdi-soccer-field" size="16"></v-icon>
              Campo do Elenco
            </v-btn>
            <v-btn value="atleta" size="small" class="text-caption font-weight-bold">
              <v-icon start icon="mdi-account-details" size="16"></v-icon>
              Dossiê do Atleta
            </v-btn>
            <v-btn value="tabela" size="small" class="text-caption font-weight-bold">
              <v-icon start icon="mdi-table-large" size="16"></v-icon>
              Tabela Geral
            </v-btn>
          </v-btn-toggle>

          <!-- Botao Importar Dados -->
          <v-btn
            size="small"
            color="surface-variant"
            variant="flat"
            prepend-icon="mdi-upload"
            @click="modalImportarAberto = true"
            class="text-caption font-weight-bold btn-header"
          >
            Importar Dados
          </v-btn>

          <!-- Botao Carregar Amostra Rapida -->
          <v-btn
            size="small"
            color="primary"
            variant="flat"
            prepend-icon="mdi-play-circle-outline"
            @click="carregarMockDemonstracao"
            class="text-caption font-weight-bold btn-header"
          >
            Amostra (11)
          </v-btn>
        </div>
      </div>
    </header>

    <!-- Barra de Indicadores Gerais da Partida (KPI Strip) -->
    <div class="kpi-strip border-b px-4 px-md-6 py-2" v-if="atletas.length > 0">
      <div class="d-flex align-center justify-space-between flex-wrap gap-2 text-caption">
        <div class="d-flex align-center gap-4 flex-wrap">
          <div class="kpi-item">
            <span class="kpi-label">ELENCO MONITORADO:</span>
            <span class="kpi-val text-white font-mono">{{ atletas.length }} Atletas</span>
          </div>

          <div class="kpi-item">
            <span class="kpi-label">VOLUME TOTAL:</span>
            <span class="kpi-val text-primary font-mono">{{ distanciaColetivaKm.toFixed(1) }} km</span>
            <span class="kpi-sub font-mono">({{ (distanciaColetivaKm / atletas.length).toFixed(1) }} km/atleta)</span>
          </div>

          <div class="kpi-item">
            <span class="kpi-label">INTENSIDADE MÉDIA:</span>
            <span class="kpi-val text-white font-mono">{{ mediaMetrosPorMinuto.toFixed(0) }} M/min</span>
          </div>

          <div class="kpi-item">
            <span class="kpi-label">PICO VELOCIDADE:</span>
            <span class="kpi-val text-warning font-mono">{{ maiorVelocidade.toFixed(1) }} km/h</span>
            <span class="kpi-sub font-mono">(#{{ atletaMaisRapido?.id }})</span>
          </div>

          <div class="kpi-item">
            <span class="kpi-label">ACELERAÇÕES > 2.5:</span>
            <span class="kpi-val text-success font-mono">{{ totalAceleracoesAltas }} ações</span>
          </div>

          <div class="kpi-item">
            <span class="kpi-label">CARGA HPMD:</span>
            <span class="kpi-val text-info font-mono">{{ (totalHpmdM / 1000).toFixed(1) }} km</span>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <span class="live-dot"></span>
          <span class="text-xs text-muted uppercase">Sessão Ativa &bull; 90 Min</span>
        </div>
      </div>
    </div>

    <!-- Area Principal do Dashboard -->
    <v-main class="workspace-main px-4 px-md-6 py-4">
      <v-container fluid class="pa-0 max-content-width">

        <!-- Mensagens de Alerta -->
        <v-alert
          v-if="mensagemErro"
          type="error"
          variant="tonal"
          density="compact"
          closable
          class="mb-4 text-caption"
          @click:close="mensagemErro = ''"
        >
          {{ mensagemErro }}
        </v-alert>

        <v-alert
          v-if="mensagemSucesso"
          type="success"
          variant="tonal"
          density="compact"
          closable
          class="mb-4 text-caption"
          @click:close="mensagemSucesso = ''"
        >
          {{ mensagemSucesso }}
        </v-alert>

        <!-- SE O ELENCO ESTIVER CARREGADO -->
        <div v-if="atletas.length > 0">

          <!-- ======================================================== -->
          <!-- MODO 1: CAMPO TATICO DO ELENCO (VISAO COLETIVA TÁTICA)  -->
          <!-- ======================================================== -->
          <div v-if="modoVisualizacao === 'elenco'">
            <v-row dense>
              <!-- Lado Esquerdo: Lista Rápida dos Atletas no Elenco -->
              <v-col cols="12" md="4" lg="3">
                <div class="panel-box pa-3">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">
                      Escalação da Equipe ({{ atletas.length }})
                    </span>
                    <span class="text-xs text-primary font-weight-bold">Clique para focar</span>
                  </div>

                  <!-- Lista Rolavel de Atletas -->
                  <div class="squad-list">
                    <div
                      v-for="atleta in atletas"
                      :key="atleta.id"
                      :class="['squad-item pa-2 mb-1 d-flex align-center justify-space-between', atletaSelecionado?.id === atleta.id ? 'active-player' : '']"
                      @click="selecionarAtleta(atleta)"
                    >
                      <div class="d-flex align-center">
                        <div class="jersey-circle mr-2">#{{ atleta.id }}</div>
                        <div>
                          <div class="font-weight-bold text-caption text-white">Jogador {{ atleta.id }}</div>
                          <div class="text-xs text-muted">{{ atleta.posicaoSugerida }}</div>
                        </div>
                      </div>

                      <div class="text-right font-mono">
                        <div class="text-caption font-weight-bold text-white">{{ (atleta.distanciaTotal).toFixed(0) }}m</div>
                        <div class="text-xs text-primary">{{ atleta.metrosPorMinuto.toFixed(0) }} M/min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Lado Direito: O Campo Oficial com Todos os Jogadores Posicionados -->
              <v-col cols="12" md="8" lg="9">
                <div class="panel-box pa-4">
                  <div class="d-flex align-center justify-space-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
                        <v-icon icon="mdi-soccer-field" color="primary" class="mr-2"></v-icon>
                        Distribuição Posicional e Ocupação Espacial do Elenco
                      </h3>
                      <p class="text-xs text-muted mt-1">
                        Centroides táticos calculados no gramado oficial (105m &times; 68m). O raio tracejado representa a amplitude de movimentação.
                      </p>
                    </div>

                    <div class="d-flex align-center gap-2">
                      <v-btn
                        size="x-small"
                        color="primary"
                        variant="outlined"
                        @click="modoVisualizacao = 'atleta'"
                        class="text-caption font-weight-bold"
                      >
                        Abrir Ficha do Jogador #{{ atletaSelecionado?.id || '1' }}
                      </v-btn>
                    </div>
                  </div>

                  <!-- O Campo SVG com os 11 Atletas -->
                  <div class="tactical-pitch-frame">
                    <svg viewBox="0 0 1050 680" class="full-pitch-svg" xmlns="http://www.w3.org/2000/svg">
                      <!-- Faixas do Gramado -->
                      <defs>
                        <pattern id="pitch-stripes-all" width="105" height="680" patternUnits="userSpaceOnUse">
                          <rect x="0" width="52.5" height="680" fill="#112217" />
                          <rect x="52.5" width="52.5" height="680" fill="#0d1c13" />
                        </pattern>
                      </defs>
                      <rect width="1050" height="680" fill="url(#pitch-stripes-all)" rx="6" />

                      <!-- Linhas Oficiais Brancas -->
                      <rect x="40" y="40" width="970" height="600" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
                      <line x1="525" y1="40" x2="525" y2="640" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
                      <circle cx="525" cy="340" r="91.5" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
                      <circle cx="525" cy="340" r="4" fill="#ffffff" />

                      <!-- Areas da Esquerda -->
                      <rect x="40" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
                      <rect x="40" y="245" width="55" height="190" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
                      <circle cx="150" cy="340" r="4" fill="#ffffff" />

                      <!-- Areas da Direita -->
                      <rect x="845" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
                      <rect x="955" y="245" width="55" height="190" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
                      <circle cx="900" cy="340" r="4" fill="#ffffff" />

                      <!-- Raios de Acao dos Jogadores (Circulos de Ocupacao) -->
                      <g>
                        <circle
                          v-for="a in atletas"
                          :key="'disp-' + a.id"
                          :cx="a.centroideX * 10"
                          :cy="a.centroideY * 10"
                          :r="Math.max(30, (a.raioAcao || 15) * 8.5)"
                          :fill="atletaSelecionado?.id === a.id ? 'rgba(62, 136, 91, 0.25)' : 'rgba(255, 255, 255, 0.03)'"
                          :stroke="atletaSelecionado?.id === a.id ? '#3e885b' : 'rgba(255, 255, 255, 0.15)'"
                          stroke-width="1.5"
                          stroke-dasharray="4,3"
                        />
                      </g>

                      <!-- Marcadores de Cada Jogador no Campo -->
                      <g
                        v-for="a in atletas"
                        :key="'marker-' + a.id"
                        :transform="'translate(' + (a.centroideX * 10) + ',' + (a.centroideY * 10) + ')'"
                        @click="selecionarAtleta(a)"
                        style="cursor: pointer;"
                      >
                        <circle
                          r="18"
                          :fill="atletaSelecionado?.id === a.id ? '#3e885b' : '#1b2a20'"
                          :stroke="atletaSelecionado?.id === a.id ? '#ffffff' : '#3e885b'"
                          stroke-width="2.5"
                        />
                        <text
                          x="0"
                          y="6"
                          text-anchor="middle"
                          fill="#ffffff"
                          font-size="12"
                          font-weight="900"
                          font-family="sans-serif"
                        >
                          {{ a.id }}
                        </text>
                        <!-- Legenda com Posicao abaixo do marcador -->
                        <text
                          x="0"
                          y="32"
                          text-anchor="middle"
                          fill="#cbd5e1"
                          font-size="10"
                          font-weight="600"
                          font-family="sans-serif"
                          class="player-pitch-label"
                        >
                          {{ a.posicaoSugerida.split('/')[0].trim() }}
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- ======================================================== -->
          <!-- MODO 2: DOSSIÊ INDIVIDUAL DO ATLETA (SPLIT VIEW DIRETA) -->
          <!-- ======================================================== -->
          <div v-if="modoVisualizacao === 'atleta' && atletaSelecionado">
            <!-- Barra Superior do Atleta Selecionado -->
            <div class="player-header-card pa-4 mb-4 d-flex align-center justify-space-between flex-wrap gap-3">
              <div class="d-flex align-center">
                <div class="player-big-badge mr-4">#{{ atletaSelecionado.id }}</div>
                <div>
                  <div class="d-flex align-center gap-2">
                    <h2 class="text-h6 font-weight-black text-white">Jogador {{ atletaSelecionado.id }}</h2>
                    <v-chip size="small" variant="flat" color="primary" class="font-weight-bold">
                      {{ atletaSelecionado.posicaoSugerida }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-muted mt-1 font-mono">
                    Posicionamento Médio: X={{ atletaSelecionado.centroideX }}m, Y={{ atletaSelecionado.centroideY }}m &bull; Raio de Ação: &plusmn;{{ atletaSelecionado.raioAcao }}m
                  </div>
                </div>
              </div>

              <!-- Seletor Rapido de Jogador -->
              <div class="d-flex align-center gap-2">
                <span class="text-xs text-muted">Trocar atleta:</span>
                <v-select
                  v-model="atletaSelecionadoId"
                  :items="atletas"
                  item-title="id"
                  item-value="id"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 120px;"
                  @update:model-value="onTrocarAtleta"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="'#' + item.raw.id + ' - ' + item.raw.posicaoSugerida"></v-list-item>
                  </template>
                </v-select>
              </div>
            </div>

            <!-- Grade em 2 Colunas com as Metricas e Graficos -->
            <v-row dense>
              <!-- Coluna 1: Prancheta Tatica & Volume por Zonas -->
              <v-col cols="12" lg="6">
                <!-- Prancheta Tatica do Jogador -->
                <div class="panel-box pa-4 mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">
                      Prancheta Tática & Trilha de Deslocamento
                    </span>
                    <span class="text-xs text-primary font-mono font-weight-bold">
                      Amplit. Espacial: {{ atletaSelecionado.raioAcao }} m
                    </span>
                  </div>

                  <div class="single-pitch-frame">
                    <svg viewBox="0 0 1050 680" class="full-pitch-svg" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="pitch-stripes-single" width="105" height="680" patternUnits="userSpaceOnUse">
                          <rect x="0" width="52.5" height="680" fill="#112217" />
                          <rect x="52.5" width="52.5" height="680" fill="#0d1c13" />
                        </pattern>
                      </defs>
                      <rect width="1050" height="680" fill="url(#pitch-stripes-single)" rx="6" />

                      <rect x="40" y="40" width="970" height="600" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
                      <line x1="525" y1="40" x2="525" y2="640" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
                      <circle cx="525" cy="340" r="91.5" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />

                      <rect x="40" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
                      <rect x="845" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />

                      <!-- Trilha de Coordenadas do Atleta -->
                      <g>
                        <circle
                          v-for="(pt, idx) in atletaSelecionado.amostrasPosicao"
                          :key="'trilha-' + idx"
                          :cx="pt.x * 10"
                          :cy="pt.y * 10"
                          r="5"
                          fill="#3e885b"
                          opacity="0.35"
                        />
                      </g>

                      <!-- Raio de Acao -->
                      <circle
                        :cx="atletaSelecionado.centroideX * 10"
                        :cy="atletaSelecionado.centroideY * 10"
                        :r="Math.max(35, (atletaSelecionado.raioAcao || 16) * 10)"
                        fill="rgba(62, 136, 91, 0.15)"
                        stroke="#3e885b"
                        stroke-width="1.5"
                        stroke-dasharray="6,4"
                      />

                      <!-- Marcador do Centroide -->
                      <g :transform="'translate(' + (atletaSelecionado.centroideX * 10) + ',' + (atletaSelecionado.centroideY * 10) + ')'">
                        <circle r="18" fill="#3e885b" stroke="#ffffff" stroke-width="2.5" />
                        <text x="0" y="6" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="900">
                          {{ atletaSelecionado.id }}
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

                <!-- Volume & Zonas de Velocidade -->
                <div class="panel-box pa-4">
                  <div class="text-xs font-weight-bold text-muted uppercase mb-3">
                    Volume de Corrida & Zonas de Intensidade (FIFA / Prozone)
                  </div>

                  <div class="segmented-bar mb-3">
                    <div class="seg-walk" :style="{ width: percentualZona(atletaSelecionado, 'distanciaAndando') + '%' }"></div>
                    <div class="seg-jog" :style="{ width: percentualZona(atletaSelecionado, 'distanciaTrotando') + '%' }"></div>
                    <div class="seg-run" :style="{ width: percentualZona(atletaSelecionado, 'distanciaCorrendo') + '%' }"></div>
                    <div class="seg-sprint" :style="{ width: percentualZona(atletaSelecionado, 'distanciaSprint') + '%' }"></div>
                  </div>

                  <v-row dense>
                    <v-col cols="6" sm="3">
                      <div class="sub-metric-card">
                        <span class="sub-label"><span class="zone-badge zone-walk mr-1"></span> Z1 Caminhada</span>
                        <span class="sub-val font-mono">{{ atletaSelecionado.distanciaAndando?.toFixed(0) }}m</span>
                        <span class="sub-pct font-mono">{{ percentualZona(atletaSelecionado, 'distanciaAndando').toFixed(1) }}%</span>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="sub-metric-card">
                        <span class="sub-label"><span class="zone-badge zone-jog mr-1"></span> Z2 Trote</span>
                        <span class="sub-val font-mono">{{ atletaSelecionado.distanciaTrotando?.toFixed(0) }}m</span>
                        <span class="sub-pct font-mono">{{ percentualZona(atletaSelecionado, 'distanciaTrotando').toFixed(1) }}%</span>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="sub-metric-card">
                        <span class="sub-label"><span class="zone-badge zone-run mr-1"></span> Z3 Corrida</span>
                        <span class="sub-val font-mono">{{ atletaSelecionado.distanciaCorrendo?.toFixed(0) }}m</span>
                        <span class="sub-pct font-mono">{{ percentualZona(atletaSelecionado, 'distanciaCorrendo').toFixed(1) }}%</span>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="sub-metric-card">
                        <span class="sub-label"><span class="zone-badge zone-sprint mr-1"></span> Z4 Sprint</span>
                        <span class="sub-val font-mono text-error font-weight-bold">{{ atletaSelecionado.distanciaSprint?.toFixed(0) }}m</span>
                        <span class="sub-pct font-mono text-error">{{ percentualZona(atletaSelecionado, 'distanciaSprint').toFixed(1) }}%</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <!-- Coluna 2: Radar de Desempenho, Aceleracoes & Borg -->
              <v-col cols="12" lg="6">
                <!-- Radar de Performance vs Time -->
                <div class="panel-box pa-4 mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">
                      Radar de Rendimento &bull; Atleta vs Média do Time
                    </span>
                    <div class="d-flex align-center gap-3 text-xs">
                      <span class="text-primary font-weight-bold">&bull; Jogador {{ atletaSelecionado.id }}</span>
                      <span class="text-muted">&bull; Média da Equipe</span>
                    </div>
                  </div>

                  <div class="radar-box pa-2 text-center">
                    <svg viewBox="0 0 400 320" class="radar-clean">
                      <!-- Grid Poligonal -->
                      <polygon
                        v-for="nivel in [0.25, 0.50, 0.75, 1.0]"
                        :key="'grid-' + nivel"
                        :points="gerarPoligonoGrid(nivel)"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        stroke-width="1"
                      />

                      <!-- Eixos -->
                      <line
                        v-for="(eixo, i) in eixosRadar"
                        :key="'axis-' + i"
                        x1="200"
                        y1="160"
                        :x2="calcularCoordenadaRadar(i, 1.0).x"
                        :y2="calcularCoordenadaRadar(i, 1.0).y"
                        stroke="rgba(255,255,255,0.1)"
                        stroke-width="1"
                      />

                      <!-- Poligono Media Time -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarTime)"
                        fill="rgba(148, 163, 184, 0.15)"
                        stroke="#94a3b8"
                        stroke-width="1.5"
                        stroke-dasharray="3,3"
                      />

                      <!-- Poligono Atleta -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarAtleta)"
                        fill="rgba(62, 136, 91, 0.35)"
                        stroke="#3e885b"
                        stroke-width="2"
                      />

                      <!-- Vertices Atleta -->
                      <circle
                        v-for="(val, i) in dadosRadarAtleta"
                        :key="'vert-' + i"
                        :cx="calcularCoordenadaRadar(i, val).x"
                        :cy="calcularCoordenadaRadar(i, val).y"
                        r="3.5"
                        fill="#3e885b"
                        stroke="#ffffff"
                        stroke-width="1.5"
                      />

                      <!-- Rotulos -->
                      <text
                        v-for="(eixo, i) in eixosRadar"
                        :key="'label-' + i"
                        :x="calcularCoordenadaRadar(i, 1.22).x"
                        :y="calcularCoordenadaRadar(i, 1.22).y + 4"
                        text-anchor="middle"
                        fill="#cbd5e1"
                        font-size="10"
                        font-weight="700"
                      >
                        {{ eixo }}
                      </text>
                    </svg>
                  </div>
                </div>

                <!-- Cargas Inerciais & Borg CR-10 -->
                <div class="panel-box pa-4">
                  <div class="text-xs font-weight-bold text-muted uppercase mb-3">
                    Fisiologia & Escala de Borg CR-10 (Percepção de Esforço)
                  </div>

                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-caption text-white font-weight-medium">Percepção Subjetiva (PSE):</span>
                    <v-chip size="small" :color="corBorg(valorBorg)" variant="flat" class="font-weight-bold font-mono">
                      Borg {{ valorBorg }} &bull; {{ descricaoBorg(valorBorg) }}
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
                    class="my-1"
                  ></v-slider>

                  <v-row dense class="my-2">
                    <v-col cols="6">
                      <div class="sub-metric-card">
                        <span class="sub-label">Carga Foster (sRPE)</span>
                        <span class="sub-val text-primary font-mono font-weight-bold">
                          {{ valorBorg * duracaoSessaoMinutos }} <small>U.A.</small>
                        </span>
                        <span class="sub-pct">{{ duracaoSessaoMinutos }} min monitorados</span>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="sub-metric-card">
                        <span class="sub-label">Índice HSR / Borg</span>
                        <span class="sub-val text-white font-mono font-weight-bold">
                          {{ ((atletaSelecionado.distanciaSprint || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                        </span>
                        <span class="sub-pct">Sprint (m) por ponto PSE</span>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Parecer Clinico / Fisiologico -->
                  <div class="clinical-box pa-3 mt-3">
                    <div class="d-flex align-center mb-1">
                      <v-icon :icon="diagnosticoAtleta.icone" :color="diagnosticoAtleta.cor" size="16" class="mr-2"></v-icon>
                      <span class="text-caption font-weight-bold text-white">{{ diagnosticoAtleta.titulo }}</span>
                    </div>
                    <p class="text-xs text-slate-300 mb-2">{{ diagnosticoAtleta.mensagem }}</p>
                    <div class="text-xs border-t pt-1 text-primary font-weight-bold">
                      Conduta: <span class="text-slate-300 font-weight-regular">{{ diagnosticoAtleta.recomendacao }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- ======================================================== -->
          <!-- MODO 3: TABELA GERAL COMPARATIVA (ALTA DENSIDADE)       -->
          <!-- ======================================================== -->
          <div v-if="modoVisualizacao === 'tabela'">
            <div class="panel-box pa-4">
              <div class="d-flex align-center justify-space-between mb-4 border-b pb-3">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold text-white">Quadro Geral de Rendimento e Cargas</h3>
                  <p class="text-xs text-muted">Todos os parâmetros cinemáticos, inerciais e fisiológicos por atleta.</p>
                </div>

                <v-text-field
                  v-model="filtroBusca"
                  placeholder="Buscar por número ou posição..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="max-width: 280px;"
                ></v-text-field>
              </div>

              <v-table class="clean-table" density="comfortable">
                <thead>
                  <tr>
                    <th>Atleta</th>
                    <th>Posição Tática</th>
                    <th class="text-right">Distância</th>
                    <th class="text-right">M/min</th>
                    <th class="text-right">Vel. Máx</th>
                    <th class="text-center">Acel. / Desacel.</th>
                    <th class="text-right">Sprints</th>
                    <th class="text-right">Player Load</th>
                    <th class="text-right">HPMD (>20W)</th>
                    <th class="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in atletasFiltrados" :key="a.id">
                    <td>
                      <div class="d-flex align-center">
                        <span class="jersey-circle mr-2">#{{ a.id }}</span>
                        <span class="font-weight-bold text-white">Jogador {{ a.id }}</span>
                      </div>
                    </td>
                    <td class="text-slate-300">{{ a.posicaoSugerida }}</td>
                    <td class="text-right font-mono font-weight-bold text-white">{{ (a.distanciaTotal).toFixed(0) }} m</td>
                    <td class="text-right font-mono">
                      <span class="text-primary font-weight-bold">{{ a.metrosPorMinuto.toFixed(1) }}</span>
                    </td>
                    <td class="text-right font-mono text-white">{{ a.velocidadeMaxima.toFixed(1) }} km/h</td>
                    <td class="text-center font-mono">
                      <span class="text-success font-weight-bold">+{{ a.aceleracoesAltas }}</span>
                      <span class="text-muted mx-1">/</span>
                      <span class="text-error font-weight-bold">-{{ a.desaceleracoesAltas }}</span>
                    </td>
                    <td class="text-right font-mono font-weight-bold text-white">{{ a.sprintsContagem || 0 }}</td>
                    <td class="text-right font-mono font-weight-bold text-white">{{ a.playerLoad?.toFixed(0) }}</td>
                    <td class="text-right font-mono text-info">{{ a.distanciaAltaPotenciaMetabolica?.toFixed(0) }} m</td>
                    <td class="text-center">
                      <v-btn
                        size="x-small"
                        color="primary"
                        variant="outlined"
                        @click="selecionarAtleta(a); modoVisualizacao = 'atleta'"
                        class="text-caption font-weight-bold"
                      >
                        Ver Dossiê
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>

        </div>

        <!-- Estado Vazio (Sem Dados) -->
        <div v-else class="panel-box text-center pa-10">
          <v-icon icon="mdi-soccer" size="64" color="primary" class="mb-3"></v-icon>
          <h2 class="text-h6 font-weight-bold text-white">VISÃO 90 &bull; Análise de Desempenho no Futebol</h2>
          <p class="text-caption text-muted mt-2" style="max-width: 480px; margin: 0 auto;">
            Importe os dados cinemáticos de uma partida oficial ou carregue instantaneamente a amostra completa de 11 atletas para explorar o campo tático, radar de rendimento e cargas inerciais.
          </p>
          <div class="mt-5 d-flex justify-center gap-3">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-account-group"
              @click="carregarMockDemonstracao"
              class="font-weight-bold text-caption"
            >
              Carregar Dados do Elenco (11 Atletas)
            </v-btn>
            <v-btn
              color="surface-variant"
              variant="flat"
              prepend-icon="mdi-upload"
              @click="modalImportarAberto = true"
              class="font-weight-bold text-caption"
            >
              Importar Arquivo CSV
            </v-btn>
          </div>
        </div>

      </v-container>
    </v-main>

    <!-- Modal Limpo de Importacao / Entrada de Dados -->
    <v-dialog v-model="modalImportarAberto" max-width="640">
      <v-card class="panel-box pa-4" elevation="10" border>
        <div class="d-flex align-center justify-space-between mb-3 border-b pb-3">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold text-white">Importar Dados Cinemáticos</h3>
            <p class="text-xs text-muted">Arquivo de rastreamento ótico ou GPS (25 FPS)</p>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="modalImportarAberto = false"></v-btn>
        </div>

        <v-tabs v-model="tabModalImport" color="primary" density="compact" class="mb-4">
          <v-tab value="file">Arquivo CSV Local</v-tab>
          <v-tab value="url">Repositório / URL</v-tab>
        </v-tabs>

        <v-window v-model="tabModalImport">
          <!-- Upload -->
          <v-window-item value="file">
            <v-file-input
              v-model="arquivoSelecionado"
              label="Selecione o arquivo CSV"
              accept=".csv,text/csv"
              variant="outlined"
              density="compact"
              color="primary"
              clearable
              hide-details
              class="mb-3"
            ></v-file-input>
            <v-btn
              color="primary"
              block
              :loading="carregando"
              :disabled="!arquivoSelecionado"
              @click="processarPorUpload"
              class="font-weight-bold text-caption"
            >
              Processar Rastreamento
            </v-btn>
          </v-window-item>

          <!-- URL -->
          <v-window-item value="url">
            <v-text-field
              v-model="urlArquivo"
              label="URL do arquivo CSV"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details
              placeholder="https://..."
              class="mb-3"
            ></v-text-field>
            <v-btn
              color="primary"
              block
              :loading="carregando"
              :disabled="!urlArquivo"
              @click="processarPorUrl"
              class="font-weight-bold text-caption"
            >
              Baixar e Processar
            </v-btn>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estado da UI
const modoVisualizacao = ref('elenco') // 'elenco' | 'atleta' | 'tabela'
const modalImportarAberto = ref(false)
const tabModalImport = ref('file')
const arquivoSelecionado = ref(null)
const urlArquivo = ref('')
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const filtroBusca = ref('')

// Dados dos Atletas
const atletas = ref([])
const atletaSelecionadoId = ref('1')

const atletaSelecionado = computed(() => {
  if (atletas.value.length === 0) return null
  return atletas.value.find(a => String(a.id) === String(atletaSelecionadoId.value)) || atletas.value[0]
})

function selecionarAtleta(atleta) {
  atletaSelecionadoId.value = atleta.id
}

function onTrocarAtleta(val) {
  atletaSelecionadoId.value = val
}

// Parametros Fisiologicos
const valorBorg = ref(6)
const duracaoSessaoMinutos = ref(90)

// Presets de Teste
const URL_DATA_A = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv'
const URL_DATA_B = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv'

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

// Radar de Performance
const eixosRadar = ['Volume', 'Intensidade', 'Vel. Max', 'Sprints', 'Acelerações', 'Player Load']

const dadosRadarTime = computed(() => [0.65, 0.65, 0.70, 0.60, 0.65, 0.65])

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
  const centroY = 160
  const raioMax = 105
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
    atletaSelecionadoId.value = json.dados[0]?.id || '1'
    modalImportarAberto.value = false
    mensagemSucesso.value = `Sessão processada com sucesso: ${json.quantidadeJogadores} atletas monitorados.`
  } catch (err) {
    console.error('Erro na requisição:', err)
    mensagemErro.value = `Erro de comunicação: ${err.message}`
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
    atletaSelecionadoId.value = json.dados[0]?.id || '1'
    modalImportarAberto.value = false
    mensagemSucesso.value = `Dados da partida carregados com sucesso (${json.quantidadeJogadores} atletas).`
  } catch (err) {
    console.error('Erro na requisição:', err)
    mensagemErro.value = `Erro ao carregar: ${err.message}`
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
      centroideX: 52.0,
      centroideY: 57.0,
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
      centroideY: 25.0,
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
      centroideY: 43.0,
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
      centroideX: 50.0,
      centroideY: 11.0,
      raioAcao: 23.8,
      amostrasPosicao: [
        { x: 34.0, y: 11.0 }, { x: 49.0, y: 13.0 }, { x: 67.0, y: 10.0 }, { x: 75.0, y: 14.0 }
      ]
    },
    {
      id: '5',
      posicaoSugerida: 'Volante Central',
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
      centroideX: 47.0,
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
      centroideX: 58.0,
      centroideY: 38.0,
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
      centroideX: 63.0,
      centroideY: 28.0,
      raioAcao: 19.5,
      amostrasPosicao: [
        { x: 54.0, y: 28.0 }, { x: 64.0, y: 35.0 }, { x: 72.0, y: 30.0 }, { x: 60.0, y: 34.0 }
      ]
    },
    {
      id: '7',
      posicaoSugerida: 'Ponta Direita',
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
      centroideX: 70.0,
      centroideY: 54.0,
      raioAcao: 24.2,
      amostrasPosicao: [
        { x: 55.0, y: 52.0 }, { x: 72.0, y: 58.0 }, { x: 88.0, y: 56.0 }, { x: 64.0, y: 54.0 }
      ]
    },
    {
      id: '11',
      posicaoSugerida: 'Ponta Esquerda',
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
      centroideX: 68.0,
      centroideY: 14.0,
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
      centroideX: 76.0,
      centroideY: 34.0,
      raioAcao: 18.2,
      amostrasPosicao: [
        { x: 62.0, y: 31.0 }, { x: 75.0, y: 35.0 }, { x: 88.0, y: 33.0 }, { x: 70.0, y: 37.0 }
      ]
    }
  ]
  atletaSelecionadoId.value = '7'
  mensagemSucesso.value = 'Amostra de 11 atletas carregada: explore o Campo do Elenco ou selecione qualquer atleta no Dossiê.'
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
      recomendacao: 'Priorizar protocolo regenerativo nas 24h subsequentes (crioterapia, hidratação e sono monitorado).',
      cor: 'error',
      icone: 'mdi-alert-octagon-outline'
    }
  } else if (borg <= 5 && sprint >= 650) {
    return {
      titulo: 'Alta Prontidão & Eficiência Fisiológica',
      mensagem: 'O atleta sustentou elevado volume de corrida de alta intensidade mantendo percepção moderada de esforço. Excelente resposta de adaptação cardiorrespiratória.',
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
      titulo: 'Resposta Fisiológica Equilibrada',
      mensagem: 'Relação equilibrada entre a demanda mecânica externa e a percepção subjetiva interna para os minutos monitorados.',
      recomendacao: 'Manter a progressão padrão da carga de treinamento.',
      cor: 'primary',
      icone: 'mdi-information-outline'
    }
  }
})
</script>

<style scoped>
/* Fundo Noturno Inspirado na Arte Visao90 */
.app-background {
  background-color: #0b110e !important;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.max-content-width {
  max-width: 1560px;
  margin: 0 auto;
}

/* Header */
.app-header {
  background-color: #080d0a;
  border-bottom: 1px solid #1a2920;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-svg {
  height: 38px;
  width: auto;
}

.letter-spacing-1 {
  letter-spacing: 0.12em;
}

.text-xs {
  font-size: 0.7rem;
  line-height: 1rem;
}

.text-muted {
  color: #8da094;
}

/* Botoes e Toggles */
.view-toggle {
  background-color: #121e17 !important;
  border: 1px solid #23382b !important;
  border-radius: 6px !important;
}

.btn-header {
  border-radius: 6px !important;
}

/* KPI Strip */
.kpi-strip {
  background-color: #0d1611;
  border-bottom: 1px solid #1a2920;
}

.kpi-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.kpi-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #8da094;
  letter-spacing: 0.05em;
}

.kpi-val {
  font-size: 0.85rem;
  font-weight: 700;
}

.kpi-sub {
  font-size: 0.7rem;
  color: #64748b;
}

.live-dot {
  width: 7px;
  height: 7px;
  background-color: #3e885b;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 6px #3e885b;
}

/* Paineis e Caixas */
.panel-box {
  background-color: #121c15;
  border: 1px solid #1f3325;
  border-radius: 8px;
}

.player-header-card {
  background-color: #121c15;
  border: 1px solid #233b2a;
  border-radius: 8px;
}

.player-big-badge {
  width: 44px;
  height: 44px;
  background-color: #3e885b;
  color: #ffffff;
  font-weight: 900;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

/* Squad List (Lista da Esquerda) */
.squad-list {
  max-height: 520px;
  overflow-y: auto;
}

.squad-item {
  background-color: #0d1510;
  border: 1px solid #1a2a1f;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.squad-item:hover {
  background-color: #16241b;
  border-color: #3e885b;
}

.active-player {
  background-color: #1b2e21 !important;
  border-color: #3e885b !important;
  border-left: 4px solid #3e885b !important;
}

.jersey-circle {
  width: 28px;
  height: 28px;
  background-color: #1f3325;
  color: #cbd5e1;
  font-weight: 800;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Campo Tatica SVG */
.tactical-pitch-frame, .single-pitch-frame {
  background-color: #0a140d;
  border: 1px solid #1f3325;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

.full-pitch-svg {
  width: 100%;
  max-height: 520px;
}

.player-pitch-label {
  text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}

/* Sub Metric Cards */
.sub-metric-card {
  background-color: #0e1711;
  border: 1px solid #1c2e21;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.sub-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #8da094;
}

.sub-val {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2px;
}

.sub-pct {
  font-size: 0.7rem;
  color: #64748b;
}

/* Barras de Zonas */
.zone-badge {
  display: inline-block;
  width: 8px;
  height: 8px;
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
  background-color: #1a2a1f;
}

.seg-walk { background-color: #3b82f6; }
.seg-jog { background-color: #06b6d4; }
.seg-run { background-color: #f59e0b; }
.seg-sprint { background-color: #ef4444; }

/* Radar Clean */
.radar-box {
  background-color: #0d1510;
  border: 1px solid #1c2e21;
  border-radius: 6px;
}

.radar-clean {
  width: 100%;
  max-width: 320px;
  height: auto;
}

/* Clinica / Parecer */
.clinical-box {
  background-color: #0d1510;
  border: 1px solid #1c2e21;
  border-radius: 6px;
}

/* Tabela Limpa */
.clean-table {
  background-color: transparent !important;
}

.clean-table th {
  background-color: #0d1510 !important;
  color: #8da094 !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  border-bottom: 1px solid #1f3325 !important;
}

.clean-table td {
  border-bottom: 1px solid #16241b !important;
  font-size: 0.85rem !important;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
</style>
