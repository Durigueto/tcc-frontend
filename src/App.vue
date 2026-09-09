<template>
  <v-app class="app-background">
    <!-- BARRA LATERAL (MENU PRINCIPAL) -->
    <v-navigation-drawer
      v-model="drawerAberto"
      color="#060b13"
      width="270"
      border
      elevation="4"
      class="sidebar-custom"
    >
      <!-- Logo Oficial Visão 90 no topo da barra -->
      <div class="sidebar-logo-container pa-4 border-b">
        <img
          src="/visao90-header.png"
          alt="Visão 90"
          class="sidebar-logo-img"
        />
      </div>

      <!-- Menu de Navegação em 4 Módulos -->
      <v-list density="comfortable" nav class="pa-3 mt-1">
        <!-- 1. Inserção de Dados -->
        <v-list-item
          value="dados"
          :active="menuAtivo === 'dados'"
          @click="menuAtivo = 'dados'"
          rounded="lg"
          class="mb-2 nav-item-custom"
          color="secondary"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-database-plus-outline" class="mr-1"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-body-2">
            Inserção de Dados
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis">
            Upload CSV & Fontes 25 Hz
          </v-list-item-subtitle>
        </v-list-item>

        <!-- 2. Partidas & Histórico -->
        <v-list-item
          value="partidas"
          :active="menuAtivo === 'partidas'"
          @click="menuAtivo = 'partidas'"
          rounded="lg"
          class="mb-2 nav-item-custom"
          color="info"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-calendar-sync-outline" class="mr-1"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-body-2">
            Partidas & Histórico
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis">
            Comparativo entre jogos
          </v-list-item-subtitle>
        </v-list-item>

        <!-- 3. Dashboard do Time -->
        <v-list-item
          value="time"
          :active="menuAtivo === 'time'"
          @click="menuAtivo = 'time'"
          rounded="lg"
          class="mb-2 nav-item-custom"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-soccer" class="mr-1"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-body-2">
            Dashboard do Time
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis">
            Visão Coletiva & Tática
          </v-list-item-subtitle>
        </v-list-item>

        <!-- 4. Dashboard do Atleta -->
        <v-list-item
          value="atleta"
          :active="menuAtivo === 'atleta'"
          @click="menuAtivo = 'atleta'"
          rounded="lg"
          class="mb-2 nav-item-custom"
          color="warning"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-account-details-outline" class="mr-1"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-body-2">
            Dashboard do Atleta
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis">
            Individual & Risco de Lesão
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-spacer></v-spacer>

      <!-- Status do Sistema no Rodapé do Menu -->
      <template v-slot:append>
        <div class="pa-3 border-t bg-surface-darken-1">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption text-medium-emphasis">Partida Ativa:</span>
            <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
              ID #{{ partidaAtiva.id }}
            </v-chip>
          </div>
          <div class="text-caption text-truncate font-weight-medium text-slate-200">
            {{ partidaAtiva.nome }}
          </div>

          <div class="mt-3 pt-2 border-t d-flex flex-column gap-1">
            <div class="d-flex align-center text-caption text-success">
              <v-icon icon="mdi-circle-medium" size="18"></v-icon>
              <span>Motor Cinemático 25 Hz</span>
            </div>
            <div class="d-flex align-center text-caption text-info">
              <v-icon icon="mdi-database-check" size="16" class="mr-1"></v-icon>
              <span>PostgreSQL Integrado</span>
            </div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- TOP APP BAR -->
    <v-app-bar color="#070c17" elevation="1" border="b" height="64">
      <v-app-bar-nav-icon
        @click="drawerAberto = !drawerAberto"
        color="grey-lighten-1"
      ></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <h1 class="text-subtitle-1 text-sm-h6 font-weight-bold ml-1 mb-0">
          {{ tituloSecaoAtiva }}
        </h1>
        <span class="text-caption text-medium-emphasis ml-3 d-none d-md-inline">
          {{ subtituloSecaoAtiva }}
        </span>
      </div>

      <v-spacer></v-spacer>

      <!-- Seletor Rápido de Partida Ativa (sempre acessível no topo) -->
      <div style="min-width: 220px; max-width: 320px;" class="mr-2 mr-sm-4">
        <v-select
          v-model="partidaAtivaId"
          :items="partidas"
          item-title="nome"
          item-value="id"
          label="Partida em Análise"
          density="compact"
          variant="outlined"
          color="primary"
          hide-details
          prepend-inner-icon="mdi-shield-outline"
          class="select-partida-top"
        ></v-select>
      </div>

      <!-- Atalho de Carregamento Rápido -->
      <v-btn
        v-if="partidas.length === 0"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-lightning-bolt"
        @click="carregarPartidasPadrao"
        class="font-weight-bold mr-2"
      >
        Carregar Dados
      </v-btn>
    </v-app-bar>

    <!-- CONTEÚDO PRINCIPAL (RENDERIZAÇÃO DOS 4 MÓDULOS) -->
    <v-main class="main-viewport pa-4 pa-md-6">
      <!-- Alertas de Feedback -->
      <v-alert
        v-if="mensagemAlerta"
        :type="tipoAlerta"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="mensagemAlerta = ''"
      >
        {{ mensagemAlerta }}
      </v-alert>

      <!-- ========================================================================= -->
      <!-- MÓDULO 1: INSERÇÃO DE DADOS & ARQUIVOS                                   -->
      <!-- ========================================================================= -->
      <div v-if="menuAtivo === 'dados'">
        <v-row>
          <v-col cols="12" md="8">
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <div class="d-flex align-center mb-3">
                <v-avatar color="secondary" variant="tonal" class="mr-3">
                  <v-icon icon="mdi-file-upload-outline" color="secondary"></v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold">Importação de Arquivo CSV (Tracking 25 Hz)</h2>
                  <p class="text-caption text-medium-emphasis">
                    Envie as coordenadas bidimensionais brutas (X, Y) capturadas por câmeras óticas ou GPS esportivo.
                  </p>
                </div>
              </div>

              <v-divider class="mb-4"></v-divider>

              <v-file-input
                v-model="arquivoUpload"
                label="Selecione o arquivo CSV de rastreamento"
                accept=".csv,text/csv"
                prepend-icon="mdi-file-delimited"
                variant="outlined"
                color="primary"
                show-size
                clearable
                placeholder="Exemplo: partida_oficial_25fps.csv"
                class="mb-3"
              ></v-file-input>

              <v-text-field
                v-model="nomeNovaPartida"
                label="Nome ou Identificação do Confronto (Opcional)"
                placeholder="Ex: Rodada 5 - vs Corinthians"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-text-field>

              <v-btn
                color="primary"
                size="large"
                block
                :loading="carregando"
                :disabled="!arquivoUpload"
                prepend-icon="mdi-play-speed"
                @click="processarUploadArquivo"
                class="font-weight-bold"
              >
                Processar & Integrar aos Dashboards
              </v-btn>
            </v-card>

            <!-- Card de Ingestão Remota / URL -->
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center mb-3">
                <v-avatar color="info" variant="tonal" class="mr-3">
                  <v-icon icon="mdi-link-variant" color="info"></v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold">Importação via URL / Repositório Externo</h2>
                  <p class="text-caption text-medium-emphasis">
                    Forneça uma URL pública de dados brutos ou use um dos conjuntos pré-configurados.
                  </p>
                </div>
              </div>

              <v-divider class="mb-4"></v-divider>

              <v-text-field
                v-model="urlDataset"
                label="URL do Arquivo CSV (Raw Data)"
                variant="outlined"
                color="info"
                placeholder="https://.../dados_rastreamento.csv"
                class="mb-3"
              ></v-text-field>

              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-chip
                  size="small"
                  variant="outlined"
                  color="info"
                  @click="aplicarPresetUrl('home')"
                  prepend-icon="mdi-shield-home"
                >
                  Preset 1: Equipe Mandante (Game 1)
                </v-chip>
                <v-chip
                  size="small"
                  variant="outlined"
                  color="info"
                  @click="aplicarPresetUrl('away')"
                  prepend-icon="mdi-shield-airplane"
                >
                  Preset 2: Equipe Visitante (Game 1)
                </v-chip>
              </div>

              <v-btn
                color="info"
                size="large"
                block
                :loading="carregando"
                :disabled="!urlDataset"
                prepend-icon="mdi-download-network"
                @click="processarUrlDataset"
                class="font-weight-bold"
              >
                Baixar & Processar Dataset
              </v-btn>
            </v-card>
          </v-col>

          <!-- Coluna Lateral de Informações de Dados -->
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-2">
                <v-icon icon="mdi-information-outline" color="primary" class="mr-2"></v-icon>
                Requisitos do Arquivo
              </h3>
              <ul class="text-caption text-medium-emphasis pl-4 d-flex flex-column gap-2">
                <li><strong>Taxa de Amostragem:</strong> 25 Hz (25 frames por segundo).</li>
                <li><strong>Coordenadas:</strong> X e Y normalizados [0.0 a 1.0] ou métricos [0 a 105m, 0 a 68m].</li>
                <li><strong>Identificação:</strong> Colunas separadas por atleta (ex: <code>Home_1_X, Home_1_Y</code>).</li>
                <li><strong>Frequência de Atualização:</strong> As métricas inerciais e cinemáticas são computadas instantaneamente.</li>
              </ul>
            </v-card>

            <v-card class="glass-card pa-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-2">
                <v-icon icon="mdi-lightning-bolt" color="warning" class="mr-2"></v-icon>
                Carregamento Rápido
              </h3>
              <p class="text-caption text-medium-emphasis mb-3">
                Deseja restaurar as 3 partidas de demonstração oficiais completas com 11 atletas cada?
              </p>
              <v-btn
                color="warning"
                variant="tonal"
                block
                prepend-icon="mdi-refresh"
                @click="carregarPartidasPadrao"
                class="font-weight-bold"
              >
                Restaurar Demonstração (3 Partidas)
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 2: PARTIDAS & HISTÓRICO COMPARATIVO                              -->
      <!-- ========================================================================= -->
      <div v-else-if="menuAtivo === 'partidas'">
        <!-- Cabeçalho da Seção -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-4">
          <div>
            <h2 class="text-h5 font-weight-bold">Gestão & Histórico Comparativo de Partidas</h2>
            <p class="text-caption text-medium-emphasis">
              Selecione a partida ativa para análise nos dashboards ou compare a evolução física da equipe.
            </p>
          </div>
          <v-chip color="primary" variant="flat" class="font-weight-bold">
            {{ partidas.length }} Partidas Registradas
          </v-chip>
        </div>

        <!-- Cards das Partidas Cadastradas -->
        <v-row class="mb-6">
          <v-col
            v-for="p in partidas"
            :key="p.id"
            cols="12"
            md="4"
          >
            <v-card
              class="glass-card match-card pa-4"
              :class="{ 'match-card-active': p.id === partidaAtivaId }"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <v-chip
                  size="small"
                  :color="p.id === partidaAtivaId ? 'primary' : 'surface-variant'"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ p.id === partidaAtivaId ? 'PARTIDA ATIVA' : 'Partida #' + p.id }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">{{ p.data }} &middot; {{ p.duracao }} min</span>
              </div>

              <h3 class="text-h6 font-weight-bold mb-1">{{ p.nome }}</h3>
              <div class="text-caption text-primary font-weight-medium mb-3">
                Adversário: {{ p.adversario }} &middot; Placar: {{ p.placar }}
              </div>

              <v-divider class="mb-3"></v-divider>

              <!-- Mini KPIs da Partida -->
              <v-row dense class="text-center mb-3">
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">Volume</div>
                  <div class="font-weight-bold text-body-2 text-secondary">
                    {{ (calcularDistanciaColetiva(p.atletas) / 1000).toFixed(1) }} km
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">Ritmo Médio</div>
                  <div class="font-weight-bold text-body-2 text-info">
                    {{ calcularMediaMmin(p.atletas).toFixed(0) }} m/min
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">Vel. Máx</div>
                  <div class="font-weight-bold text-body-2 text-warning">
                    {{ calcularMaiorVelocidade(p.atletas).toFixed(1) }} km/h
                  </div>
                </v-col>
              </v-row>

              <div class="d-flex gap-2">
                <v-btn
                  v-if="p.id !== partidaAtivaId"
                  color="primary"
                  variant="outlined"
                  size="small"
                  block
                  prepend-icon="mdi-check"
                  @click="selecionarPartida(p.id)"
                  class="font-weight-bold"
                >
                  Ativar Partida
                </v-btn>
                <v-btn
                  v-else
                  color="primary"
                  variant="flat"
                  size="small"
                  block
                  prepend-icon="mdi-chart-box"
                  @click="menuAtivo = 'time'"
                  class="font-weight-bold"
                >
                  Abrir Dashboard do Time
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tabela Comparativa Detalhada entre as Partidas -->
        <v-card class="glass-card mb-4" elevation="0">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-chart-timeline-variant" color="secondary" class="mr-2"></v-icon>
            <span>Quadro Comparativo de Carga Coletiva entre Confrontos</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-table hover class="bg-transparent table-custom">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Confronto</th>
                <th class="text-left font-weight-bold">Data / Minutos</th>
                <th class="text-left font-weight-bold">Volume Total (km)</th>
                <th class="text-left font-weight-bold">Ritmo Médio (m/min)</th>
                <th class="text-left font-weight-bold">Pico de Velocidade</th>
                <th class="text-left font-weight-bold">Arrancadas (> 2.5 m/s²)</th>
                <th class="text-left font-weight-bold">Frenagens (< -2.5 m/s²)</th>
                <th class="text-center font-weight-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in partidas"
                :key="'row-' + p.id"
                :class="{ 'bg-surface-variant': p.id === partidaAtivaId }"
              >
                <td>
                  <div class="d-flex align-center py-1">
                    <span
                      class="status-indicator mr-2"
                      :class="p.id === partidaAtivaId ? 'bg-primary' : 'bg-grey'"
                    ></span>
                    <strong>{{ p.nome }}</strong>
                  </div>
                </td>
                <td class="text-caption text-medium-emphasis">
                  {{ p.data }} ({{ p.duracao }} min)
                </td>
                <td>
                  <strong>{{ (calcularDistanciaColetiva(p.atletas) / 1000).toFixed(1) }} km</strong>
                </td>
                <td>
                  <v-chip size="small" variant="tonal" color="info" class="font-weight-bold">
                    {{ calcularMediaMmin(p.atletas).toFixed(0) }} m/min
                  </v-chip>
                </td>
                <td>
                  <strong>{{ calcularMaiorVelocidade(p.atletas).toFixed(1) }} km/h</strong>
                </td>
                <td class="text-success font-weight-bold">
                  +{{ calcularTotalAceleracoes(p.atletas) }}
                </td>
                <td class="text-error font-weight-bold">
                  -{{ calcularTotalDesaceleracoes(p.atletas) }}
                </td>
                <td class="text-center">
                  <v-btn
                    size="small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-swap-horizontal"
                    @click="selecionarPartida(p.id)"
                  >
                    Selecionar
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 3: DASHBOARD COLETIVO DO TIME (MÁXIMO DE DADOS DA EQUIPE)          -->
      <!-- ========================================================================= -->
      <div v-else-if="menuAtivo === 'time'">
        <!-- Contexto da Partida Analisada -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-4">
          <div>
            <div class="d-flex align-center gap-2">
              <h2 class="text-h5 font-weight-bold">{{ partidaAtiva.nome }}</h2>
              <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
                {{ partidaAtiva.placar }}
              </v-chip>
            </div>
            <p class="text-caption text-medium-emphasis mt-1">
              Data: {{ partidaAtiva.data }} &middot; Duração: {{ partidaAtiva.duracao }} min &middot; {{ atletasAtivos.length }} Atletas Analisados
            </p>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn
              color="secondary"
              variant="outlined"
              size="small"
              prepend-icon="mdi-account-details-outline"
              @click="menuAtivo = 'atleta'"
              class="font-weight-bold"
            >
              Ir para Dashboard do Atleta
            </v-btn>
          </div>
        </div>

        <!-- 1. SEIS KPIS COLETIVOS -->
        <v-row class="mb-4">
          <!-- Volume Coletivo -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Volume Coletivo
                </div>
                <div class="text-h4 font-weight-black mt-1 text-secondary">
                  {{ (distanciaColetivaKm).toFixed(1) }} <span class="text-caption">km</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Média: {{ (distanciaColetivaKm / atletasAtivos.length).toFixed(1) }} km/atleta
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Ritmo Médio da Partida -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Ritmo Médio (M/min)
                </div>
                <div class="text-h4 font-weight-black mt-1 text-info">
                  {{ mediaMetrosPorMinuto.toFixed(0) }} <span class="text-caption">m/min</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Ref. Elite: 100-125 m/min
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Pico de Velocidade do Time -->
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
                  Atleta mais veloz: #{{ atletaMaisRapido?.id || '-' }}
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Arrancadas Coletivas -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Arrancadas (> 2.5)
                </div>
                <div class="text-h4 font-weight-black mt-1 text-success">
                  {{ totalAceleracoesAltas }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Explosivas (> 3.0): {{ totalAceleracoesExplosivas }}
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Frenagens Coletivas (Carga Excêntrica) -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Frenagens (< -2.5)
                </div>
                <div class="text-h4 font-weight-black mt-1 text-error">
                  {{ totalDesaceleracoesAltas }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Críticas (< -3.0): {{ totalDesaceleracoesCriticas }}
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- HPMD Coletivo -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Alta Potência (HPMD)
                </div>
                <div class="text-h4 font-weight-black mt-1 text-primary">
                  {{ (totalHpmdM / 1000).toFixed(1) }} <span class="text-caption">km</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Demanda > 20 W/kg
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- 2. TÁTICA COLETIVA & PRANCHETA COM OS 11 ATLETAS SIMULTÂNEOS -->
        <v-row class="mb-4">
          <!-- Prancheta Oficial do Time Completo (105m x 68m) -->
          <v-col cols="12" lg="8">
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-soccer-field" color="primary" class="mr-2"></v-icon>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-bold">
                      Formação Tática Oficial & Ocupação Espacial (11 Atletas)
                    </h3>
                    <div class="text-caption text-medium-emphasis">
                      Gramado Oficial 105m × 68m com posições médias simultâneas
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <v-chip size="small" variant="tonal" color="success">
                    Baricentro: X={{ baricentroX }}m, Y={{ baricentroY }}m
                  </v-chip>
                  <v-chip size="small" variant="tonal" color="info">
                    Compacidade: {{ compacidadeMetros }}m
                  </v-chip>
                </div>
              </div>

              <!-- SVG do Gramado com Todos os 11 Jogadores -->
              <div class="pitch-container pa-3">
                <svg
                  viewBox="0 0 1050 680"
                  class="soccer-pitch"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Fundo de Grama com Faixas -->
                  <defs>
                    <pattern id="pitch-stripes-team" width="105" height="680" patternUnits="userSpaceOnUse">
                      <rect x="0" width="52.5" height="680" fill="#133826" />
                      <rect x="52.5" width="52.5" height="680" fill="#0f2f1f" />
                    </pattern>
                  </defs>
                  <rect width="1050" height="680" fill="url(#pitch-stripes-team)" rx="14" />

                  <!-- Linhas Regulamentares Brancas -->
                  <rect x="40" y="40" width="970" height="600" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <line x1="525" y1="40" x2="525" y2="640" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="525" cy="340" r="91.5" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="525" cy="340" r="6" fill="rgba(255,255,255,0.9)" />

                  <!-- Áreas -->
                  <rect x="40" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <rect x="40" y="245" width="55" height="190" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="150" cy="340" r="5" fill="rgba(255,255,255,0.9)" />

                  <rect x="845" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <rect x="955" y="245" width="55" height="190" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="900" cy="340" r="5" fill="rgba(255,255,255,0.9)" />

                  <!-- Polígono / Elipse de Compacidade do Time -->
                  <ellipse
                    :cx="parseFloat(baricentroX) * 10"
                    :cy="parseFloat(baricentroY) * 10"
                    :rx="Math.max(60, parseFloat(comprimentoBloco) * 5.5)"
                    :ry="Math.max(60, parseFloat(larguraBloco) * 5.5)"
                    fill="rgba(16, 185, 129, 0.12)"
                    stroke="#10b981"
                    stroke-width="2"
                    stroke-dasharray="8,6"
                  />

                  <!-- Baricentro da Equipe (Ponto Central) -->
                  <g :transform="'translate(' + (parseFloat(baricentroX) * 10) + ',' + (parseFloat(baricentroY) * 10) + ')'">
                    <circle r="10" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
                    <circle r="3" fill="#ffffff" />
                  </g>

                  <!-- PLOTAGEM DOS 11 ATLETAS COM SUAS CAMISAS E POSIÇÕES -->
                  <g
                    v-for="atleta in atletasAtivos"
                    :key="'pitch-team-' + atleta.id"
                    :transform="'translate(' + (atleta.centroideX * 10) + ',' + (atleta.centroideY * 10) + ')'"
                    style="cursor: pointer;"
                    @click="abrirAtletaNoDashboard(atleta.id)"
                  >
                    <!-- Sombra do Jogador -->
                    <circle r="18" fill="rgba(0,0,0,0.45)" cx="0" cy="4" />
                    <!-- Círculo do Jogador -->
                    <circle
                      r="16"
                      :fill="obterCorSetor(atleta.posicaoSugerida)"
                      stroke="#ffffff"
                      stroke-width="2.5"
                    />
                    <!-- Número da Camisa -->
                    <text
                      x="0"
                      y="5"
                      text-anchor="middle"
                      fill="#ffffff"
                      font-size="13"
                      font-weight="bold"
                      font-family="sans-serif"
                    >
                      {{ atleta.id }}
                    </text>

                    <!-- Rótulo Flutuante da Posição -->
                    <text
                      x="0"
                      y="28"
                      text-anchor="middle"
                      fill="#e2e8f0"
                      font-size="10"
                      font-weight="bold"
                      font-family="sans-serif"
                    >
                      {{ atleta.posicaoSugerida }}
                    </text>
                  </g>
                </svg>
              </div>

              <!-- Legenda do Gramado -->
              <div class="d-flex flex-wrap align-center justify-space-between mt-3 text-caption text-medium-emphasis">
                <div class="d-flex align-center gap-3">
                  <span class="d-flex align-center">
                    <span style="width:10px; height:10px; background:#f59e0b; border-radius:50%; display:inline-block;" class="mr-1"></span>
                    Goleiro
                  </span>
                  <span class="d-flex align-center">
                    <span style="width:10px; height:10px; background:#3b82f6; border-radius:50%; display:inline-block;" class="mr-1"></span>
                    Defensores
                  </span>
                  <span class="d-flex align-center">
                    <span style="width:10px; height:10px; background:#10b981; border-radius:50%; display:inline-block;" class="mr-1"></span>
                    Meio-Campistas
                  </span>
                  <span class="d-flex align-center">
                    <span style="width:10px; height:10px; background:#ef4444; border-radius:50%; display:inline-block;" class="mr-1"></span>
                    Atacantes
                  </span>
                </div>
                <span>&bull; Clique em um jogador no campo para abrir sua análise detalhada</span>
              </div>
            </v-card>
          </v-col>

          <!-- 3. MÉTRICAS TÁTICAS E SEMÁFORO DE RISCO COLETIVO -->
          <v-col cols="12" lg="4">
            <!-- Card de Compacidade e Bloco -->
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-3">
                <v-icon icon="mdi-compass-outline" color="secondary" class="mr-2"></v-icon>
                Dimensões do Bloco Tático da Equipe
              </h3>

              <v-row dense class="text-center mb-3">
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Compacidade Tática</div>
                    <div class="text-h6 font-weight-black text-primary">
                      {{ compacidadeMetros }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Dispersão ao Baricentro</div>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Baricentro Médio</div>
                    <div class="text-h6 font-weight-black text-info">
                      ({{ baricentroX }}, {{ baricentroY }})
                    </div>
                    <div class="text-caption text-medium-emphasis">Coordenadas X / Y</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row dense class="text-center">
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Comprimento do Bloco</div>
                    <div class="text-h6 font-weight-bold text-secondary">
                      {{ comprimentoBloco }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Distância Gol a Ataque</div>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Largura do Bloco</div>
                    <div class="text-h6 font-weight-bold text-secondary">
                      {{ larguraBloco }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Amplitude Lateral</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <!-- Card de Triagem e Semáforo Coletivo de Risco de Lesão -->
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-3">
                <v-icon icon="mdi-shield-alert-outline" color="error" class="mr-2"></v-icon>
                Triagem Coletiva de Risco Neuromuscular
              </h3>

              <div class="d-flex align-center justify-space-between mb-3 text-center">
                <div class="pa-2 rounded-lg" style="background: rgba(16, 185, 129, 0.15); flex: 1; margin: 0 4px;">
                  <div class="text-h5 font-weight-black text-success">{{ semaforoColetivo.verde }}</div>
                  <div class="text-caption font-weight-bold text-success">Baixo Risco</div>
                </div>

                <div class="pa-2 rounded-lg" style="background: rgba(245, 158, 11, 0.15); flex: 1; margin: 0 4px;">
                  <div class="text-h5 font-weight-black text-warning">{{ semaforoColetivo.amarelo }}</div>
                  <div class="text-caption font-weight-bold text-warning">Atenção</div>
                </div>

                <div class="pa-2 rounded-lg" style="background: rgba(239, 68, 68, 0.15); flex: 1; margin: 0 4px;">
                  <div class="text-h5 font-weight-black text-error">{{ semaforoColetivo.vermelho }}</div>
                  <div class="text-caption font-weight-bold text-error">Alto Risco</div>
                </div>
              </div>

              <div class="text-caption text-medium-emphasis">
                Triagem baseada no Índice de Sobrecarga Excêntrica (ISE) e volume de desacelerações severas na musculatura posterior de coxa.
              </div>
            </v-card>

            <!-- Distribuição Coletiva por Zonas de Intensidade -->
            <v-card class="glass-card pa-4" elevation="0">
              <h3 class="text-subtitle-2 font-weight-bold mb-2">
                Distribuição Coletiva de Volume por Zonas (Z1 a Z4)
              </h3>
              <div class="segmented-bar mb-3" style="height: 14px;">
                <div class="seg-walk" :style="{ width: percentualZonaColetivo('distanciaAndando') + '%' }"></div>
                <div class="seg-jog" :style="{ width: percentualZonaColetivo('distanciaTrotando') + '%' }"></div>
                <div class="seg-run" :style="{ width: percentualZonaColetivo('distanciaCorrendo') + '%' }"></div>
                <div class="seg-sprint" :style="{ width: percentualZonaColetivo('distanciaSprint') + '%' }"></div>
              </div>

              <div class="d-flex flex-column gap-1 text-caption text-medium-emphasis">
                <div class="d-flex justify-space-between">
                  <span><span class="zone-badge zone-walk mr-1"></span> Z1 Caminhada (&lt; 7.2 km/h):</span>
                  <strong>{{ percentualZonaColetivo('distanciaAndando').toFixed(1) }}%</strong>
                </div>
                <div class="d-flex justify-space-between">
                  <span><span class="zone-badge zone-jog mr-1"></span> Z2 Trote (7.2 a 14.4 km/h):</span>
                  <strong>{{ percentualZonaColetivo('distanciaTrotando').toFixed(1) }}%</strong>
                </div>
                <div class="d-flex justify-space-between">
                  <span><span class="zone-badge zone-run mr-1"></span> Z3 Corrida (14.4 a 19.8 km/h):</span>
                  <strong>{{ percentualZonaColetivo('distanciaCorrendo').toFixed(1) }}%</strong>
                </div>
                <div class="d-flex justify-space-between">
                  <span><span class="zone-badge zone-sprint mr-1"></span> Z4 Sprints (&gt; 19.8 km/h):</span>
                  <strong class="text-error">{{ percentualZonaColetivo('distanciaSprint').toFixed(1) }}%</strong>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 4. TABELA GERAL DO ELENCO NA PARTIDA -->
        <v-card class="glass-card mb-4" elevation="0">
          <v-card-title class="pa-4 d-flex flex-wrap align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-group" color="primary" class="mr-2"></v-icon>
              <span>Elenco em Campo &middot; Relatório Físico-Cinemático</span>
            </div>
            <v-text-field
              v-model="filtroAtletasTime"
              placeholder="Buscar por ID ou Posição..."
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
                <th class="text-left font-weight-bold">Atleta & Posição</th>
                <th class="text-left font-weight-bold">Distância Total</th>
                <th class="text-left font-weight-bold">Ritmo (m/min)</th>
                <th class="text-left font-weight-bold">Vel. Máx / Média</th>
                <th class="text-left font-weight-bold">Arrancadas / Frenagens</th>
                <th class="text-left font-weight-bold">Sprints (> 19.8 km/h)</th>
                <th class="text-left font-weight-bold">Risco Excêntrico</th>
                <th class="text-center font-weight-bold">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="atleta in atletasTimeFiltrados"
                :key="'squad-' + atleta.id"
              >
                <td>
                  <div class="d-flex align-center py-2">
                    <v-avatar color="surface-variant" size="36" class="mr-3 font-weight-black">
                      #{{ atleta.id }}
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">Jogador {{ atleta.id }}</div>
                      <div class="text-caption text-primary">{{ atleta.posicaoSugerida }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="font-weight-bold">{{ (atleta.distanciaTotal).toFixed(0) }} m</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ (atleta.distanciaTotal / 1000).toFixed(2) }} km
                  </div>
                </td>
                <td>
                  <v-chip
                    size="small"
                    :color="atleta.metrosPorMinuto >= 120 ? 'error' : atleta.metrosPorMinuto >= 105 ? 'warning' : 'info'"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    {{ atleta.metrosPorMinuto ? atleta.metrosPorMinuto.toFixed(1) : '-' }} m/min
                  </v-chip>
                </td>
                <td>
                  <div class="font-weight-bold">{{ atleta.velocidadeMaxima.toFixed(1) }} km/h</div>
                  <div class="text-caption text-medium-emphasis">
                    Média: {{ atleta.velocidadeMedia ? atleta.velocidadeMedia.toFixed(1) : '-' }} km/h
                  </div>
                </td>
                <td>
                  <span class="text-success font-weight-bold">+{{ atleta.aceleracoesAltas || 0 }}</span>
                  <span class="text-medium-emphasis mx-1">/</span>
                  <span class="text-error font-weight-bold">-{{ atleta.desaceleracoesAltas || 0 }}</span>
                </td>
                <td>
                  <div class="font-weight-bold text-error">{{ atleta.sprintsContagem || 0 }} tiros</div>
                  <div class="text-caption text-medium-emphasis">{{ atleta.distanciaSprint?.toFixed(0) || 0 }} m</div>
                </td>
                <td>
                  <v-chip
                    size="small"
                    :color="obterDiagnosticoRisco(atleta).cor"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    ISE: {{ calcularISE(atleta) }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-btn
                    size="small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-account-search"
                    @click="abrirAtletaNoDashboard(atleta.id)"
                    class="font-weight-bold"
                  >
                    Análise Individual
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 4: DASHBOARD INDIVIDUAL DO ATLETA (MÁXIMO DE DADOS DO JOGADOR)     -->
      <!-- ========================================================================= -->
      <div v-else-if="menuAtivo === 'atleta'">
        <!-- Barra de Seleção de Atleta e Partida -->
        <v-card class="glass-card pa-4 mb-4" elevation="0">
          <div class="d-flex flex-wrap align-center justify-space-between gap-3">
            <div class="d-flex flex-wrap align-center gap-3">
              <!-- Seletor de Atleta Dropdown -->
              <div style="min-width: 240px;">
                <v-select
                  v-model="atletaAtivoId"
                  :items="atletasAtivos"
                  item-title="posicaoCompleta"
                  item-value="id"
                  label="Selecionar Jogador do Elenco"
                  density="compact"
                  variant="outlined"
                  color="secondary"
                  hide-details
                  prepend-inner-icon="mdi-account"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="'#' + item.raw.id + ' - ' + item.raw.posicaoSugerida">
                      <template v-slot:subtitle>
                        Distância: {{ (item.raw.distanciaTotal / 1000).toFixed(2) }} km | Vel: {{ item.raw.velocidadeMaxima }} km/h
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>

              <!-- Seletor de Partida -->
              <div style="min-width: 240px;">
                <v-select
                  v-model="partidaAtivaId"
                  :items="partidas"
                  item-title="nome"
                  item-value="id"
                  label="Partida"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  hide-details
                  prepend-inner-icon="mdi-calendar-clock"
                ></v-select>
              </div>
            </div>

            <!-- Chips Rápidos dos 11 Atletas (Atalho visual por número da camisa) -->
            <div class="d-flex flex-wrap align-center gap-1">
              <v-chip
                v-for="a in atletasAtivos"
                :key="'chip-sel-' + a.id"
                size="small"
                :color="String(a.id) === String(atletaAtivoId) ? 'primary' : 'surface-variant'"
                variant="flat"
                class="font-weight-bold"
                @click="atletaAtivoId = a.id"
              >
                #{{ a.id }}
              </v-chip>
            </div>
          </div>
        </v-card>

        <!-- Card de Apresentação do Jogador Selecionado -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="atletaAtivo">
          <div class="d-flex flex-wrap align-center justify-space-between gap-3">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="56" class="mr-4 font-weight-black text-h5">
                #{{ atletaAtivo.id }}
              </v-avatar>
              <div>
                <div class="d-flex align-center gap-2">
                  <h2 class="text-h5 font-weight-bold">Jogador #{{ atletaAtivo.id }}</h2>
                  <v-chip size="small" color="secondary" variant="flat" class="font-weight-bold">
                    {{ atletaAtivo.posicaoSugerida }}
                  </v-chip>
                  <v-chip
                    size="small"
                    :color="diagnosticoRiscoAtleta.cor"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    Risco: {{ diagnosticoRiscoAtleta.nivel }}
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ partidaAtiva.nome }} &middot; Minutos Jogados: {{ (atletaAtivo.tempoTotalSegundos / 60).toFixed(0) }} min &middot; Centroide Médio: X={{ atletaAtivo.centroideX }}m, Y={{ atletaAtivo.centroideY }}m
                </div>
              </div>
            </div>

            <!-- Rápido Resumo de Intensidade -->
            <div class="d-flex gap-2">
              <v-chip size="small" color="info" variant="flat">
                Ritmo: {{ atletaAtivo.metrosPorMinuto?.toFixed(1) }} m/min
              </v-chip>
              <v-chip size="small" color="warning" variant="flat">
                Sprint Máx: {{ atletaAtivo.velocidadeMaxima?.toFixed(1) }} km/h
              </v-chip>
            </div>
          </div>
        </v-card>

        <!-- 1. KPIS FÍSICOS DO JOGADOR -->
        <v-row class="mb-4" v-if="atletaAtivo">
          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Distância Total</div>
                <div class="text-h5 font-weight-black mt-1 text-primary">
                  {{ (atletaAtivo.distanciaTotal).toFixed(0) }} m
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ (atletaAtivo.distanciaTotal / 1000).toFixed(2) }} km
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Ritmo de Jogo</div>
                <div class="text-h5 font-weight-black mt-1 text-info">
                  {{ atletaAtivo.metrosPorMinuto?.toFixed(1) }}
                </div>
                <div class="text-caption text-medium-emphasis">m/minuto</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Vel. Máxima</div>
                <div class="text-h5 font-weight-black mt-1 text-warning">
                  {{ atletaAtivo.velocidadeMaxima?.toFixed(1) }}
                </div>
                <div class="text-caption text-medium-emphasis">km/h (Sprint)</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Vel. Média</div>
                <div class="text-h5 font-weight-black mt-1 text-success">
                  {{ atletaAtivo.velocidadeMedia?.toFixed(1) }}
                </div>
                <div class="text-caption text-medium-emphasis">km/h</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Player Load</div>
                <div class="text-h5 font-weight-black mt-1 text-secondary">
                  {{ atletaAtivo.playerLoad?.toFixed(0) }}
                </div>
                <div class="text-caption text-medium-emphasis">U.A. (Carga Mecânica)</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis font-weight-bold">Tiros de Sprint</div>
                <div class="text-h5 font-weight-black mt-1 text-error">
                  {{ atletaAtivo.sprintsContagem || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ atletaAtivo.distanciaSprint?.toFixed(0) || 0 }} m em sprint
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- 2. MÓDULO EXCLUSIVO DE RISCO DE LESÃO MUSCULAR & BIOMECÂNICA -->
        <v-row class="mb-4" v-if="atletaAtivo">
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-shield-alert" color="error" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">
                    Índice de Sobrecarga Excêntrica (ISE) & Risco de Isquiotibiais
                  </h3>
                </div>
                <v-chip :color="diagnosticoRiscoAtleta.cor" variant="flat" size="small" class="font-weight-bold">
                  {{ diagnosticoRiscoAtleta.nivel }}
                </v-chip>
              </div>

              <!-- Termômetro de Risco ISE -->
              <div class="mb-3">
                <div class="d-flex justify-space-between text-caption mb-1">
                  <span>Score ISE: <strong>{{ indiceISE }}</strong> (Ponderado por minuto)</span>
                  <span>Limiar Crítico: > 0.95</span>
                </div>
                <v-progress-linear
                  :model-value="Math.min(100, (indiceISE / 1.5) * 100)"
                  :color="diagnosticoRiscoAtleta.cor"
                  height="10"
                  rounded
                ></v-progress-linear>
              </div>

              <!-- Métricas de Arrancadas vs Frenagens Severas -->
              <v-row dense class="text-center mb-3">
                <v-col cols="4">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Acelerações (> 2.5)</div>
                    <div class="text-h6 font-weight-black text-success">
                      +{{ atletaAtivo.aceleracoesAltas || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Pico: +{{ atletaAtivo.aceleracaoMaxima?.toFixed(1) }} m/s²</div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Frenagens (< -2.5)</div>
                    <div class="text-h6 font-weight-black text-error">
                      -{{ atletaAtivo.desaceleracoesAltas || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Severas (< -3.0): {{ atletaAtivo.desaceleracoesCriticas || 0 }}</div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Razão A/D</div>
                    <div class="text-h6 font-weight-black text-info">
                      {{ razaoAD }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Equilíbrio Mecânico</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Parecer Clínico para a Comissão Técnica -->
              <v-alert
                :type="diagnosticoRiscoAtleta.cor === 'error' ? 'error' : diagnosticoRiscoAtleta.cor === 'warning' ? 'warning' : 'success'"
                variant="tonal"
                density="compact"
                class="mb-0"
              >
                <div class="text-caption">
                  <strong>Diagnóstico Clínico:</strong> {{ diagnosticoRiscoAtleta.descricao }}
                </div>
                <div class="text-caption font-weight-bold mt-1 text-primary">
                  Conduta para a Comissão Técnica: {{ diagnosticoRiscoAtleta.conduta }}
                </div>
              </v-alert>
            </v-card>
          </v-col>

          <!-- Potência Metabólica e Zonas de Velocidade do Jogador -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-fire" color="warning" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">
                    Potência Metabólica (Di Prampero & Osgnach) & Zonas
                  </h3>
                </div>
              </div>

              <v-row dense class="text-center mb-3">
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Potência Metabólica Média</div>
                    <div class="text-h6 font-weight-black text-warning">
                      {{ atletaAtivo.potenciaMetabolicaMedia?.toFixed(1) || 0 }} W/kg
                    </div>
                    <div class="text-caption text-medium-emphasis">Custo Energético</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Distância HPMD (> 20 W/kg)</div>
                    <div class="text-h6 font-weight-black text-secondary">
                      {{ atletaAtivo.distanciaAltaPotenciaMetabolica?.toFixed(0) || 0 }} m
                    </div>
                    <div class="text-caption text-medium-emphasis">Demanda Anaeróbia</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Barra Segmentada de Zonas de Velocidade -->
              <div class="text-caption text-medium-emphasis font-weight-bold mb-1">
                DISTRIBUIÇÃO DE VOLUME POR FAIXA DE VELOCIDADE
              </div>
              <div class="segmented-bar mb-3" style="height: 14px;">
                <div class="seg-walk" :style="{ width: percentualZona(atletaAtivo, 'distanciaAndando') + '%' }"></div>
                <div class="seg-jog" :style="{ width: percentualZona(atletaAtivo, 'distanciaTrotando') + '%' }"></div>
                <div class="seg-run" :style="{ width: percentualZona(atletaAtivo, 'distanciaCorrendo') + '%' }"></div>
                <div class="seg-sprint" :style="{ width: percentualZona(atletaAtivo, 'distanciaSprint') + '%' }"></div>
              </div>

              <v-row dense class="text-caption">
                <v-col cols="3">
                  <div class="border pa-1 rounded text-center">
                    <span class="zone-badge zone-walk mr-1"></span>
                    <strong>Z1: {{ atletaAtivo.distanciaAndando?.toFixed(0) }}m</strong>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="border pa-1 rounded text-center">
                    <span class="zone-badge zone-jog mr-1"></span>
                    <strong>Z2: {{ atletaAtivo.distanciaTrotando?.toFixed(0) }}m</strong>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="border pa-1 rounded text-center">
                    <span class="zone-badge zone-run mr-1"></span>
                    <strong>Z3: {{ atletaAtivo.distanciaCorrendo?.toFixed(0) }}m</strong>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="border pa-1 rounded text-center">
                    <span class="zone-badge zone-sprint mr-1"></span>
                    <strong class="text-error">Z4: {{ atletaAtivo.distanciaSprint?.toFixed(0) }}m</strong>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- 3. PRANCHETA INDIVIDUAL & RADAR VS MÉDIA DO TIME -->
        <v-row class="mb-4" v-if="atletaAtivo">
          <!-- Campo Tático Individual -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-soccer-field" color="primary" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">
                    Prancheta Tática & Raio de Ação Espacial
                  </h3>
                </div>
                <div class="text-caption text-medium-emphasis">
                  Centroide: ({{ atletaAtivo.centroideX }}m, {{ atletaAtivo.centroideY }}m)
                </div>
              </div>

              <div class="pitch-container pa-2">
                <svg
                  viewBox="0 0 1050 680"
                  class="soccer-pitch"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="pitch-stripes-solo" width="105" height="680" patternUnits="userSpaceOnUse">
                      <rect x="0" width="52.5" height="680" fill="#133826" />
                      <rect x="52.5" width="52.5" height="680" fill="#0f2f1f" />
                    </pattern>
                  </defs>
                  <rect width="1050" height="680" fill="url(#pitch-stripes-solo)" rx="12" />

                  <!-- Linhas Regulamentares -->
                  <rect x="40" y="40" width="970" height="600" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <line x1="525" y1="40" x2="525" y2="640" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <circle cx="525" cy="340" r="91.5" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />

                  <rect x="40" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />
                  <rect x="845" y="160" width="165" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="4" />

                  <!-- Amostras de Trilha -->
                  <g opacity="0.65">
                    <circle
                      v-for="(pt, idx) in atletaAtivo.amostrasPosicao"
                      :key="'pt-solo-' + idx"
                      :cx="pt.x * 10"
                      :cy="pt.y * 10"
                      r="8"
                      fill="#10b981"
                      opacity="0.4"
                    />
                  </g>

                  <!-- Raio de Ação Tático -->
                  <circle
                    :cx="atletaAtivo.centroideX * 10"
                    :cy="atletaAtivo.centroideY * 10"
                    :r="Math.max(45, (atletaAtivo.raioAcao || 18) * 10)"
                    fill="rgba(16, 185, 129, 0.18)"
                    stroke="#10b981"
                    stroke-width="2"
                    stroke-dasharray="6,4"
                  />

                  <!-- Marcador do Jogador -->
                  <g :transform="'translate(' + (atletaAtivo.centroideX * 10) + ',' + (atletaAtivo.centroideY * 10) + ')'">
                    <circle r="22" fill="#ef4444" stroke="#ffffff" stroke-width="3" />
                    <text
                      x="0"
                      y="7"
                      text-anchor="middle"
                      fill="#ffffff"
                      font-size="16"
                      font-weight="bold"
                    >
                      {{ atletaAtivo.id }}
                    </text>
                  </g>
                </svg>
              </div>

              <div class="d-flex justify-space-between mt-2 text-caption text-medium-emphasis">
                <span>&bull; Marcador Vermelho: Posição Média</span>
                <span>&bull; Círculo Pontilhado: Raio de Ação (&plusmn;{{ atletaAtivo.raioAcao }}m)</span>
              </div>
            </v-card>
          </v-col>

          <!-- Radar Físico vs Média do Time -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-radar" color="secondary" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">
                    Radar Físico: Atleta #{{ atletaAtivo.id }} vs Média do Elenco
                  </h3>
                </div>
              </div>

              <div class="d-flex align-center justify-center">
                <svg viewBox="0 0 400 400" class="radar-svg">
                  <!-- Grades Poligonais -->
                  <polygon
                    v-for="nivel in [0.2, 0.4, 0.6, 0.8, 1.0]"
                    :key="'grid-r-' + nivel"
                    :points="gerarPoligonoGrid(nivel)"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    stroke-width="1.5"
                  />

                  <!-- Eixos -->
                  <line
                    v-for="(eixo, i) in eixosRadar"
                    :key="'axis-r-' + i"
                    x1="200"
                    y1="200"
                    :x2="calcularCoordenadaRadar(i, 1.0).x"
                    :y2="calcularCoordenadaRadar(i, 1.0).y"
                    stroke="rgba(255,255,255,0.15)"
                    stroke-width="1"
                  />

                  <!-- Média da Equipe (Azul) -->
                  <polygon
                    :points="gerarPontosRadar(dadosRadarTime)"
                    fill="rgba(56, 189, 248, 0.22)"
                    stroke="#38bdf8"
                    stroke-width="2"
                  />

                  <!-- Atleta Selecionado (Verde) -->
                  <polygon
                    :points="gerarPontosRadar(dadosRadarAtleta)"
                    fill="rgba(16, 185, 129, 0.45)"
                    stroke="#10b981"
                    stroke-width="3"
                  />

                  <!-- Vértices -->
                  <circle
                    v-for="(val, i) in dadosRadarAtleta"
                    :key="'vert-r-' + i"
                    :cx="calcularCoordenadaRadar(i, val).x"
                    :cy="calcularCoordenadaRadar(i, val).y"
                    r="5"
                    fill="#10b981"
                    stroke="#ffffff"
                    stroke-width="1.5"
                  />

                  <!-- Rótulos -->
                  <text
                    v-for="(eixo, i) in eixosRadar"
                    :key="'label-r-' + i"
                    :x="calcularCoordenadaRadar(i, 1.20).x"
                    :y="calcularCoordenadaRadar(i, 1.20).y + 4"
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
                  <span style="display:inline-block; width:12px; height:12px; background:#10b981; border-radius:3px;" class="mr-2"></span>
                  <span class="text-caption font-weight-bold">Atleta #{{ atletaAtivo.id }}</span>
                </div>
                <div class="d-flex align-center ml-4">
                  <span style="display:inline-block; width:12px; height:12px; background:#38bdf8; border-radius:3px;" class="mr-2"></span>
                  <span class="text-caption font-weight-bold">Média do Time</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 4. FISIOLOGIA & ESCALA DE BORG CR-10 (MÉTODO FOSTER) -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="atletaAtivo">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-heart-pulse" color="error" class="mr-2"></v-icon>
              <h3 class="text-subtitle-1 font-weight-bold">
                Integração Fisiológica: Carga Externa (Tracking) × Carga Interna (Escala de Borg CR-10)
              </h3>
            </div>
          </div>

          <!-- Fundamentação Científica da Metodologia Foster -->
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
            icon="mdi-calculator-variant"
          >
            <div class="text-caption">
              <strong>Fundamentação Teórica (Método de Foster, 1998):</strong>
              A Carga Interna da Sessão é calculada como <code>Carga (U.A.) = PSE (Escala de Borg CR-10) &times; Duração da Sessão (minutos)</code>. Representa o estresse psicofisiológico suportado pelo organismo.
            </div>
          </v-alert>

          <v-row>
            <v-col cols="12" md="6">
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
                class="mb-2"
              ></v-slider>

              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="duracaoSessaoMinutos"
                    label="Duração da Partida (min)"
                    type="number"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Carga da Sessão (Foster)</div>
                    <div class="text-h6 font-weight-bold text-secondary">
                      {{ valorBorg * duracaoSessaoMinutos }} <span class="text-caption">U.A.</span>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Índices de Eficiência e Diagnóstico Fisiológico -->
            <v-col cols="12" md="6">
              <v-row dense class="mb-3">
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">HSR / Borg</div>
                    <div class="text-h6 font-weight-black text-primary">
                      {{ ((atletaAtivo.distanciaSprint || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Metros Sprint por ponto PSE</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface-variant" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Player Load / Borg</div>
                    <div class="text-h6 font-weight-black text-warning">
                      {{ ((atletaAtivo.playerLoad || 0) / Math.max(1, valorBorg)).toFixed(1) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Carga Mecânica por ponto PSE</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-alert
                :type="diagnosticoBorgAtleta.tipo"
                variant="tonal"
                class="mb-0"
              >
                <template v-slot:title>
                  <div class="font-weight-bold">{{ diagnosticoBorgAtleta.titulo }}</div>
                </template>
                <div class="text-body-2 mb-1">{{ diagnosticoBorgAtleta.mensagem }}</div>
                <div class="text-caption font-weight-bold text-primary">
                  Conduta: {{ diagnosticoBorgAtleta.recomendacao }}
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

// =========================================================================
// CONTROLE DE NAVEGAÇÃO & INTERFACE
// =========================================================================
const drawerAberto = ref(true)
const menuAtivo = ref('time') // 'dados' | 'partidas' | 'time' | 'atleta'
const partidaAtivaId = ref('1')
const atletaAtivoId = ref('7')

// Alertas
const mensagemAlerta = ref('')
const tipoAlerta = ref('info')
const carregando = ref(false)

// Inserção de Dados
const arquivoUpload = ref(null)
const nomeNovaPartida = ref('')
const urlDataset = ref('')

// Filtros
const filtroAtletasTime = ref('')

// Fisiologia Borg CR-10
const valorBorg = ref(6)
const duracaoSessaoMinutos = ref(90)

// =========================================================================
// BANCO DE DADOS DE PARTIDAS & ELENCO (3 CONFRONTOS COMPLETOS)
// =========================================================================
const partidas = ref([
  {
    id: '1',
    nome: 'Campeonato Oficial - Rodada 4 (vs Santos FC)',
    adversario: 'Santos FC',
    data: '07/09/2026',
    duracao: 90,
    placar: '2 x 1 (Vitória Mandante)',
    atletas: [
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
        playerLoad: 280.0,
        sprintsContagem: 2,
        potenciaMetabolicaMedia: 5.4,
        distanciaAltaPotenciaMetabolica: 320.0,
        centroideX: 12.5,
        centroideY: 34.0,
        raioAcao: 9.5,
        amostrasPosicao: [{ x: 12.0, y: 34.0 }, { x: 11.5, y: 32.0 }, { x: 13.0, y: 36.0 }, { x: 14.2, y: 33.5 }, { x: 10.8, y: 34.5 }]
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
        playerLoad: 760.0,
        sprintsContagem: 32,
        potenciaMetabolicaMedia: 11.8,
        distanciaAltaPotenciaMetabolica: 1850.0,
        centroideX: 55.0,
        centroideY: 58.0,
        raioAcao: 24.5,
        amostrasPosicao: [{ x: 35.0, y: 56.0 }, { x: 48.0, y: 59.0 }, { x: 65.0, y: 62.0 }, { x: 78.0, y: 60.0 }, { x: 42.0, y: 57.0 }]
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
        playerLoad: 580.0,
        sprintsContagem: 14,
        potenciaMetabolicaMedia: 9.1,
        distanciaAltaPotenciaMetabolica: 1120.0,
        centroideX: 32.0,
        centroideY: 26.0,
        raioAcao: 16.8,
        amostrasPosicao: [{ x: 26.0, y: 24.0 }, { x: 34.0, y: 27.0 }, { x: 38.0, y: 25.0 }, { x: 29.0, y: 28.0 }]
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
        playerLoad: 550.0,
        sprintsContagem: 10,
        potenciaMetabolicaMedia: 8.8,
        distanciaAltaPotenciaMetabolica: 980.0,
        centroideX: 33.0,
        centroideY: 42.0,
        raioAcao: 15.9,
        amostrasPosicao: [{ x: 28.0, y: 40.0 }, { x: 35.0, y: 44.0 }, { x: 39.0, y: 41.0 }, { x: 30.0, y: 43.0 }]
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
        playerLoad: 720.0,
        sprintsContagem: 26,
        potenciaMetabolicaMedia: 11.2,
        distanciaAltaPotenciaMetabolica: 1680.0,
        centroideX: 52.0,
        centroideY: 12.0,
        raioAcao: 23.8,
        amostrasPosicao: [{ x: 34.0, y: 11.0 }, { x: 49.0, y: 13.0 }, { x: 67.0, y: 10.0 }, { x: 75.0, y: 14.0 }]
      },
      {
        id: '5',
        posicaoSugerida: 'Primeiro Volante',
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
        playerLoad: 840.0,
        sprintsContagem: 22,
        potenciaMetabolicaMedia: 12.4,
        distanciaAltaPotenciaMetabolica: 2100.0,
        centroideX: 48.0,
        centroideY: 34.0,
        raioAcao: 21.0,
        amostrasPosicao: [{ x: 42.0, y: 30.0 }, { x: 50.0, y: 38.0 }, { x: 55.0, y: 33.0 }, { x: 45.0, y: 36.0 }]
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
        playerLoad: 870.0,
        sprintsContagem: 27,
        potenciaMetabolicaMedia: 12.7,
        distanciaAltaPotenciaMetabolica: 2240.0,
        centroideX: 56.0,
        centroideY: 36.0,
        raioAcao: 22.4,
        amostrasPosicao: [{ x: 46.0, y: 32.0 }, { x: 58.0, y: 40.0 }, { x: 66.0, y: 35.0 }, { x: 52.0, y: 38.0 }]
      },
      {
        id: '10',
        posicaoSugerida: 'Meia Ofensivo / Armador',
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
        playerLoad: 690.0,
        sprintsContagem: 20,
        potenciaMetabolicaMedia: 10.6,
        distanciaAltaPotenciaMetabolica: 1540.0,
        centroideX: 62.0,
        centroideY: 32.0,
        raioAcao: 19.5,
        amostrasPosicao: [{ x: 54.0, y: 28.0 }, { x: 64.0, y: 35.0 }, { x: 72.0, y: 30.0 }, { x: 60.0, y: 34.0 }]
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
        playerLoad: 810.0,
        sprintsContagem: 36,
        potenciaMetabolicaMedia: 12.3,
        distanciaAltaPotenciaMetabolica: 2080.0,
        centroideX: 68.0,
        centroideY: 55.0,
        raioAcao: 24.2,
        amostrasPosicao: [{ x: 55.0, y: 52.0 }, { x: 72.0, y: 58.0 }, { x: 88.0, y: 56.0 }, { x: 64.0, y: 54.0 }]
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
        playerLoad: 780.0,
        sprintsContagem: 31,
        potenciaMetabolicaMedia: 11.9,
        distanciaAltaPotenciaMetabolica: 1920.0,
        centroideX: 66.0,
        centroideY: 15.0,
        raioAcao: 23.5,
        amostrasPosicao: [{ x: 52.0, y: 14.0 }, { x: 70.0, y: 12.0 }, { x: 85.0, y: 16.0 }, { x: 62.0, y: 13.0 }]
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
        playerLoad: 690.0,
        sprintsContagem: 28,
        potenciaMetabolicaMedia: 10.8,
        distanciaAltaPotenciaMetabolica: 1680.0,
        centroideX: 74.0,
        centroideY: 34.0,
        raioAcao: 18.2,
        amostrasPosicao: [{ x: 62.0, y: 31.0 }, { x: 75.0, y: 35.0 }, { x: 88.0, y: 33.0 }, { x: 70.0, y: 37.0 }]
      }
    ]
  },
  {
    id: '2',
    nome: 'Campeonato Oficial - Rodada 8 (vs SE Palmeiras)',
    adversario: 'SE Palmeiras',
    data: '30/08/2026',
    duracao: 90,
    placar: '1 x 1 (Empate Visitante)',
    atletas: [
      {
        id: '1',
        posicaoSugerida: 'Goleiro',
        distanciaTotal: 4920.0,
        velocidadeMaxima: 23.8,
        velocidadeMedia: 3.3,
        metrosPorMinuto: 54.6,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3900.0,
        distanciaTrotando: 830.0,
        distanciaCorrendo: 170.0,
        distanciaSprint: 20.0,
        aceleracoesAltas: 7,
        aceleracoesExplosivas: 2,
        desaceleracoesAltas: 8,
        desaceleracoesCriticas: 2,
        playerLoad: 275.0,
        sprintsContagem: 2,
        potenciaMetabolicaMedia: 5.2,
        distanciaAltaPotenciaMetabolica: 300.0,
        centroideX: 13.0,
        centroideY: 34.0,
        raioAcao: 9.8,
        amostrasPosicao: [{ x: 13.0, y: 34.0 }, { x: 12.0, y: 31.0 }, { x: 14.0, y: 35.0 }]
      },
      {
        id: '2',
        posicaoSugerida: 'Lateral Direito',
        distanciaTotal: 11100.0,
        velocidadeMaxima: 34.2,
        velocidadeMedia: 7.4,
        metrosPorMinuto: 123.3,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3600.0,
        distanciaTrotando: 4500.0,
        distanciaCorrendo: 2100.0,
        distanciaSprint: 900.0,
        aceleracoesAltas: 52,
        aceleracoesExplosivas: 22,
        desaceleracoesAltas: 58,
        desaceleracoesCriticas: 26,
        playerLoad: 805.0,
        sprintsContagem: 35,
        potenciaMetabolicaMedia: 12.2,
        distanciaAltaPotenciaMetabolica: 1980.0,
        centroideX: 53.0,
        centroideY: 59.0,
        raioAcao: 25.0,
        amostrasPosicao: [{ x: 38.0, y: 58.0 }, { x: 50.0, y: 60.0 }, { x: 68.0, y: 61.0 }]
      },
      {
        id: '3',
        posicaoSugerida: 'Zagueiro Central',
        distanciaTotal: 9800.0,
        velocidadeMaxima: 30.1,
        velocidadeMedia: 6.5,
        metrosPorMinuto: 108.8,
        tempoTotalSegundos: 5400,
        distanciaAndando: 4100.0,
        distanciaTrotando: 4000.0,
        distanciaCorrendo: 1350.0,
        distanciaSprint: 350.0,
        aceleracoesAltas: 32,
        aceleracoesExplosivas: 12,
        desaceleracoesAltas: 38,
        desaceleracoesCriticas: 16,
        playerLoad: 610.0,
        sprintsContagem: 16,
        potenciaMetabolicaMedia: 9.4,
        distanciaAltaPotenciaMetabolica: 1190.0,
        centroideX: 30.0,
        centroideY: 25.0,
        raioAcao: 17.5,
        amostrasPosicao: [{ x: 25.0, y: 23.0 }, { x: 32.0, y: 26.0 }, { x: 36.0, y: 24.0 }]
      },
      {
        id: '4',
        posicaoSugerida: 'Zagueiro Central',
        distanciaTotal: 9550.0,
        velocidadeMaxima: 29.2,
        velocidadeMedia: 6.3,
        metrosPorMinuto: 106.1,
        tempoTotalSegundos: 5400,
        distanciaAndando: 4200.0,
        distanciaTrotando: 3850.0,
        distanciaCorrendo: 1250.0,
        distanciaSprint: 250.0,
        aceleracoesAltas: 27,
        aceleracoesExplosivas: 9,
        desaceleracoesAltas: 33,
        desaceleracoesCriticas: 13,
        playerLoad: 570.0,
        sprintsContagem: 12,
        potenciaMetabolicaMedia: 9.0,
        distanciaAltaPotenciaMetabolica: 1040.0,
        centroideX: 31.0,
        centroideY: 43.0,
        raioAcao: 16.5,
        amostrasPosicao: [{ x: 26.0, y: 41.0 }, { x: 33.0, y: 45.0 }, { x: 37.0, y: 42.0 }]
      },
      {
        id: '6',
        posicaoSugerida: 'Lateral Esquerdo',
        distanciaTotal: 10800.0,
        velocidadeMaxima: 33.0,
        velocidadeMedia: 7.2,
        metrosPorMinuto: 120.0,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3700.0,
        distanciaTrotando: 4450.0,
        distanciaCorrendo: 1900.0,
        distanciaSprint: 750.0,
        aceleracoesAltas: 47,
        aceleracoesExplosivas: 18,
        desaceleracoesAltas: 53,
        desaceleracoesCriticas: 21,
        playerLoad: 750.0,
        sprintsContagem: 29,
        potenciaMetabolicaMedia: 11.5,
        distanciaAltaPotenciaMetabolica: 1760.0,
        centroideX: 50.0,
        centroideY: 11.0,
        raioAcao: 24.5,
        amostrasPosicao: [{ x: 32.0, y: 10.0 }, { x: 47.0, y: 12.0 }, { x: 65.0, y: 9.0 }]
      },
      {
        id: '5',
        posicaoSugerida: 'Primeiro Volante',
        distanciaTotal: 11600.0,
        velocidadeMaxima: 30.8,
        velocidadeMedia: 7.7,
        metrosPorMinuto: 128.8,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3350.0,
        distanciaTrotando: 5200.0,
        distanciaCorrendo: 2500.0,
        distanciaSprint: 550.0,
        aceleracoesAltas: 57,
        aceleracoesExplosivas: 23,
        desaceleracoesAltas: 61,
        desaceleracoesCriticas: 26,
        playerLoad: 865.0,
        sprintsContagem: 24,
        potenciaMetabolicaMedia: 12.6,
        distanciaAltaPotenciaMetabolica: 2180.0,
        centroideX: 46.0,
        centroideY: 34.0,
        raioAcao: 21.5,
        amostrasPosicao: [{ x: 40.0, y: 31.0 }, { x: 48.0, y: 37.0 }, { x: 53.0, y: 32.0 }]
      },
      {
        id: '8',
        posicaoSugerida: 'Meio-Campista Central',
        distanciaTotal: 11900.0,
        velocidadeMaxima: 32.0,
        velocidadeMedia: 7.9,
        metrosPorMinuto: 132.2,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3200.0,
        distanciaTrotando: 5350.0,
        distanciaCorrendo: 2650.0,
        distanciaSprint: 700.0,
        aceleracoesAltas: 62,
        aceleracoesExplosivas: 24,
        desaceleracoesAltas: 66,
        desaceleracoesCriticas: 28,
        playerLoad: 895.0,
        sprintsContagem: 30,
        potenciaMetabolicaMedia: 13.0,
        distanciaAltaPotenciaMetabolica: 2350.0,
        centroideX: 54.0,
        centroideY: 36.0,
        raioAcao: 23.0,
        amostrasPosicao: [{ x: 44.0, y: 33.0 }, { x: 56.0, y: 39.0 }, { x: 64.0, y: 34.0 }]
      },
      {
        id: '10',
        posicaoSugerida: 'Meia Ofensivo / Armador',
        distanciaTotal: 10450.0,
        velocidadeMaxima: 31.5,
        velocidadeMedia: 6.9,
        metrosPorMinuto: 116.1,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3800.0,
        distanciaTrotando: 4350.0,
        distanciaCorrendo: 1750.0,
        distanciaSprint: 550.0,
        aceleracoesAltas: 45,
        aceleracoesExplosivas: 20,
        desaceleracoesAltas: 48,
        desaceleracoesCriticas: 20,
        playerLoad: 715.0,
        sprintsContagem: 23,
        potenciaMetabolicaMedia: 10.9,
        distanciaAltaPotenciaMetabolica: 1620.0,
        centroideX: 60.0,
        centroideY: 33.0,
        raioAcao: 20.0,
        amostrasPosicao: [{ x: 52.0, y: 29.0 }, { x: 62.0, y: 36.0 }, { x: 70.0, y: 31.0 }]
      },
      {
        id: '7',
        posicaoSugerida: 'Ponta Direita',
        distanciaTotal: 11450.0,
        velocidadeMaxima: 35.2,
        velocidadeMedia: 7.6,
        metrosPorMinuto: 127.2,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3500.0,
        distanciaTrotando: 4700.0,
        distanciaCorrendo: 2300.0,
        distanciaSprint: 950.0,
        aceleracoesAltas: 56,
        aceleracoesExplosivas: 27,
        desaceleracoesAltas: 60,
        desaceleracoesCriticas: 28,
        playerLoad: 840.0,
        sprintsContagem: 39,
        potenciaMetabolicaMedia: 12.7,
        distanciaAltaPotenciaMetabolica: 2210.0,
        centroideX: 66.0,
        centroideY: 56.0,
        raioAcao: 25.0,
        amostrasPosicao: [{ x: 53.0, y: 53.0 }, { x: 70.0, y: 59.0 }, { x: 86.0, y: 57.0 }]
      },
      {
        id: '11',
        posicaoSugerida: 'Ponta Esquerda',
        distanciaTotal: 11200.0,
        velocidadeMaxima: 34.6,
        velocidadeMedia: 7.4,
        metrosPorMinuto: 124.4,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3650.0,
        distanciaTrotando: 4600.0,
        distanciaCorrendo: 2100.0,
        distanciaSprint: 850.0,
        aceleracoesAltas: 51,
        aceleracoesExplosivas: 23,
        desaceleracoesAltas: 54,
        desaceleracoesCriticas: 24,
        playerLoad: 805.0,
        sprintsContagem: 34,
        potenciaMetabolicaMedia: 12.2,
        distanciaAltaPotenciaMetabolica: 2040.0,
        centroideX: 64.0,
        centroideY: 14.0,
        raioAcao: 24.0,
        amostrasPosicao: [{ x: 50.0, y: 13.0 }, { x: 68.0, y: 11.0 }, { x: 83.0, y: 15.0 }]
      },
      {
        id: '9',
        posicaoSugerida: 'Centroavante',
        distanciaTotal: 10350.0,
        velocidadeMaxima: 33.9,
        velocidadeMedia: 6.9,
        metrosPorMinuto: 115.0,
        tempoTotalSegundos: 5400,
        distanciaAndando: 3850.0,
        distanciaTrotando: 3950.0,
        distanciaCorrendo: 1750.0,
        distanciaSprint: 800.0,
        aceleracoesAltas: 43,
        aceleracoesExplosivas: 21,
        desaceleracoesAltas: 48,
        desaceleracoesCriticas: 22,
        playerLoad: 720.0,
        sprintsContagem: 31,
        potenciaMetabolicaMedia: 11.2,
        distanciaAltaPotenciaMetabolica: 1780.0,
        centroideX: 72.0,
        centroideY: 34.0,
        raioAcao: 19.0,
        amostrasPosicao: [{ x: 60.0, y: 32.0 }, { x: 73.0, y: 36.0 }, { x: 86.0, y: 34.0 }]
      }
    ]
  },
  {
    id: '3',
    nome: 'Treino Tático Coletivo de Alta Intensidade',
    adversario: 'Equipe Reserva / Coletivo',
    data: '25/08/2026',
    duracao: 65,
    placar: 'Treino Tático Fechado',
    atletas: [
      {
        id: '1',
        posicaoSugerida: 'Goleiro',
        distanciaTotal: 3400.0,
        velocidadeMaxima: 22.5,
        velocidadeMedia: 3.1,
        metrosPorMinuto: 52.3,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2700.0,
        distanciaTrotando: 580.0,
        distanciaCorrendo: 110.0,
        distanciaSprint: 10.0,
        aceleracoesAltas: 5,
        aceleracoesExplosivas: 1,
        desaceleracoesAltas: 6,
        desaceleracoesCriticas: 1,
        playerLoad: 190.0,
        sprintsContagem: 1,
        potenciaMetabolicaMedia: 4.8,
        distanciaAltaPotenciaMetabolica: 210.0,
        centroideX: 12.0,
        centroideY: 34.0,
        raioAcao: 9.0,
        amostrasPosicao: [{ x: 12.0, y: 34.0 }]
      },
      {
        id: '2',
        posicaoSugerida: 'Lateral Direito',
        distanciaTotal: 7800.0,
        velocidadeMaxima: 32.5,
        velocidadeMedia: 7.2,
        metrosPorMinuto: 120.0,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2600.0,
        distanciaTrotando: 3200.0,
        distanciaCorrendo: 1450.0,
        distanciaSprint: 550.0,
        aceleracoesAltas: 34,
        aceleracoesExplosivas: 13,
        desaceleracoesAltas: 36,
        desaceleracoesCriticas: 14,
        playerLoad: 540.0,
        sprintsContagem: 20,
        potenciaMetabolicaMedia: 11.4,
        distanciaAltaPotenciaMetabolica: 1280.0,
        centroideX: 52.0,
        centroideY: 57.0,
        raioAcao: 22.0,
        amostrasPosicao: [{ x: 40.0, y: 55.0 }]
      },
      {
        id: '3',
        posicaoSugerida: 'Zagueiro Central',
        distanciaTotal: 6900.0,
        velocidadeMaxima: 28.5,
        velocidadeMedia: 6.3,
        metrosPorMinuto: 106.1,
        tempoTotalSegundos: 3900,
        distanciaAndando: 3000.0,
        distanciaTrotando: 2700.0,
        distanciaCorrendo: 1000.0,
        distanciaSprint: 200.0,
        aceleracoesAltas: 20,
        aceleracoesExplosivas: 7,
        desaceleracoesAltas: 24,
        desaceleracoesCriticas: 9,
        playerLoad: 410.0,
        sprintsContagem: 8,
        potenciaMetabolicaMedia: 8.9,
        distanciaAltaPotenciaMetabolica: 780.0,
        centroideX: 33.0,
        centroideY: 27.0,
        raioAcao: 15.0,
        amostrasPosicao: [{ x: 30.0, y: 25.0 }]
      },
      {
        id: '4',
        posicaoSugerida: 'Zagueiro Central',
        distanciaTotal: 6750.0,
        velocidadeMaxima: 27.8,
        velocidadeMedia: 6.2,
        metrosPorMinuto: 103.8,
        tempoTotalSegundos: 3900,
        distanciaAndando: 3100.0,
        distanciaTrotando: 2650.0,
        distanciaCorrendo: 850.0,
        distanciaSprint: 150.0,
        aceleracoesAltas: 18,
        aceleracoesExplosivas: 6,
        desaceleracoesAltas: 21,
        desaceleracoesCriticas: 8,
        playerLoad: 395.0,
        sprintsContagem: 6,
        potenciaMetabolicaMedia: 8.6,
        distanciaAltaPotenciaMetabolica: 690.0,
        centroideX: 34.0,
        centroideY: 41.0,
        raioAcao: 14.5,
        amostrasPosicao: [{ x: 32.0, y: 40.0 }]
      },
      {
        id: '6',
        posicaoSugerida: 'Lateral Esquerdo',
        distanciaTotal: 7600.0,
        velocidadeMaxima: 31.8,
        velocidadeMedia: 7.0,
        metrosPorMinuto: 116.9,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2700.0,
        distanciaTrotando: 3150.0,
        distanciaCorrendo: 1300.0,
        distanciaSprint: 450.0,
        aceleracoesAltas: 31,
        aceleracoesExplosivas: 11,
        desaceleracoesAltas: 34,
        desaceleracoesCriticas: 12,
        playerLoad: 510.0,
        sprintsContagem: 17,
        potenciaMetabolicaMedia: 10.9,
        distanciaAltaPotenciaMetabolica: 1150.0,
        centroideX: 51.0,
        centroideY: 13.0,
        raioAcao: 21.0,
        amostrasPosicao: [{ x: 42.0, y: 12.0 }]
      },
      {
        id: '5',
        posicaoSugerida: 'Primeiro Volante',
        distanciaTotal: 8200.0,
        velocidadeMaxima: 29.8,
        velocidadeMedia: 7.5,
        metrosPorMinuto: 126.1,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2400.0,
        distanciaTrotando: 3700.0,
        distanciaCorrendo: 1750.0,
        distanciaSprint: 350.0,
        aceleracoesAltas: 38,
        aceleracoesExplosivas: 14,
        desaceleracoesAltas: 41,
        desaceleracoesCriticas: 16,
        playerLoad: 595.0,
        sprintsContagem: 14,
        potenciaMetabolicaMedia: 12.1,
        distanciaAltaPotenciaMetabolica: 1450.0,
        centroideX: 47.0,
        centroideY: 34.0,
        raioAcao: 19.0,
        amostrasPosicao: [{ x: 45.0, y: 32.0 }]
      },
      {
        id: '8',
        posicaoSugerida: 'Meio-Campista Central',
        distanciaTotal: 8400.0,
        velocidadeMaxima: 30.8,
        velocidadeMedia: 7.7,
        metrosPorMinuto: 129.2,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2350.0,
        distanciaTrotando: 3800.0,
        distanciaCorrendo: 1800.0,
        distanciaSprint: 450.0,
        aceleracoesAltas: 41,
        aceleracoesExplosivas: 15,
        desaceleracoesAltas: 44,
        desaceleracoesCriticas: 18,
        playerLoad: 615.0,
        sprintsContagem: 18,
        potenciaMetabolicaMedia: 12.4,
        distanciaAltaPotenciaMetabolica: 1560.0,
        centroideX: 55.0,
        centroideY: 35.0,
        raioAcao: 20.0,
        amostrasPosicao: [{ x: 50.0, y: 34.0 }]
      },
      {
        id: '10',
        posicaoSugerida: 'Meia Ofensivo / Armador',
        distanciaTotal: 7300.0,
        velocidadeMaxima: 30.5,
        velocidadeMedia: 6.7,
        metrosPorMinuto: 112.3,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2800.0,
        distanciaTrotando: 3000.0,
        distanciaCorrendo: 1150.0,
        distanciaSprint: 350.0,
        aceleracoesAltas: 29,
        aceleracoesExplosivas: 12,
        desaceleracoesAltas: 32,
        desaceleracoesCriticas: 11,
        playerLoad: 485.0,
        sprintsContagem: 14,
        potenciaMetabolicaMedia: 10.4,
        distanciaAltaPotenciaMetabolica: 1080.0,
        centroideX: 61.0,
        centroideY: 33.0,
        raioAcao: 18.0,
        amostrasPosicao: [{ x: 58.0, y: 31.0 }]
      },
      {
        id: '7',
        posicaoSugerida: 'Ponta Direita',
        distanciaTotal: 8100.0,
        velocidadeMaxima: 34.0,
        velocidadeMedia: 7.4,
        metrosPorMinuto: 124.6,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2550.0,
        distanciaTrotando: 3350.0,
        distanciaCorrendo: 1600.0,
        distanciaSprint: 600.0,
        aceleracoesAltas: 36,
        aceleracoesExplosivas: 17,
        desaceleracoesAltas: 39,
        desaceleracoesCriticas: 17,
        playerLoad: 575.0,
        sprintsContagem: 24,
        potenciaMetabolicaMedia: 12.0,
        distanciaAltaPotenciaMetabolica: 1470.0,
        centroideX: 67.0,
        centroideY: 54.0,
        raioAcao: 22.5,
        amostrasPosicao: [{ x: 62.0, y: 52.0 }]
      },
      {
        id: '11',
        posicaoSugerida: 'Ponta Esquerda',
        distanciaTotal: 7900.0,
        velocidadeMaxima: 33.5,
        velocidadeMedia: 7.3,
        metrosPorMinuto: 121.5,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2650.0,
        distanciaTrotando: 3250.0,
        distanciaCorrendo: 1450.0,
        distanciaSprint: 550.0,
        aceleracoesAltas: 33,
        aceleracoesExplosivas: 15,
        desaceleracoesAltas: 36,
        desaceleracoesCriticas: 15,
        playerLoad: 555.0,
        sprintsContagem: 21,
        potenciaMetabolicaMedia: 11.6,
        distanciaAltaPotenciaMetabolica: 1350.0,
        centroideX: 65.0,
        centroideY: 16.0,
        raioAcao: 22.0,
        amostrasPosicao: [{ x: 60.0, y: 15.0 }]
      },
      {
        id: '9',
        posicaoSugerida: 'Centroavante',
        distanciaTotal: 7250.0,
        velocidadeMaxima: 32.8,
        velocidadeMedia: 6.7,
        metrosPorMinuto: 111.5,
        tempoTotalSegundos: 3900,
        distanciaAndando: 2800.0,
        distanciaTrotando: 2800.0,
        distanciaCorrendo: 1150.0,
        distanciaSprint: 500.0,
        aceleracoesAltas: 28,
        aceleracoesExplosivas: 13,
        desaceleracoesAltas: 31,
        desaceleracoesCriticas: 14,
        playerLoad: 495.0,
        sprintsContagem: 19,
        potenciaMetabolicaMedia: 10.5,
        distanciaAltaPotenciaMetabolica: 1180.0,
        centroideX: 73.0,
        centroideY: 34.0,
        raioAcao: 17.0,
        amostrasPosicao: [{ x: 68.0, y: 33.0 }]
      }
    ]
  }
])

// =========================================================================
// COMPUTEDS DA PARTIDA ATIVA & ELENCO
// =========================================================================
const partidaAtiva = computed(() => {
  return partidas.value.find(p => p.id === partidaAtivaId.value) || partidas.value[0]
})

const atletasAtivos = computed(() => {
  if (!partidaAtiva.value || !partidaAtiva.value.atletas) return []
  return partidaAtiva.value.atletas.map(a => ({
    ...a,
    posicaoCompleta: `#${a.id} - ${a.posicaoSugerida}`
  }))
})

const atletaAtivo = computed(() => {
  const achado = atletasAtivos.value.find(a => String(a.id) === String(atletaAtivoId.value))
  return achado || atletasAtivos.value[0] || null
})

// Títulos e Subtítulos da barra superior
const tituloSecaoAtiva = computed(() => {
  if (menuAtivo.value === 'dados') return 'Inserção & Gestão de Dados'
  if (menuAtivo.value === 'partidas') return 'Partidas & Histórico Comparativo'
  if (menuAtivo.value === 'time') return 'Dashboard Coletivo do Time'
  if (menuAtivo.value === 'atleta') return 'Dashboard Individual do Atleta'
  return 'Visão 90'
})

const subtituloSecaoAtiva = computed(() => {
  if (menuAtivo.value === 'dados') return 'Ingestão de arquivos CSV 25 Hz e repositórios remotos'
  if (menuAtivo.value === 'partidas') return 'Comparação longitudinal de carga física entre jogos'
  if (menuAtivo.value === 'time') return 'Métricas táticas, compacidade, baricentro e semáforo da equipe'
  if (menuAtivo.value === 'atleta') return 'Sobrecarga excêntrica, risco de lesão em isquiotibiais e Borg CR-10'
  return ''
})

// =========================================================================
// CÁLCULOS COLETIVOS DO TIME (DASHBOARD TIME)
// =========================================================================
const distanciaColetivaKm = computed(() => {
  const totalM = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
  return totalM / 1000
})

const mediaMetrosPorMinuto = computed(() => {
  if (!atletasAtivos.value.length) return 0
  const soma = atletasAtivos.value.reduce((acc, a) => acc + (a.metrosPorMinuto || 0), 0)
  return soma / atletasAtivos.value.length
})

const maiorVelocidade = computed(() => {
  if (!atletasAtivos.value.length) return 0
  return Math.max(...atletasAtivos.value.map(a => a.velocidadeMaxima || 0))
})

const atletaMaisRapido = computed(() => {
  if (!atletasAtivos.value.length) return null
  return [...atletasAtivos.value].sort((a, b) => b.velocidadeMaxima - a.velocidadeMaxima)[0]
})

const totalAceleracoesAltas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.aceleracoesAltas || 0), 0)
})

const totalAceleracoesExplosivas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.aceleracoesExplosivas || 0), 0)
})

const totalDesaceleracoesAltas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.desaceleracoesAltas || 0), 0)
})

