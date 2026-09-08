<template>
  <v-app class="app-background">
    <!-- Barra Superior Limpa com Logo Original -->
    <header class="app-header px-4 px-md-8 py-2 border-b">
      <div class="d-flex align-center justify-space-between flex-wrap gap-3 max-content-width">
        <!-- Logo Oficial Recortado da Arte Original -->
        <div class="d-flex align-center">
          <div class="logo-container">
            <svg viewBox="135 155 625 195" class="logo-svg-crop" preserveAspectRatio="xMidYMid meet">
              <image href="/logo-visao90.png" width="897" height="600" />
            </svg>
          </div>
        </div>

        <!-- Acoes Principais (Direita) -->
        <div class="d-flex align-center gap-2">
          <v-btn
            size="small"
            color="primary"
            variant="flat"
            prepend-icon="mdi-account-group"
            @click="carregarMockDemonstracao"
            class="text-caption font-weight-bold"
          >
            Carregar Dados da Partida (11 Atletas)
          </v-btn>

          <v-btn
            size="small"
            color="surface-variant"
            variant="flat"
            prepend-icon="mdi-file-upload-outline"
            @click="modalImportarAberto = true"
            class="text-caption font-weight-bold"
          >
            Importar Arquivo CSV
          </v-btn>
        </div>
      </div>
    </header>

    <v-main class="py-6 px-4 px-md-8">
      <v-container fluid class="pa-0 max-content-width">

        <!-- Mensagens de Alerta -->
        <v-alert
          v-if="mensagemErro"
          type="error"
          variant="tonal"
          density="comfortable"
          closable
          class="mb-4"
          @click:close="mensagemErro = ''"
        >
          {{ mensagemErro }}
        </v-alert>

        <v-alert
          v-if="mensagemSucesso"
          type="success"
          variant="tonal"
          density="comfortable"
          closable
          class="mb-4"
          @click:close="mensagemSucesso = ''"
        >
          {{ mensagemSucesso }}
        </v-alert>

        <!-- SE O ELENCO ESTIVER CARREGADO -->
        <div v-if="atletas.length > 0">

          <!-- ======================================================== -->
          <!-- 1. RESUMO COLETIVO DA EQUIPE (CARGA EXTERNA DO ELENCO)    -->
          <!-- ======================================================== -->
          <div class="section-header mb-3">
            <h2 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
              <v-icon icon="mdi-chart-line" color="primary" class="mr-2" size="20"></v-icon>
              1. Carga Externa Coletiva &bull; Resumo Geral da Partida
            </h2>
            <p class="text-caption text-muted">
              Indicadores de volume, intensidade e esforço físico acumulados pelo elenco no campo regulamentar (105m &times; 68m).
            </p>
          </div>

          <v-row dense class="mb-6">
            <!-- Atletas -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Efetivo em Campo</span>
                <span class="metric-number text-white font-mono">{{ atletas.length }} <small>jogadores</small></span>
                <span class="metric-desc">Monitoramento integral</span>
              </div>
            </v-col>

            <!-- Distancia Total -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Volume Total</span>
                <span class="metric-number text-primary font-mono">{{ distanciaColetivaKm.toFixed(1) }} <small>km</small></span>
                <span class="metric-desc font-mono">Média: {{ (distanciaColetivaKm / atletas.length).toFixed(1) }} km/atleta</span>
              </div>
            </v-col>

            <!-- Ritmo de Jogo -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Ritmo de Jogo</span>
                <span class="metric-number text-white font-mono">{{ mediaMetrosPorMinuto.toFixed(0) }} <small>M/min</small></span>
                <span class="metric-desc">Metros corridos por minuto</span>
              </div>
            </v-col>

            <!-- Pico de Velocidade -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Pico de Velocidade</span>
                <span class="metric-number text-warning font-mono">{{ maiorVelocidade.toFixed(1) }} <small>km/h</small></span>
                <span class="metric-desc">Atleta #{{ atletaMaisRapido?.id }}</span>
              </div>
            </v-col>

            <!-- Arrancadas / Aceleracoes -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Arrancadas Rápidas</span>
                <span class="metric-number text-success font-mono">{{ totalAceleracoesAltas }} <small>ações</small></span>
                <span class="metric-desc">Acelerações > 2,5 m/s²</span>
              </div>
            </v-col>

            <!-- Carga em Alta Potencia -->
            <v-col cols="6" sm="4" lg="2">
              <div class="metric-card">
                <span class="metric-title">Alta Potência</span>
                <span class="metric-number text-info font-mono">{{ (totalHpmdM / 1000).toFixed(1) }} <small>km</small></span>
                <span class="metric-desc">Esforços > 20 W/kg (HPMD)</span>
              </div>
            </v-col>
          </v-row>

          <!-- ======================================================== -->
          <!-- 2. TABELA COMPLETA DOS ATLETAS (SEM OCULTAR NADA)         -->
          <!-- ======================================================== -->
          <div class="panel-box mb-6">
            <div class="pa-4 border-b d-flex align-center justify-space-between flex-wrap gap-3">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
                  <v-icon icon="mdi-table-large" color="primary" class="mr-2" size="20"></v-icon>
                  2. Relatório Individual dos Atletas &bull; Métricas Físicas e Cinemáticas
                </h3>
                <p class="text-caption text-muted">
                  Tabela completa com todos os parâmetros calculados pelo algoritmo de rastreamento. Clique em "Ver Análise Detalhada" para inspecionar o atleta.
                </p>
              </div>

              <v-text-field
                v-model="filtroBusca"
                placeholder="Filtrar por camisa ou posição..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 280px;"
              ></v-text-field>
            </div>

            <!-- Tabela com TODOS os dados visíveis -->
            <div class="table-responsive">
              <v-table class="clean-table" hover>
                <thead>
                  <tr>
                    <th class="text-left">Atleta</th>
                    <th class="text-left">Posição Tática</th>
                    <th class="text-right">Distância Total</th>
                    <th class="text-right">Ritmo (M/min)</th>
                    <th class="text-right">Vel. Máxima</th>
                    <th class="text-right">Vel. Média</th>
                    <th class="text-center" style="min-width: 140px;">Faixas de Velocidade</th>
                    <th class="text-center">Arrancadas / Freadas</th>
                    <th class="text-right">Sprints</th>
                    <th class="text-right">Média/Sprint</th>
                    <th class="text-right">Carga Mecânica</th>
                    <th class="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="a in atletasFiltrados"
                    :key="a.id"
                    :class="atletaSelecionado?.id === a.id ? 'active-table-row' : ''"
                  >
                    <!-- Camisa & Nome -->
                    <td>
                      <div class="d-flex align-center">
                        <span class="jersey-badge mr-2">#{{ a.id }}</span>
                        <span class="font-weight-bold text-white">Jogador {{ a.id }}</span>
                      </div>
                    </td>

                    <!-- Posicao Tatica -->
                    <td>
                      <span class="text-slate-300 font-weight-medium text-caption">{{ a.posicaoSugerida }}</span>
                    </td>

                    <!-- Distancia Total -->
                    <td class="text-right font-mono">
                      <span class="font-weight-bold text-white">{{ (a.distanciaTotal).toFixed(0) }} m</span>
                      <div class="text-xs text-muted">({{ (a.distanciaTotal / 1000).toFixed(2) }} km)</div>
                    </td>

                    <!-- Ritmo de Jogo (M/min) -->
                    <td class="text-right font-mono">
                      <v-chip
                        size="x-small"
                        :color="a.metrosPorMinuto >= 120 ? 'error' : a.metrosPorMinuto >= 105 ? 'primary' : 'surface-variant'"
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{ a.metrosPorMinuto.toFixed(1) }} M/min
                      </v-chip>
                    </td>

                    <!-- Velocidade Maxima -->
                    <td class="text-right font-mono text-warning font-weight-bold">
                      {{ a.velocidadeMaxima.toFixed(1) }} km/h
                    </td>

                    <!-- Velocidade Media -->
                    <td class="text-right font-mono text-slate-300">
                      {{ a.velocidadeMedia.toFixed(1) }} km/h
                    </td>

                    <!-- Distribuicao das 4 Zonas -->
                    <td class="text-center">
                      <div class="segmented-bar mb-1" title="Z1: Caminhada | Z2: Trote | Z3: Corrida | Z4: Sprint">
                        <div class="seg-walk" :style="{ width: percentualZona(a, 'distanciaAndando') + '%' }"></div>
                        <div class="seg-jog" :style="{ width: percentualZona(a, 'distanciaTrotando') + '%' }"></div>
                        <div class="seg-run" :style="{ width: percentualZona(a, 'distanciaCorrendo') + '%' }"></div>
                        <div class="seg-sprint" :style="{ width: percentualZona(a, 'distanciaSprint') + '%' }"></div>
                      </div>
                      <div class="text-xs text-muted">
                        Sprint: {{ a.distanciaSprint?.toFixed(0) }}m ({{ percentualZona(a, 'distanciaSprint').toFixed(0) }}%)
                      </div>
                    </td>

                    <!-- Arrancadas vs Freadas -->
                    <td class="text-center font-mono">
                      <span class="text-success font-weight-bold" title="Acelerações > 2,5 m/s²">+{{ a.aceleracoesAltas }}</span>
                      <span class="text-muted mx-1">/</span>
                      <span class="text-error font-weight-bold" title="Desacelerações < -2,5 m/s²">-{{ a.desaceleracoesAltas }}</span>
                    </td>

                    <!-- Sprints Contagem -->
                    <td class="text-right font-mono text-error font-weight-bold">
                      {{ a.sprintsContagem || 0 }} tiros
                    </td>

                    <!-- Distancia Media por Tiro -->
                    <td class="text-right font-mono text-slate-300">
                      {{ a.distanciaMediaSprint?.toFixed(1) || 0 }} m
                    </td>

                    <!-- Carga Mecanica (Player Load) -->
                    <td class="text-right font-mono font-weight-bold text-white">
                      {{ a.playerLoad?.toFixed(0) }}
                    </td>

                    <!-- Botao de Acao -->
                    <td class="text-center">
                      <v-btn
                        size="x-small"
                        color="primary"
                        variant="flat"
                        @click="selecionarAtletaParaInspecao(a)"
                        class="text-caption font-weight-bold"
                      >
                        Ver Análise
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- 3. DOSSIÊ DETALHADO DO JOGADOR (CAMPO, RADAR E BORG)     -->
          <!-- ======================================================== -->
          <div id="dossie-atleta" v-if="atletaSelecionado" class="panel-box pa-5 mb-6">
            <!-- Cabecalho do Atleta -->
            <div class="d-flex align-center justify-space-between flex-wrap gap-3 border-b pb-4 mb-4">
              <div class="d-flex align-center">
                <div class="player-header-badge mr-3">#{{ atletaSelecionado.id }}</div>
                <div>
                  <div class="d-flex align-center gap-2">
                    <h2 class="text-h6 font-weight-black text-white">Dossiê Técnico &bull; Jogador {{ atletaSelecionado.id }}</h2>
                    <v-chip size="small" variant="flat" color="primary" class="font-weight-bold">
                      {{ atletaSelecionado.posicaoSugerida }}
                    </v-chip>
                  </div>
                  <p class="text-caption text-muted mt-1">
                    Análise aprofundada de ocupação espacial, equilíbrio neuromuscular e cruzamento de carga externa com percepção subjetiva (Borg).
                  </p>
                </div>
              </div>

              <!-- Seletor de Atleta Ativo -->
              <div class="d-flex align-center gap-2">
                <span class="text-caption text-muted">Selecionar Atleta:</span>
                <v-select
                  v-model="atletaSelecionadoId"
                  :items="atletas"
                  item-title="id"
                  item-value="id"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 140px;"
                  @update:model-value="onTrocarAtleta"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="'#' + item.raw.id + ' - ' + item.raw.posicaoSugerida"></v-list-item>
                  </template>
                </v-select>
              </div>
            </div>

            <!-- Grade em 3 Colunas Técnicas -->
            <v-row dense>
              <!-- COLUNA 1: CAMPO TATICO E MAPA ESPACIAL -->
              <v-col cols="12" lg="4">
                <div class="sub-panel pa-3 h-100">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">Prancheta Tática Oficial</span>
                    <span class="text-xs text-primary font-mono">Raio: &plusmn;{{ atletaSelecionado.raioAcao }}m</span>
                  </div>

                  <!-- Campo de Futebol SVG com Marcacao Exata -->
                  <div class="pitch-container pa-2 mb-3">
                    <svg viewBox="0 0 1050 680" class="tactical-pitch-svg" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="stripes-dossier" width="105" height="680" patternUnits="userSpaceOnUse">
                          <rect x="0" width="52.5" height="680" fill="#143022" />
                          <rect x="52.5" width="52.5" height="680" fill="#0f261b" />
                        </pattern>
                      </defs>
                      <rect width="1050" height="680" fill="url(#stripes-dossier)" rx="6" />

                      <rect x="40" y="40" width="970" height="600" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />
                      <line x1="525" y1="40" x2="525" y2="640" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />
                      <circle cx="525" cy="340" r="91.5" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.85" />

                      <rect x="40" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
                      <rect x="845" y="160" width="165" height="360" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />

                      <!-- Trilha de Coordenadas -->
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
                        fill="rgba(62, 136, 91, 0.18)"
                        stroke="#3e885b"
                        stroke-width="1.5"
                        stroke-dasharray="6,4"
                      />

                      <!-- Marcador do Jogador -->
                      <g :transform="'translate(' + (atletaSelecionado.centroideX * 10) + ',' + (atletaSelecionado.centroideY * 10) + ')'">
                        <circle r="18" fill="#3e885b" stroke="#ffffff" stroke-width="2.5" />
                        <text x="0" y="6" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="900">
                          {{ atletaSelecionado.id }}
                        </text>
                      </g>
                    </svg>
                  </div>

                  <!-- Resumo Posicional para a Banca -->
                  <div class="text-caption text-slate-300">
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Posicionamento Médio (Centroide):</span>
                      <span class="font-mono font-weight-bold text-white">X={{ atletaSelecionado.centroideX }}m, Y={{ atletaSelecionado.centroideY }}m</span>
                    </div>
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Amplitude de Cobertura (Raio de Ação):</span>
                      <span class="font-mono font-weight-bold text-white">&plusmn;{{ atletaSelecionado.raioAcao }} m</span>
                    </div>
                    <div class="d-flex justify-space-between py-1">
                      <span>Função Tática Estimada:</span>
                      <span class="font-weight-bold text-primary">{{ atletaSelecionado.posicaoSugerida }}</span>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- COLUNA 2: RADAR DE RENDIMENTO VS ELENCO -->
              <v-col cols="12" lg="4">
                <div class="sub-panel pa-3 h-100">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">Radar Multidimensional</span>
                    <div class="d-flex align-center gap-2 text-xs">
                      <span class="text-primary font-weight-bold">&bull; Jogador {{ atletaSelecionado.id }}</span>
                      <span class="text-muted">&bull; Média Time</span>
                    </div>
                  </div>

                  <!-- Grafico de Radar SVG -->
                  <div class="radar-box pa-2 text-center mb-3">
                    <svg viewBox="0 0 400 320" class="radar-svg">
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

                      <!-- Camada Media do Time -->
                      <polygon
                        :points="gerarPontosRadar(dadosRadarTime)"
                        fill="rgba(148, 163, 184, 0.15)"
                        stroke="#94a3b8"
                        stroke-width="1.5"
                        stroke-dasharray="3,3"
                      />

                      <!-- Camada Atleta -->
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

                      <!-- Rotulos dos Eixos -->
                      <text
                        v-for="(eixo, i) in eixosRadar"
                        :key="'label-' + i"
                        :x="calcularCoordenadaRadar(i, 1.24).x"
                        :y="calcularCoordenadaRadar(i, 1.24).y + 4"
                        text-anchor="middle"
                        fill="#cbd5e1"
                        font-size="10"
                        font-weight="700"
                      >
                        {{ eixo }}
                      </text>
                    </svg>
                  </div>

                  <!-- Tabela dos 6 Pilares -->
                  <div class="text-caption text-slate-300">
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Volume Total:</span>
                      <span class="font-mono font-weight-bold text-white">{{ atletaSelecionado.distanciaTotal.toFixed(0) }} m</span>
                    </div>
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Ritmo (Metros/Minuto):</span>
                      <span class="font-mono font-weight-bold text-white">{{ atletaSelecionado.metrosPorMinuto.toFixed(1) }} M/min</span>
                    </div>
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Velocidade Máxima:</span>
                      <span class="font-mono font-weight-bold text-warning">{{ atletaSelecionado.velocidadeMaxima.toFixed(1) }} km/h</span>
                    </div>
                    <div class="d-flex justify-space-between py-1 border-b">
                      <span>Arrancadas > 2,5 m/s²:</span>
                      <span class="font-mono font-weight-bold text-success">+{{ atletaSelecionado.aceleracoesAltas || 0 }} ações</span>
                    </div>
                    <div class="d-flex justify-space-between py-1">
                      <span>Carga Mecânica (Player Load):</span>
                      <span class="font-mono font-weight-bold text-white">{{ atletaSelecionado.playerLoad?.toFixed(0) }}</span>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- COLUNA 3: FISIOLOGIA & ESCALA DE BORG CR-10 (METODO DE FOSTER) -->
              <v-col cols="12" lg="4">
                <div class="sub-panel pa-3 h-100">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-xs font-weight-bold text-muted uppercase">Carga Interna &bull; Escala de Borg CR-10</span>
                    <span class="text-xs text-primary font-weight-bold">Método Foster (1998)</span>
                  </div>

                  <!-- Controle da Escala de Borg -->
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-white font-weight-bold">Percepção de Esforço (PSE):</span>
                    <v-chip size="small" :color="corBorg(valorBorg)" variant="flat" class="font-weight-bold font-mono">
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
                    class="my-1"
                  ></v-slider>

                  <!-- Calculo Foster em Destaque -->
                  <div class="foster-box pa-3 my-2 text-center">
                    <span class="text-xs text-muted uppercase font-weight-bold">Carga da Sessão (Método de Foster)</span>
                    <div class="text-h5 font-weight-black text-primary font-mono mt-1">
                      {{ valorBorg * duracaoSessaoMinutos }} <small>U.A.</small>
                    </div>
                    <span class="text-xs text-slate-300 font-mono">
                      PSE ({{ valorBorg }}) &times; {{ duracaoSessaoMinutos }} minutos de jogo = Carga em Unidades Arbitrárias
                    </span>
                  </div>

                  <!-- Indices de Eficiencia -->
                  <div class="d-flex gap-2 mb-3">
                    <div class="metric-card flex-grow-1 pa-2 text-center">
                      <span class="metric-title">Sprint / Borg</span>
                      <span class="text-caption font-weight-bold text-white font-mono">
                        {{ ((atletaSelecionado.distanciaSprint || 0) / Math.max(1, valorBorg)).toFixed(1) }} m/ponto
                      </span>
                    </div>
                    <div class="metric-card flex-grow-1 pa-2 text-center">
                      <span class="metric-title">Carga Mecânica / Borg</span>
                      <span class="text-caption font-weight-bold text-white font-mono">
                        {{ ((atletaSelecionado.playerLoad || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                      </span>
                    </div>
                  </div>

                  <!-- Parecer da Comissao Tecnica -->
                  <div class="clinical-box pa-3">
                    <div class="d-flex align-center mb-1">
                      <v-icon :icon="diagnosticoAtleta.icone" :color="diagnosticoAtleta.cor" size="18" class="mr-2"></v-icon>
                      <span class="text-caption font-weight-bold text-white">{{ diagnosticoAtleta.titulo }}</span>
                    </div>
                    <p class="text-xs text-slate-300 mb-2">{{ diagnosticoAtleta.mensagem }}</p>
                    <div class="text-xs border-t pt-1 text-primary font-weight-bold">
                      Conduta Recomendada: <span class="text-slate-300 font-weight-regular">{{ diagnosticoAtleta.recomendacao }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

        </div>

        <!-- ESTADO VAZIO: NENHUM DADO CARREGADO -->
        <div v-else class="empty-box pa-10 text-center">
          <div class="logo-container mx-auto mb-4" style="height: 70px;">
            <svg viewBox="135 155 625 195" style="height: 64px; width: auto;" preserveAspectRatio="xMidYMid meet">
              <image href="/logo-visao90.png" width="897" height="600" />
            </svg>
          </div>
          <h2 class="text-h6 font-weight-bold text-white">Pronto para a Avaliação da Partida</h2>
          <p class="text-caption text-muted mt-2" style="max-width: 520px; margin: 0 auto;">
            Clique no botão abaixo para carregar a amostra oficial com 11 atletas escalados e apresentar todos os cálculos cinemáticos, mapa tático e escala de Borg para a banca.
          </p>
          <div class="mt-5 d-flex justify-center gap-3">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-account-group"
              @click="carregarMockDemonstracao"
              class="font-weight-bold"
            >
              Carregar Dados da Partida (11 Atletas)
            </v-btn>
            <v-btn
              color="surface-variant"
              variant="flat"
              prepend-icon="mdi-file-upload-outline"
              @click="modalImportarAberto = true"
              class="font-weight-bold"
            >
              Importar Arquivo CSV
            </v-btn>
          </div>
        </div>

      </v-container>
    </v-main>

    <!-- Modal de Importacao de Dados -->
    <v-dialog v-model="modalImportarAberto" max-width="600">
      <v-card class="panel-box pa-4" elevation="10" border>
        <div class="d-flex align-center justify-space-between mb-3 border-b pb-3">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold text-white">Importar Dados Cinemáticos</h3>
            <p class="text-xs text-muted">Arquivo de rastreamento ótico ou GPS (25 Hz)</p>
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
              Processar Cinemática
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
const atletaSelecionadoId = ref('7')

const atletaSelecionado = computed(() => {
  if (atletas.value.length === 0) return null
  return atletas.value.find(a => String(a.id) === String(atletaSelecionadoId.value)) || atletas.value[0]
})

function selecionarAtletaParaInspecao(atleta) {
  atletaSelecionadoId.value = atleta.id
  // Rola a tela suavemente para a ficha do atleta
  const el = document.getElementById('dossie-atleta')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function onTrocarAtleta(val) {
  atletaSelecionadoId.value = val
}

// Parametros Fisiologicos
const valorBorg = ref(6)
const duracaoSessaoMinutos = ref(90)

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
const eixosRadar = ['Volume', 'Ritmo M/min', 'Vel. Máx', 'Sprints', 'Arrancadas', 'Player Load']

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
  const raioMax = 100
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
    mensagemSucesso.value = `Sessão processada com sucesso: ${json.quantidadeJogadores} atletas analisados.`
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
  mensagemSucesso.value = 'Dados da partida carregados com sucesso: 11 atletas monitorados com métricas completas.'
}

// Escala de Borg CR-10
function descricaoBorg(val) {
  if (val <= 1) return 'Muito Leve (Repouso)'
  if (val <= 3) return 'Leve / Moderado'
  if (val <= 5) return 'Pesado (Forte)'
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
      titulo: 'Alerta de Sobrecarga / Risco de Fadiga Residual',
      mensagem: 'O atleta reportou percepção de esforço muito alta (PSE >= 8) apesar de ter produzido baixo volume de alta intensidade. Indica estresse neuromuscular acumulado ou recuperação insuficiente.',
      recomendacao: 'Protocolo de recuperação prioritário: crioterapia, reidratação monitorada e modulação de carga no próximo microciclo.',
      cor: 'error',
      icone: 'mdi-alert-octagon-outline'
    }
  } else if (borg <= 5 && sprint >= 650) {
    return {
      titulo: 'Prontidão Excelente & Alta Eficiência Física',
      mensagem: 'O atleta sustentou alto volume de corridas em alta velocidade mantendo baixa percepção subjetiva de esforço. Excelente capacidade adaptativa cardiorrespiratória.',
      recomendacao: 'Atleta em condições ideais de competição. Manter o programa de treinamento atual.',
      cor: 'success',
      icone: 'mdi-check-decagram-outline'
    }
  } else if (borg >= 7) {
    return {
      titulo: 'Alta Demanda Fisiológica da Partida',
      mensagem: 'A percepção de cansaço reflete diretamente o elevado volume de corrida e impacto mecânico exigidos na partida.',
      recomendacao: 'Reposição de glicogênio nas primeiras horas e descanso ativo.',
      cor: 'warning',
      icone: 'mdi-alert-circle-outline'
    }
  } else {
    return {
      titulo: 'Resposta Fisiológica Normal e Equilibrada',
      mensagem: 'Relação esperada entre a demanda mecânica externa e o esforço interno reportado para os 90 minutos de jogo.',
      recomendacao: 'Seguir o plano habitual de treinamento e regeneração.',
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
}

.logo-container {
  display: flex;
  align-items: center;
  height: 48px;
}

.logo-svg-crop {
  height: 44px;
  width: auto;
  max-width: 220px;
}

.text-xs {
  font-size: 0.72rem;
  line-height: 1.1rem;
}

.text-muted {
  color: #8da094;
}

/* Paineis e Caixas */
.panel-box {
  background-color: #121c15;
  border: 1px solid #1f3325;
  border-radius: 8px;
  overflow: hidden;
}

.sub-panel {
  background-color: #0e1711;
  border: 1px solid #1c2e21;
  border-radius: 6px;
}

.empty-box {
  background-color: #121c15;
  border: 1px dashed #233b2a;
  border-radius: 8px;
}

/* Cards de Metricas no Topo */
.metric-card {
  background-color: #121c15;
  border: 1px solid #1f3325;
  border-radius: 6px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
}

.metric-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #8da094;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-number {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2px;
}

.metric-desc {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 2px;
}

/* Tabela de Dados */
.table-responsive {
  overflow-x: auto;
}

.clean-table {
  background-color: transparent !important;
  width: 100%;
}

.clean-table th {
  background-color: #0e1711 !important;
  color: #8da094 !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.04em !important;
  border-bottom: 1px solid #1f3325 !important;
  padding: 10px 14px !important;
}

.clean-table td {
  border-bottom: 1px solid #16241b !important;
  padding: 10px 14px !important;
  font-size: 0.85rem !important;
}

.active-table-row {
  background-color: rgba(62, 136, 91, 0.1) !important;
}

.jersey-badge {
  background-color: #1f3325;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.player-header-badge {
  width: 44px;
  height: 44px;
  background-color: #3e885b;
  color: #ffffff;
  font-weight: 900;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
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
  height: 7px;
  width: 100%;
  border-radius: 3px;
  overflow: hidden;
  background-color: #1a2a1f;
}

.seg-walk { background-color: #3b82f6; }
.seg-jog { background-color: #06b6d4; }
.seg-run { background-color: #f59e0b; }
.seg-sprint { background-color: #ef4444; }

/* Prancheta Tatica SVG */
.pitch-container {
  background-color: #0a140d;
  border: 1px solid #1f3325;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

.tactical-pitch-svg {
  width: 100%;
  max-height: 280px;
}

/* Radar */
.radar-box {
  background-color: #0a140d;
  border: 1px solid #1c2e21;
  border-radius: 6px;
}

.radar-svg {
  width: 100%;
  max-height: 240px;
}

/* Caixa Foster */
.foster-box {
  background-color: #0d1611;
  border: 1px solid #233b2a;
  border-radius: 6px;
}

/* Parecer Clinico */
.clinical-box {
  background-color: #0a140d;
  border: 1px solid #1c2e21;
  border-radius: 6px;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
</style>