const totalDesaceleracoesCriticas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.desaceleracoesCriticas || 0), 0)
})

const totalHpmdM = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaAltaPotenciaMetabolica || 0), 0)
})

// Métricas Táticas Coletivas (Baricentro & Compacidade)
const baricentroX = computed(() => {
  if (!atletasAtivos.value.length) return '52.5'
  return (atletasAtivos.value.reduce((acc, a) => acc + (a.centroideX || 52.5), 0) / atletasAtivos.value.length).toFixed(1)
})

const baricentroY = computed(() => {
  if (!atletasAtivos.value.length) return '34.0'
  return (atletasAtivos.value.reduce((acc, a) => acc + (a.centroideY || 34.0), 0) / atletasAtivos.value.length).toFixed(1)
})

const compacidadeMetros = computed(() => {
  if (!atletasAtivos.value.length) return '0.0'
  const bx = parseFloat(baricentroX.value)
  const by = parseFloat(baricentroY.value)
  const somaDist = atletasAtivos.value.reduce((acc, a) => {
    const dx = (a.centroideX || bx) - bx
    const dy = (a.centroideY || by) - by
    return acc + Math.sqrt(dx * dx + dy * dy)
  }, 0)
  return (somaDist / atletasAtivos.value.length).toFixed(1)
})

const comprimentoBloco = computed(() => {
  if (!atletasAtivos.value.length) return '0.0'
  const xs = atletasAtivos.value.map(a => a.centroideX || 52.5)
  return (Math.max(...xs) - Math.min(...xs)).toFixed(1)
})

const larguraBloco = computed(() => {
  if (!atletasAtivos.value.length) return '0.0'
  const ys = atletasAtivos.value.map(a => a.centroideY || 34.0)
  return (Math.max(...ys) - Math.min(...ys)).toFixed(1)
})

// Semáforo Coletivo
const semaforoColetivo = computed(() => {
  let verde = 0, amarelo = 0, vermelho = 0
  atletasAtivos.value.forEach(a => {
    const ise = calcularISE(a)
    if (ise < 0.60) verde++
    else if (ise <= 0.95) amarelo++
    else vermelho++
  })
  return { verde, amarelo, vermelho }
})

// Zonas Coletivas
function percentualZonaColetivo(campo) {
  const totalM = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
  if (!totalM) return 0
  const somaCampo = atletasAtivos.value.reduce((acc, a) => acc + (a[campo] || 0), 0)
  return (somaCampo / totalM) * 100
}

// Filtro da Tabela Coletiva
const atletasTimeFiltrados = computed(() => {
  if (!filtroAtletasTime.value) return atletasAtivos.value
  const termo = filtroAtletasTime.value.toLowerCase().trim()
  return atletasAtivos.value.filter(a =>
    String(a.id).includes(termo) ||
    (a.posicaoSugerida && a.posicaoSugerida.toLowerCase().includes(termo))
  )
})

// =========================================================================
// CÁLCULOS INDIVIDUAIS & RISCO DE LESÃO (DASHBOARD ATLETA)
// =========================================================================
function calcularISE(atleta) {
  if (!atleta) return 0
  const minutos = (atleta.tempoTotalSegundos || 5400) / 60
  const desacAltas = atleta.desaceleracoesAltas || 0
  const desacCriticas = atleta.desaceleracoesCriticas || 0
  // Fórmula de Carga Excêntrica Ponderada por minuto de jogo
  const score = ((desacAltas * 1.5) + (desacCriticas * 3.0)) / Math.max(1, minutos)
  return parseFloat(score.toFixed(2))
}

const indiceISE = computed(() => {
  return calcularISE(atletaAtivo.value)
})

const razaoAD = computed(() => {
  if (!atletaAtivo.value || !atletaAtivo.value.desaceleracoesAltas) return '1.00'
  return (atletaAtivo.value.aceleracoesAltas / atletaAtivo.value.desaceleracoesAltas).toFixed(2)
})

function obterDiagnosticoRisco(atleta) {
  const ise = calcularISE(atleta)
  if (ise < 0.60) {
    return {
      nivel: 'Baixo Risco',
      cor: 'success',
      descricao: 'Demanda excêntrica sob controle fisiológico.',
      conduta: 'Seguir plano regular de treinamento regenerativo.'
    }
  } else if (ise <= 0.95) {
    return {
      nivel: 'Atenção / Sobrecarga Moderada',
      cor: 'warning',
      descricao: 'Volume elevado de frenagens bruscas nos isquiotibiais.',
      conduta: 'Protocolo de liberação miofascial e monitoramento de CK.'
    }
  } else {
    return {
      nivel: 'Alto Risco / Sobrecarga Severa',
      cor: 'error',
      descricao: 'Volume crítico de desacelerações severas. Risco agudo de estiramento.',
      conduta: 'Crioterapia por imersão e alívio de carga nos treinos seguintes.'
    }
  }
}

const diagnosticoRiscoAtleta = computed(() => {
  return obterDiagnosticoRisco(atletaAtivo.value)
})

function percentualZona(atleta, campo) {
  if (!atleta || !atleta.distanciaTotal) return 0
  return ((atleta[campo] || 0) / atleta.distanciaTotal) * 100
}

function obterCorSetor(posicao) {
  if (!posicao) return '#3b82f6'
  const p = posicao.toLowerCase()
  if (p.includes('goleiro')) return '#f59e0b'
  if (p.includes('zagueiro') || p.includes('lateral')) return '#3b82f6'
  if (p.includes('volante') || p.includes('meio') || p.includes('meia')) return '#10b981'
  return '#ef4444' // atacante / ponta
}

// =========================================================================
// RADAR FÍSICO (ATLETA VS TIME)
// =========================================================================
const eixosRadar = ['Volume', 'Ritmo (M/min)', 'Vel. Máxima', 'Sprints', 'Arrancadas', 'Player Load']

const dadosRadarTime = computed(() => {
  return [0.70, 0.70, 0.75, 0.65, 0.70, 0.70]
})

const dadosRadarAtleta = computed(() => {
  if (!atletaAtivo.value || !atletasAtivos.value.length) return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  const a = atletaAtivo.value

  const maxDist = Math.max(...atletasAtivos.value.map(x => x.distanciaTotal || 1))
  const maxMmin = Math.max(...atletasAtivos.value.map(x => x.metrosPorMinuto || 1))
  const maxVmax = Math.max(...atletasAtivos.value.map(x => x.velocidadeMaxima || 1))
  const maxSpr = Math.max(...atletasAtivos.value.map(x => x.sprintsContagem || 1))
  const maxAcel = Math.max(...atletasAtivos.value.map(x => x.aceleracoesAltas || 1))
  const maxPL = Math.max(...atletasAtivos.value.map(x => x.playerLoad || 1))

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

// =========================================================================
// FISIOLOGIA & ESCALA DE BORG CR-10 (FOSTER)
// =========================================================================
function descricaoBorg(val) {
  if (val <= 1) return 'Muito Leve'
  if (val <= 3) return 'Leve a Moderado'
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

const diagnosticoBorgAtleta = computed(() => {
  if (!atletaAtivo.value) return { tipo: 'info', titulo: '', mensagem: '', recomendacao: '' }
  const sprint = atletaAtivo.value.distanciaSprint || 0
  const borg = valorBorg.value

  if (borg >= 8 && sprint < 450) {
    return {
      tipo: 'error',
      titulo: 'Fadiga Desproporcional / Risco Neuromuscular',
      mensagem: 'O atleta relatou esforço muito elevado (PSE >= 8) para uma baixa produção de corrida de alta intensidade. Indica fadiga residual acumulada.',
      recomendacao: 'Protocolo regenerativo prioritário com crioterapia e redução de carga.'
    }
  } else if (borg <= 5 && sprint >= 650) {
    return {
      tipo: 'success',
      titulo: 'Alta Prontidão Física & Eficiência',
      mensagem: 'O atleta manteve alto volume de corrida em alta intensidade suportando baixa percepção subjetiva de esforço.',
      recomendacao: 'Pico de rendimento atlético. Manter cronograma habitual.'
    }
  } else if (borg >= 7) {
    return {
      tipo: 'warning',
      titulo: 'Carga Interna Elevada',
      mensagem: 'Partida com expressivo desgaste fisiológico compatível com a exigência física do jogo.',
      recomendacao: 'Reposição hidroeletrolítica e ingestão de carboidratos nas primeiras 4 horas pós-jogo.'
    }
  } else {
    return {
      tipo: 'info',
      titulo: 'Equilíbrio Carga Externa x Interna',
      mensagem: 'Relação perfeitamente alinhada entre as demandas físicas do jogo e a percepção de esforço relatada.',
      recomendacao: 'Seguir planejamento padrão de recuperação.'
    }
  }
})

// =========================================================================
// FUNÇÕES DE AÇÃO & NAVEGAÇÃO
// =========================================================================
function selecionarPartida(id) {
  partidaAtivaId.value = id
  mensagemAlerta.value = `Partida #${id} ativada com sucesso para análise coletiva e individual.`
  tipoAlerta.value = 'success'
}

function abrirAtletaNoDashboard(id) {
  atletaAtivoId.value = id
  menuAtivo.value = 'atleta'
}

function aplicarPresetUrl(tipo) {
  if (tipo === 'home') {
    urlDataset.value = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv'
  } else {
    urlDataset.value = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv'
  }
}

async function processarUploadArquivo() {
  if (!arquivoUpload.value) return
  carregando.value = true
  try {
    const formData = new FormData()
    formData.append('file', arquivoUpload.value)

    const resp = await fetch('http://localhost:3000/api/rastreamento', {
      method: 'POST',
      body: formData
    })
    const json = await resp.json()
    if (!json.sucesso) throw new Error(json.erro || 'Falha ao processar arquivo.')

    const novoId = String(partidas.value.length + 1)
    const novaPartida = {
      id: novoId,
      nome: nomeNovaPartida.value || `Partida Importada (CSV #${novoId})`,
      adversario: 'Equipe Adversária',
      data: new Date().toLocaleDateString('pt-BR'),
      duracao: 90,
      placar: 'Partida Analisada',
      atletas: json.dados
    }

    partidas.value.unshift(novaPartida)
    partidaAtivaId.value = novoId
    menuAtivo.value = 'time'
    mensagemAlerta.value = `Arquivo processado com sucesso! ${json.quantidadeJogadores} atletas integrados ao sistema.`
    tipoAlerta.value = 'success'
  } catch (err) {
    mensagemAlerta.value = `Erro ao comunicar com o backend: ${err.message}`
    tipoAlerta.value = 'error'
  } finally {
    carregando.value = false
  }
}

async function processarUrlDataset() {
  if (!urlDataset.value) return
  carregando.value = true
  try {
    const formData = new FormData()
    formData.append('url', urlDataset.value)

    const resp = await fetch('http://localhost:3000/api/rastreamento', {
      method: 'POST',
      body: formData
    })
    const json = await resp.json()
    if (!json.sucesso) throw new Error(json.erro || 'Falha ao baixar URL.')

    const novoId = String(partidas.value.length + 1)
    const novaPartida = {
      id: novoId,
      nome: `Dataset Remoto (Partida #${novoId})`,
      adversario: 'Adversário Remoto',
      data: new Date().toLocaleDateString('pt-BR'),
      duracao: 90,
      placar: 'Jogo Rastreamento 25 Hz',
      atletas: json.dados
    }

    partidas.value.unshift(novaPartida)
    partidaAtivaId.value = novoId
    menuAtivo.value = 'time'
    mensagemAlerta.value = `Dataset baixado e processado com sucesso! ${json.quantidadeJogadores} atletas computados.`
    tipoAlerta.value = 'success'
  } catch (err) {
    mensagemAlerta.value = `Erro ao baixar/processar da URL: ${err.message}`
    tipoAlerta.value = 'error'
  } finally {
    carregando.value = false
  }
}

function carregarPartidasPadrao() {
  partidaAtivaId.value = '1'
  atletaAtivoId.value = '7'
  menuAtivo.value = 'time'
  mensagemAlerta.value = 'Partidas de demonstração carregadas com sucesso! Explore os dashboards do time e dos atletas.'
  tipoAlerta.value = 'success'
}

// Helpers para tabela comparativa
function calcularDistanciaColetiva(atletas) {
  if (!atletas) return 0
  return atletas.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
}
function calcularMediaMmin(atletas) {
  if (!atletas || !atletas.length) return 0
  return atletas.reduce((acc, a) => acc + (a.metrosPorMinuto || 0), 0) / atletas.length
}
function calcularMaiorVelocidade(atletas) {
  if (!atletas || !atletas.length) return 0
  return Math.max(...atletas.map(a => a.velocidadeMaxima || 0))
}
function calcularTotalAceleracoes(atletas) {
  if (!atletas) return 0
  return atletas.reduce((acc, a) => acc + (a.aceleracoesAltas || 0), 0)
}
function calcularTotalDesaceleracoes(atletas) {
  if (!atletas) return 0
  return atletas.reduce((acc, a) => acc + (a.desaceleracoesAltas || 0), 0)
}
</script>

<style scoped>
.app-background {
  background: radial-gradient(circle at 10% 15%, #0a1329 0%, #050811 90%) !important;
  color: #e2e8f0;
  min-height: 100vh;
}

.main-viewport {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.sidebar-custom {
  background: #060b13 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.sidebar-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.sidebar-logo-img {
  height: 42px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 10px rgba(0, 230, 153, 0.3));
}

.nav-item-custom {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.nav-item-custom:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(14, 23, 42, 0.78) !important;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 14px !important;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.3) !important;
}

.match-card {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.match-card-active {
  border-color: #10b981 !important;
  background: rgba(16, 185, 129, 0.08) !important;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.15) !important;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.zone-badge {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.zone-walk { background-color: #3b82f6; }
.zone-jog { background-color: #06b6d4; }
.zone-run { background-color: #f59e0b; }
.zone-sprint { background-color: #ef4444; }

.segmented-bar {
  display: flex;
  height: 12px;
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
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.table-custom td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.pitch-container {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.soccer-pitch {
  width: 100%;
  max-height: 520px;
  border-radius: 10px;
}

.radar-svg {
  width: 100%;
  max-width: 360px;
  height: auto;
}

.select-partida-top :deep(.v-field__input) {
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
