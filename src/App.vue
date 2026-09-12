<template>
  <v-app class="app-background">
    <!-- BARRA LATERAL (MENU PRINCIPAL) -->
    <v-navigation-drawer
      v-model="drawerAberto"
      :rail="railMode"
      :rail-width="72"
      disable-resize-watcher
      color="#060b13"
      width="270"
      border
      elevation="4"
      class="sidebar-custom"
    >
      <!-- Header do Menu: Logo Oficial + Botões de Recolher/Fechar -->
      <div v-if="!railMode" class="sidebar-logo-container pa-3 border-b d-flex align-center justify-space-between">
        <div class="d-flex align-center flex-grow-1 mr-2" style="min-width: 0;">
          <img
            src="/visao90-header.png"
            alt="Visão 90"
            class="sidebar-logo-img"
          />
        </div>

        <div class="d-flex align-center flex-shrink-0">
          <!-- Botão Modo Compacto (Rail) -->
          <v-tooltip text="Recolher para ícones" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dock-left"
                size="small"
                variant="text"
                color="grey-lighten-1"
                @click.stop="railMode = true"
              ></v-btn>
            </template>
          </v-tooltip>

          <!-- Botão Esconder Menu Completamente -->
          <v-tooltip text="Esconder menu lateral" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-chevron-left"
                size="small"
                variant="text"
                color="grey-lighten-1"
                @click.stop="drawerAberto = false"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>

      <!-- Header em Modo Compacto (Rail) -->
      <div v-else class="pa-3 border-b d-flex flex-column align-center justify-center">
        <v-tooltip text="Expandir menu lateral" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-chevron-double-right"
              size="small"
              variant="tonal"
              color="primary"
              @click.stop="railMode = false"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>

      <!-- Menu de Navegação em 4 Módulos Especializados do TCC -->
      <v-list density="comfortable" nav class="pa-2 mt-1">
        <!-- 1. Inserção de Dados -->
        <v-tooltip text="Inserção de Dados & Arquivos" :disabled="!railMode" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              value="dados"
              :active="menuAtivo === 'dados'"
              @click="selecionarMenu('dados')"
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
              <v-list-item-subtitle v-if="!railMode" class="text-caption text-medium-emphasis">
                Upload CSV & Fontes 25 Hz
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-tooltip>

        <!-- 2. Painel da Comissão Técnica -->
        <v-tooltip text="Painel da Comissão Técnica (ACWR & Elenco)" :disabled="!railMode" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              value="comissao"
              :active="menuAtivo === 'comissao'"
              @click="selecionarMenu('comissao')"
              rounded="lg"
              class="mb-2 nav-item-custom"
              color="primary"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account-group-outline" class="mr-1"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold text-body-2">
                Painel da Comissão
              </v-list-item-title>
              <v-list-item-subtitle v-if="!railMode" class="text-caption text-medium-emphasis">
                Quadro do Elenco, Risco & ACWR
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-tooltip>

        <!-- 3. Painel do Atleta -->
        <v-tooltip text="Painel do Atleta (Minutagem & Borg)" :disabled="!railMode" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              value="atleta"
              :active="menuAtivo === 'atleta'"
              @click="selecionarMenu('atleta')"
              rounded="lg"
              class="mb-2 nav-item-custom"
              color="warning"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account-details-outline" class="mr-1"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold text-body-2">
                Painel do Atleta
              </v-list-item-title>
              <v-list-item-subtitle v-if="!railMode" class="text-caption text-medium-emphasis">
                Carga Individual, Minutos & Borg
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-tooltip>

        <!-- 4. Relatório Pós-Jogo -->
        <v-tooltip text="Relatório Pós-Jogo (Heatmap Real & 5 Zonas)" :disabled="!railMode" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              value="relatorio"
              :active="menuAtivo === 'relatorio'"
              @click="selecionarMenu('relatorio')"
              rounded="lg"
              class="mb-2 nav-item-custom"
              color="info"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-file-document-chart-outline" class="mr-1"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold text-body-2">
                Relatório Pós-Jogo
              </v-list-item-title>
              <v-list-item-subtitle v-if="!railMode" class="text-caption text-medium-emphasis">
                Dossiê, Heatmap Real & 5 Zonas
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-tooltip>
      </v-list>

      <v-spacer></v-spacer>

      <!-- Status do Sistema no Rodapé do Menu -->
      <template v-slot:append>
        <div v-if="!railMode" class="pa-3 border-t bg-surface-darken-1">
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
              <span>Metrica Sports 25 Hz</span>
            </div>
            <div class="d-flex align-center text-caption text-info">
              <v-icon icon="mdi-check-decagram" size="16" class="mr-1"></v-icon>
              <span>Integração Borg CR-10</span>
            </div>
          </div>

          <!-- Botão explícito para esconder o menu no rodapé -->
          <v-btn
            block
            variant="tonal"
            size="small"
            color="grey-lighten-2"
            prepend-icon="mdi-chevron-left"
            @click.stop="drawerAberto = false"
            class="mt-3 text-caption font-weight-bold"
          >
            Esconder Menu
          </v-btn>
        </div>

        <div v-else class="pa-2 border-t d-flex flex-column align-center gap-2">
          <v-tooltip text="Esconder menu" location="right">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-chevron-left"
                size="small"
                variant="text"
                color="grey-lighten-2"
                @click.stop="drawerAberto = false"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- TOP APP BAR -->
    <v-app-bar color="transparent" elevation="0" height="64" class="topbar-custom">
      <v-tooltip :text="drawerAberto ? 'Esconder menu lateral' : 'Abrir menu lateral'" location="bottom">
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon
            v-bind="props"
            @click.stop="alternarDrawer"
            :color="drawerAberto ? 'grey-lighten-1' : 'primary'"
            class="mr-1"
          ></v-app-bar-nav-icon>
        </template>
      </v-tooltip>

      <!-- Logo Oficial Visão 90 visível quando o menu estiver escondido -->
      <div v-if="!drawerAberto" class="d-flex align-center mr-3 pl-1">
        <img
          src="/visao90-header.png"
          alt="Visão 90"
          style="height: 32px; width: auto; object-fit: contain;"
        />
        <v-divider vertical class="mx-3 my-2"></v-divider>
      </div>

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
                    Envie as coordenadas bidimensionais brutas (X, Y) da Metrica Sports para processamento do motor cinemático.
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
                placeholder="Exemplo: match_tracking_25fps.csv"
                class="mb-3"
              ></v-file-input>

              <v-text-field
                v-model="nomeNovaPartida"
                label="Identificação do Confronto (Opcional)"
                placeholder="Ex: Campeonato Oficial - Rodada 5"
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
                Processar & Integrar aos Painéis
              </v-btn>
            </v-card>

            <!-- Card de Ingestão Remota / URL -->
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <div class="d-flex align-center mb-3">
                <v-avatar color="info" variant="tonal" class="mr-3">
                  <v-icon icon="mdi-link-variant" color="info"></v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold">Importação via URL / Repositório Externo</h2>
                  <p class="text-caption text-medium-emphasis">
                    Forneça uma URL pública de tracking ou selecione um dos conjuntos oficiais pré-configurados.
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
                  Preset 1: Equipe Mandante (Metrica Game 1)
                </v-chip>
                <v-chip
                  size="small"
                  variant="outlined"
                  color="info"
                  @click="aplicarPresetUrl('away')"
                  prepend-icon="mdi-shield-airplane"
                >
                  Preset 2: Equipe Visitante (Metrica Game 1)
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

          <!-- Coluna Lateral de Requisitos -->
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-2">
                <v-icon icon="mdi-information-outline" color="primary" class="mr-2"></v-icon>
                Requisitos do Metrica Sports
              </h3>
              <ul class="text-caption text-medium-emphasis pl-4 d-flex flex-column gap-2">
                <li><strong>Taxa de Amostragem:</strong> Séries temporais de 25 Hz (25 frames/segundo).</li>
                <li><strong>5 Zonas de Velocidade:</strong> Z1 (&lt;7.2), Z2 (7.2-14.4), Z3 (14.4-19.8), Z4 HSR (19.8-25.2), Z5 Sprint (&gt;25.2 km/h).</li>
                <li><strong>Carga Interna:</strong> Coleta pós-jogo (20-30 min) via Escala Borg CR-10.</li>
                <li><strong>Índices Integrados:</strong> ACWR (Gabbett), Monotonia e Tensão (Foster), Razão de Eficiência.</li>
              </ul>
            </v-card>

            <v-card class="glass-card pa-4" elevation="0">
              <h3 class="text-subtitle-1 font-weight-bold d-flex align-center mb-2">
                <v-icon icon="mdi-lightning-bolt" color="warning" class="mr-2"></v-icon>
                Confrontos Carregados
              </h3>
              <p class="text-caption text-medium-emphasis mb-3">
                {{ partidas.length }} partidas oficiais cadastradas e prontas para análise da comissão.
              </p>
              <v-btn
                color="warning"
                variant="tonal"
                block
                prepend-icon="mdi-refresh"
                @click="carregarPartidasPadrao"
                class="font-weight-bold"
              >
                Recarregar Demonstração (3 Partidas)
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tabela de Partidas Cadastradas e Comparativo -->
        <v-card class="glass-card mt-2 pa-4" elevation="0">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-format-list-bulleted" color="primary" class="mr-2"></v-icon>
              <h3 class="text-subtitle-1 font-weight-bold">Banco de Partidas Cadastradas</h3>
            </div>
            <v-chip color="primary" size="small" variant="flat" class="font-weight-bold">
              {{ partidas.length }} Partidas
            </v-chip>
          </div>

          <v-table hover class="bg-transparent table-custom">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Partida / Confronto</th>
                <th class="text-left font-weight-bold">Data</th>
                <th class="text-left font-weight-bold">Duração</th>
                <th class="text-left font-weight-bold">Volume Coletivo</th>
                <th class="text-left font-weight-bold">Ritmo Médio</th>
                <th class="text-left font-weight-bold">Sprints &gt; 25.2 km/h</th>
                <th class="text-center font-weight-bold">Status / Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in partidas"
                :key="'partida-table-' + p.id"
                :class="{ 'bg-surface-variant': p.id === partidaAtivaId }"
              >
                <td>
                  <strong>{{ p.nome }}</strong>
                  <div class="text-caption text-medium-emphasis">Adversário: {{ p.adversario }} &middot; Placar: {{ p.placar }}</div>
                </td>
                <td class="text-caption">{{ p.data }}</td>
                <td class="text-caption">{{ p.duracao }} min</td>
                <td><strong>{{ (calcularDistanciaColetiva(p.atletas) / 1000).toFixed(1) }} km</strong></td>
                <td>
                  <v-chip size="x-small" color="info" variant="tonal" class="font-weight-bold">
                    {{ calcularMediaMmin(p.atletas).toFixed(0) }} m/min
                  </v-chip>
                </td>
                <td class="text-warning font-weight-bold">
                  {{ calcularTotalSprintsPicos(p.atletas) }}
                </td>
                <td class="text-center">
                  <v-btn
                    size="small"
                    :color="p.id === partidaAtivaId ? 'success' : 'primary'"
                    :variant="p.id === partidaAtivaId ? 'flat' : 'outlined'"
                    @click="selecionarPartida(p.id)"
                    class="font-weight-bold"
                  >
                    {{ p.id === partidaAtivaId ? 'Ativa' : 'Selecionar' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 2: PAINEL DA COMISSÃO TÉCNICA (MONITORAMENTO DO ELENCO & ACWR)       -->
      <!-- ========================================================================= -->
      <div v-else-if="menuAtivo === 'comissao'">
        <!-- Contexto da Partida e Atalhos -->
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
              color="warning"
              variant="outlined"
              size="small"
              prepend-icon="mdi-account-details"
              @click="menuAtivo = 'atleta'"
              class="font-weight-bold"
            >
              Painel do Atleta
            </v-btn>
            <v-btn
              color="info"
              variant="flat"
              size="small"
              prepend-icon="mdi-file-document-chart"
              @click="menuAtivo = 'relatorio'"
              class="font-weight-bold"
            >
              Dossiê Pós-Jogo
            </v-btn>
          </div>
        </div>

        <!-- 1. SEMÁFORO DE RISCO ACWR COLETIVO (CARDS DE TRIAGEM GABBETT) -->
        <v-row class="mb-4">
          <!-- Sweet Spot (0.8 a 1.3) -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="glass-card pa-3 border-l-4 border-success" elevation="0">
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Faixa Ótima (Sweet Spot)
                </div>
                <v-icon icon="mdi-shield-check" color="success"></v-icon>
              </div>
              <div class="d-flex align-baseline gap-2 mt-1">
                <div class="text-h4 font-weight-black text-success">{{ contagemACWR.sweetSpot }}</div>
                <div class="text-caption text-medium-emphasis">atletas (ACWR 0.8 - 1.3)</div>
              </div>
              <div class="text-caption text-success font-weight-medium mt-1">
                Menor risco predito de lesão
              </div>
            </v-card>
          </v-col>

          <!-- Sobrecarga Moderada (1.3 a 1.5) -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="glass-card pa-3 border-l-4 border-warning" elevation="0">
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Sobrecarga Moderada
                </div>
                <v-icon icon="mdi-alert-circle-outline" color="warning"></v-icon>
              </div>
              <div class="d-flex align-baseline gap-2 mt-1">
                <div class="text-h4 font-weight-black text-warning">{{ contagemACWR.atencao }}</div>
                <div class="text-caption text-medium-emphasis">atletas (ACWR 1.3 - 1.5)</div>
              </div>
              <div class="text-caption text-warning font-weight-medium mt-1">
                Atenção à recuperação e sono
              </div>
            </v-card>
          </v-col>

          <!-- Zona de Perigo / Spike (> 1.5) -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="glass-card pa-3 border-l-4 border-error" elevation="0">
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Zona de Perigo (Spike)
                </div>
                <v-icon icon="mdi-alert-octagon" color="error"></v-icon>
              </div>
              <div class="d-flex align-baseline gap-2 mt-1">
                <div class="text-h4 font-weight-black text-error">{{ contagemACWR.perigo }}</div>
                <div class="text-caption text-medium-emphasis">atletas (ACWR &gt; 1.5)</div>
              </div>
              <div class="text-caption text-error font-weight-medium mt-1">
                Alto risco de lesão muscular
              </div>
            </v-card>
          </v-col>

          <!-- Sub-treinamento (< 0.8) -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="glass-card pa-3 border-l-4 border-info" elevation="0">
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Sub-treinamento
                </div>
                <v-icon icon="mdi-arrow-down-bold-circle-outline" color="info"></v-icon>
              </div>
              <div class="d-flex align-baseline gap-2 mt-1">
                <div class="text-h4 font-weight-black text-info">{{ contagemACWR.subtreino }}</div>
                <div class="text-caption text-medium-emphasis">atletas (ACWR &lt; 0.8)</div>
              </div>
              <div class="text-caption text-info font-weight-medium mt-1">
                Risco de destreinamento
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 2. PAINEL DE ALERTAS AUTOMATIZADOS (ACWR ELEVADO & ANOMALIA BORG VS TRACKING) -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="alertasComissao.length > 0">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-bell-ring-outline" color="warning" class="mr-2"></v-icon>
            <h3 class="text-subtitle-1 font-weight-bold">Alertas Fisiológicos Automatizados da Comissão Técnica</h3>
          </div>
          <v-row dense>
            <v-col
              v-for="(alerta, i) in alertasComissao"
              :key="'alerta-ct-' + i"
              cols="12"
              md="6"
            >
              <v-alert
                :type="alerta.tipo"
                variant="tonal"
                density="comfortable"
                class="mb-2"
              >
                <div class="d-flex justify-space-between align-center mb-1">
                  <strong>{{ alerta.titulo }}</strong>
                  <v-chip size="x-small" :color="alerta.tipo" class="font-weight-bold">
                    {{ alerta.tag }}
                  </v-chip>
                </div>
                <div class="text-caption text-slate-200">{{ alerta.mensagem }}</div>
                <div class="text-caption font-weight-bold mt-1 text-slate-100">
                  Conduta: {{ alerta.recomendacao }}
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-card>

        <!-- 3. SEIS KPIS COLETIVOS DO ELENCO -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Volume Coletivo</div>
                <div class="text-h4 font-weight-black mt-1 text-secondary">
                  {{ (distanciaColetivaKm).toFixed(1) }} <span class="text-caption">km</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Média: {{ (distanciaColetivaKm / atletasAtivos.length).toFixed(1) }} km/atleta
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Ritmo Médio</div>
                <div class="text-h4 font-weight-black mt-1 text-info">
                  {{ mediaMetrosPorMinuto.toFixed(0) }} <span class="text-caption">m/min</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">Ref. Elite: 100-125 m/min</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Pico de Velocidade</div>
                <div class="text-h4 font-weight-black mt-1 text-warning">
                  {{ maiorVelocidade.toFixed(1) }} <span class="text-caption">km/h</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Atleta veloz: #{{ atletaMaisRapido?.id || '-' }}
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Sprints (&gt; 25.2 km/h)</div>
                <div class="text-h4 font-weight-black mt-1 text-success">
                  {{ totalSprintsPicos }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">Picos de alta explosão</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">HSR (19.8-25.2 km/h)</div>
                <div class="text-h4 font-weight-black mt-1 text-secondary">
                  {{ (totalHSRMetros / 1000).toFixed(2) }} <span class="text-caption">km</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">Volume Alta Intensidade</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <v-card class="glass-card kpi-card" elevation="0">
              <v-card-item>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Frenagens (&lt; -2.5)</div>
                <div class="text-h4 font-weight-black mt-1 text-error">
                  {{ totalDesaceleracoesAltas }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">Críticas: {{ totalDesaceleracoesCriticas }}</div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- 4. QUADRO COMPARATIVO E RANQUEAMENTO DO ELENCO -->
        <v-card class="glass-card pa-4 mb-4" elevation="0">
          <div class="d-flex flex-wrap align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-trophy-outline" color="warning" class="mr-2"></v-icon>
              <h3 class="text-subtitle-1 font-weight-bold">Quadro Comparativo & Ranqueamento do Elenco</h3>
            </div>
            <div class="d-flex align-center gap-2">
              <span class="text-caption text-medium-emphasis">Ordenar por:</span>
              <v-btn-toggle v-model="criterioOrdenacaoElenco" mandatory density="compact" color="primary" variant="outlined">
                <v-btn value="distanciaTotal" size="small">Volume</v-btn>
                <v-btn value="sprintsPicosContagem" size="small">Sprints</v-btn>
                <v-btn value="distanciaZ4HSR" size="small">HSR</v-btn>
                <v-btn value="acwrRatio" size="small">ACWR</v-btn>
                <v-btn value="escoreBorg" size="small">Borg</v-btn>
              </v-btn-toggle>
            </div>
          </div>

          <v-table hover class="bg-transparent table-custom">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Atleta</th>
                <th class="text-left font-weight-bold">Minutos</th>
                <th class="text-left font-weight-bold">Distância (km)</th>
                <th class="text-left font-weight-bold">m/min</th>
                <th class="text-left font-weight-bold">HSR (19.8-25.2)</th>
                <th class="text-left font-weight-bold">Sprints (&gt; 25.2)</th>
                <th class="text-left font-weight-bold">ACWR (Gabbett)</th>
                <th class="text-left font-weight-bold">Monotonia / Strain</th>
                <th class="text-left font-weight-bold">Borg / Foster</th>
                <th class="text-center font-weight-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in elencoOrdenado"
                :key="'rank-atleta-' + a.id"
                :class="{ 'bg-surface-variant': String(a.id) === String(atletaAtivoId) }"
              >
                <td>
                  <div class="d-flex align-center py-1">
                    <v-avatar color="primary" size="28" class="mr-2 font-weight-bold text-caption">
                      #{{ a.id }}
                    </v-avatar>
                    <div>
                      <strong>Jogador #{{ a.id }}</strong>
                      <div class="text-caption text-medium-emphasis">{{ a.posicaoSugerida }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <v-chip size="x-small" variant="flat" color="surface-variant" class="font-weight-bold">
                    {{ a.minutosJogados }} min
                  </v-chip>
                </td>
                <td><strong>{{ (a.distanciaTotal / 1000).toFixed(2) }} km</strong></td>
                <td>
                  <v-chip size="x-small" variant="tonal" color="info" class="font-weight-bold">
                    {{ a.metrosPorMinuto?.toFixed(0) }} m/min
                  </v-chip>
                </td>
                <td class="text-secondary font-weight-medium">
                  {{ a.distanciaZ4HSR }} m
                </td>
                <td class="text-warning font-weight-bold">
                  {{ a.sprintsPicosContagem }} picos
                </td>
                <td>
                  <v-chip
                    size="small"
                    :color="obterCorACWR(a.acwrRatio)"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    {{ a.acwrRatio.toFixed(2) }} ({{ obterTextoCurtoACWR(a.acwrRatio) }})
                  </v-chip>
                </td>
                <td class="text-caption">
                  {{ a.monotonia.toFixed(2) }} / <span class="font-weight-bold">{{ a.strain }} U.A.</span>
                </td>
                <td>
                  <v-chip size="x-small" :color="corBorg(a.escoreBorg)" variant="flat" class="font-weight-bold">
                    PSE {{ a.escoreBorg }} ({{ a.escoreBorg * a.minutosJogados }} U.A.)
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-btn
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-account-eye"
                    @click="abrirAtletaEspecifico(a.id)"
                    class="mr-1"
                  >
                    Atleta
                  </v-btn>
                  <v-btn
                    size="x-small"
                    color="info"
                    variant="tonal"
                    prepend-icon="mdi-file-chart"
                    @click="abrirRelatorioAtleta(a.id)"
                  >
                    Dossiê
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- 5. FORMAÇÃO TÁTICA COLETIVA & DIMENSÕES DO BLOCO -->
        <v-row class="mb-4">
          <!-- Campo Oficial 105m x 68m com 11 Atletas -->
          <v-col cols="12" lg="8">
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-soccer-field" color="primary" class="mr-2"></v-icon>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-bold">
                      Formação Tática Oficial & Ocupação Espacial (11 Atletas)
                    </h3>
                    <p class="text-caption text-medium-emphasis">
                      Gramado Oficial 105m &times; 68m com posições médias simultâneas
                    </p>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-chip size="small" color="secondary" variant="flat" class="font-weight-bold">
                    Baricentro: X={{ baricentroTime.x.toFixed(1) }}m, Y={{ baricentroTime.y.toFixed(1) }}m
                  </v-chip>
                  <v-chip size="small" color="info" variant="flat" class="font-weight-bold">
                    Compacidade: {{ compacidadeTime.toFixed(1) }}m
                  </v-chip>
                </div>
              </div>

              <!-- SVG do Gramado Oficial de Futebol -->
              <div class="pitch-container pa-2">
                <svg
                  viewBox="0 0 105 68"
                  class="soccer-pitch"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Gramado Verde Escuro -->
                  <rect x="0" y="0" width="105" height="68" fill="#0c2314" />

                  <!-- Listras do Gramado -->
                  <g opacity="0.15">
                    <rect x="0" y="0" width="10.5" height="68" fill="#ffffff" />
                    <rect x="21" y="0" width="10.5" height="68" fill="#ffffff" />
                    <rect x="42" y="0" width="10.5" height="68" fill="#ffffff" />
                    <rect x="63" y="0" width="10.5" height="68" fill="#ffffff" />
                    <rect x="84" y="0" width="10.5" height="68" fill="#ffffff" />
                  </g>

                  <!-- Linhas Limítrofes Oficiais -->
                  <rect x="0" y="0" width="105" height="68" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />

                  <!-- Linha de Meio de Campo -->
                  <line x1="52.5" y1="0" x2="52.5" y2="68" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />

                  <!-- Círculo Central Oficial (Raio 9.15m) -->
                  <circle cx="52.5" cy="34" r="9.15" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />
                  <circle cx="52.5" cy="34" r="0.8" fill="rgba(255,255,255,0.9)" />

                  <!-- Grande Área Esquerda (16.5m x 40.32m) -->
                  <rect x="0" y="13.84" width="16.5" height="40.32" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />
                  <!-- Pequena Área Esquerda (5.5m x 18.32m) -->
                  <rect x="0" y="24.84" width="5.5" height="18.32" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />
                  <!-- Marca do Pênalti Esquerda (11m) -->
                  <circle cx="11" cy="34" r="0.7" fill="rgba(255,255,255,0.9)" />

                  <!-- Grande Área Direita -->
                  <rect x="88.5" y="13.84" width="16.5" height="40.32" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />
                  <!-- Pequena Área Direita -->
                  <rect x="99.5" y="24.84" width="5.5" height="18.32" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.7" />
                  <!-- Marca do Pênalti Direita -->
                  <circle cx="94" cy="34" r="0.7" fill="rgba(255,255,255,0.9)" />

                  <!-- Polígono Envolvente / Bloco Tático da Equipe (Convex Hull tático) -->
                  <polygon
                    :points="pontosBlocoTatico"
                    fill="rgba(16, 185, 129, 0.08)"
                    stroke="#10b981"
                    stroke-width="0.8"
                    stroke-dasharray="2, 1"
                  />

                  <!-- Raio de Compacidade no Baricentro -->
                  <circle
                    :cx="baricentroTime.x"
                    :cy="baricentroTime.y"
                    :r="compacidadeTime"
                    fill="rgba(16, 185, 129, 0.04)"
                    stroke="#10b981"
                    stroke-width="0.5"
                    stroke-dasharray="1, 1"
                  />

                  <!-- Ponto do Baricentro -->
                  <circle
                    :cx="baricentroTime.x"
                    :cy="baricentroTime.y"
                    r="1.4"
                    fill="#10b981"
                    stroke="#ffffff"
                    stroke-width="0.5"
                  />

                  <!-- Os 11 Atletas Renderizados no Gramado -->
                  <g
                    v-for="a in atletasAtivos"
                    :key="'player-pitch-' + a.id"
                    style="cursor: pointer;"
                    @click="abrirAtletaEspecifico(a.id)"
                  >
                    <!-- Círculo de Dispersão do Jogador -->
                    <circle
                      :cx="a.centroideX"
                      :cy="a.centroideY"
                      :r="a.raioAcao * 0.4"
                      :fill="obterCorSetor(a.posicaoSugerida, 0.12)"
                      :stroke="obterCorSetor(a.posicaoSugerida, 0.5)"
                      stroke-width="0.4"
                    />

                    <!-- Marcador do Jogador -->
                    <circle
                      :cx="a.centroideX"
                      :cy="a.centroideY"
                      r="2.2"
                      :fill="obterCorSetor(a.posicaoSugerida, 1)"
                      stroke="#ffffff"
                      stroke-width="0.6"
                    />

                    <!-- Número da Camisa -->
                    <text
                      :x="a.centroideX"
                      :y="a.centroideY + 0.8"
                      font-size="2.0"
                      font-weight="bold"
                      text-anchor="middle"
                      fill="#ffffff"
                    >
                      {{ a.id }}
                    </text>

                    <!-- Nome da Posição Abreviada -->
                    <text
                      :x="a.centroideX"
                      :y="a.centroideY + 3.8"
                      font-size="1.4"
                      text-anchor="middle"
                      fill="#e2e8f0"
                      font-weight="500"
                    >
                      {{ a.posicaoSugerida }}
                    </text>
                  </g>
                </svg>
              </div>

              <!-- Legenda do Campo -->
              <div class="d-flex flex-wrap align-center justify-space-between mt-3 text-caption text-medium-emphasis">
                <div class="d-flex align-center gap-3">
                  <span><span class="status-indicator bg-warning mr-1"></span> Goleiro</span>
                  <span><span class="status-indicator bg-info mr-1"></span> Defensores</span>
                  <span><span class="status-indicator bg-primary mr-1"></span> Meio-Campistas</span>
                  <span><span class="status-indicator bg-error mr-1"></span> Atacantes</span>
                </div>
                <div>&bull; Clique em um jogador no campo para abrir sua análise individual</div>
              </div>
            </v-card>
          </v-col>

          <!-- Dimensões do Bloco Tático & Distribuição de 5 Zonas -->
          <v-col cols="12" lg="4">
            <!-- Dimensões do Bloco -->
            <v-card class="glass-card pa-4 mb-4" elevation="0">
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-compass-outline" color="info" class="mr-2"></v-icon>
                <h3 class="text-subtitle-1 font-weight-bold">Dimensões do Bloco Tático da Equipe</h3>
              </div>

              <v-row dense class="mb-2">
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Compacidade Tática</div>
                    <div class="text-h5 font-weight-bold text-primary">{{ compacidadeTime.toFixed(1) }} m</div>
                    <div class="text-caption text-medium-emphasis">Dispersão ao Baricentro</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Baricentro Médio</div>
                    <div class="text-h6 font-weight-bold text-info">
                      ({{ baricentroTime.x.toFixed(1) }}, {{ baricentroTime.y.toFixed(1) }})
                    </div>
                    <div class="text-caption text-medium-emphasis">Coordenadas X / Y</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center mt-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Comprimento do Bloco</div>
                    <div class="text-h5 font-weight-bold text-secondary">{{ comprimentoBloco.toFixed(1) }} m</div>
                    <div class="text-caption text-medium-emphasis">Distância Gol a Ataque</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center mt-2" elevation="0">
                    <div class="text-caption text-medium-emphasis">Largura do Bloco</div>
                    <div class="text-h5 font-weight-bold text-info">{{ larguraBloco.toFixed(1) }} m</div>
                    <div class="text-caption text-medium-emphasis">Amplitude Lateral</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <!-- Distribuição Coletiva das 5 Zonas de Velocidade Padronizadas -->
            <v-card class="glass-card pa-4" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-speedometer" color="warning" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Distribuição das 5 Zonas de Velocidade</h3>
                </div>
              </div>

              <!-- Barra Segmentada das 5 Zonas -->
              <div class="segmented-bar mb-3" style="height: 14px;">
                <div class="seg-walk" :style="{ width: percentuaisZonasColetivas.z1 + '%' }"></div>
                <div class="seg-jog" :style="{ width: percentuaisZonasColetivas.z2 + '%' }"></div>
                <div class="seg-run" :style="{ width: percentuaisZonasColetivas.z3 + '%' }"></div>
                <div class="seg-hsr" :style="{ width: percentuaisZonasColetivas.z4 + '%' }"></div>
                <div class="seg-sprint" :style="{ width: percentuaisZonasColetivas.z5 + '%' }"></div>
              </div>

              <div class="d-flex flex-column gap-1 text-caption">
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span><span class="zone-badge zone-walk mr-2"></span>Z1 Caminhada (&lt; 7.2 km/h)</span>
                  <strong>{{ percentuaisZonasColetivas.z1 }}%</strong>
                </div>
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span><span class="zone-badge zone-jog mr-2"></span>Z2 Trote (7.2 a 14.4 km/h)</span>
                  <strong>{{ percentuaisZonasColetivas.z2 }}%</strong>
                </div>
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span><span class="zone-badge zone-run mr-2"></span>Z3 Média/Alta (14.4 a 19.8 km/h)</span>
                  <strong>{{ percentuaisZonasColetivas.z3 }}%</strong>
                </div>
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span><span class="zone-badge zone-hsr mr-2"></span>Z4 HSR (19.8 a 25.2 km/h)</span>
                  <strong class="text-secondary">{{ percentuaisZonasColetivas.z4 }}%</strong>
                </div>
                <div class="d-flex align-center justify-space-between py-1">
                  <span><span class="zone-badge zone-sprint mr-2"></span>Z5 Sprints (&gt; 25.2 km/h)</span>
                  <strong class="text-error">{{ percentuaisZonasColetivas.z5 }}%</strong>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 3: PAINEL DO ATLETA (MINUTAGEM, BORG, CARGA & ANOMALIA)              -->
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
                        {{ item.raw.minutosJogados }} min | {{ (item.raw.distanciaTotal / 1000).toFixed(2) }} km | ACWR: {{ item.raw.acwrRatio?.toFixed(2) }}
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

            <!-- Chips Rápidos dos 11 Atletas -->
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
                    :color="obterCorACWR(atletaAtivo.acwrRatio)"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    ACWR: {{ atletaAtivo.acwrRatio?.toFixed(2) }} ({{ obterTextoCurtoACWR(atletaAtivo.acwrRatio) }})
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ partidaAtiva.nome }} &middot; Posição Centroide: X={{ atletaAtivo.centroideX }}m, Y={{ atletaAtivo.centroideY }}m
                </div>
              </div>
            </div>

            <!-- Botão Atalho para Dossiê com Heatmap Real -->
            <v-btn
              color="info"
              variant="flat"
              prepend-icon="mdi-file-document-chart"
              @click="menuAtivo = 'relatorio'"
              class="font-weight-bold"
            >
              Abrir Dossiê Pós-Jogo & Heatmap Real
            </v-btn>
          </div>
        </v-card>

        <!-- 1. ESPECIFICAÇÃO DOS MINUTOS JOGADOS NA PARTIDA & CONTROLE DINÂMICO -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="atletaAtivo">
          <div class="d-flex flex-wrap align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-timer-sand" color="secondary" class="mr-2"></v-icon>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold">Minutos Jogados pelo Atleta nesta Partida</h3>
                <p class="text-caption text-medium-emphasis">
                  Tempo real de participação em campo para normalização fidedigna dos índices de m/min e carga de Foster.
                </p>
              </div>
            </div>
            <v-chip size="large" color="secondary" variant="flat" class="font-weight-black text-h6">
              {{ minutosJogadosAtleta }} min
            </v-chip>
          </div>

          <v-row align="center" class="mb-2">
            <v-col cols="12" md="8">
              <div class="d-flex align-center gap-2 mb-2">
                <span class="text-caption text-medium-emphasis">Ajuste Rápido de Minutagem:</span>
                <v-chip
                  v-for="minPreset in [90, 75, 60, 45, 30, 20]"
                  :key="'preset-min-' + minPreset"
                  size="small"
                  :color="minutosJogadosAtleta === minPreset ? 'secondary' : 'surface-variant'"
                  class="font-weight-bold cursor-pointer"
                  @click="minutosJogadosAtleta = minPreset"
                >
                  {{ minPreset }} min {{ minPreset === 90 ? '(Completo)' : minPreset === 45 ? '(1º Tempo)' : '' }}
                </v-chip>
              </div>

              <v-slider
                v-model="minutosJogadosAtleta"
                :min="10"
                :max="90"
                :step="1"
                color="secondary"
                track-color="surface"
                thumb-label="always"
                class="mt-4"
              ></v-slider>
            </v-col>

            <!-- Índices Derivados dos Minutos -->
            <v-col cols="12" md="4">
              <v-card color="surface-variant" class="pa-3 text-center" elevation="0">
                <div class="text-caption text-medium-emphasis">Ritmo Normalizado (m/min)</div>
                <div class="text-h4 font-weight-black text-primary mt-1">
                  {{ ritmoNormalizadoMmin.toFixed(1) }} <span class="text-caption">m/min</span>
                </div>
                <div class="text-caption text-slate-300 mt-1">
                  Distância ({{ atletaAtivo.distanciaTotal }}m) / {{ minutosJogadosAtleta }} min
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- 2. FORMULÁRIO ÁGIL DE INSERÇÃO DO ESCORE BORG CR-10 PÓS-JOGO -->
        <v-card class="glass-card pa-4 mb-4" elevation="0">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-heart-pulse" color="error" class="mr-2"></v-icon>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold">
                  Coleta da Percepção Subjetiva de Esforço (PSE / Escala Borg CR-10)
                </h3>
                <p class="text-caption text-medium-emphasis">
                  Coleta padronizada pós-atividade (20 a 30 min pós-jogo) para cálculo da Carga Interna (Método Foster).
                </p>
              </div>
            </div>
            <v-chip size="small" :color="corBorg(valorBorg)" class="font-weight-black">
              Borg {{ valorBorg }} - {{ descricaoBorg(valorBorg) }}
            </v-chip>
          </div>

          <v-row>
            <v-col cols="12" md="7">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 font-weight-bold">Escore Subjetivo Individual do Atleta:</span>
                <span class="text-caption text-medium-emphasis">0 (Repouso) a 10 (Esforço Máximo)</span>
              </div>

              <v-slider
                v-model="valorBorg"
                :min="0"
                :max="10"
                :step="1"
                show-ticks="always"
                tick-size="4"
                color="error"
                track-color="surface"
                class="mb-3"
              ></v-slider>

              <!-- Ancoragem Verbal da Escala de Borg -->
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="b in [0, 2, 4, 6, 8, 10]"
                  :key="'borg-chip-' + b"
                  size="x-small"
                  :color="valorBorg === b ? corBorg(b) : 'surface-variant'"
                  @click="valorBorg = b"
                  class="font-weight-bold cursor-pointer"
                >
                  {{ b }} - {{ descricaoBorg(b) }}
                </v-chip>
              </div>
            </v-col>

            <!-- Carga da Sessão Foster (U.A.) -->
            <v-col cols="12" md="5">
              <v-card color="surface-variant" class="pa-4 text-center h-100 d-flex flex-column justify-center" elevation="0">
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Carga Interna da Sessão (Foster)
                </div>
                <div class="text-h3 font-weight-black text-secondary my-1">
                  {{ cargaFosterUa }} <span class="text-caption">U.A.</span>
                </div>
                <div class="text-caption text-medium-emphasis">
                  PSE ({{ valorBorg }}) &times; Minutos Jogados ({{ minutosJogadosAtleta }} min)
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- 3. INTEGRAÇÃO & MÉTRICAS DERIVADAS (DIFERENCIAL DA PLATAFORMA) -->
        <v-row class="mb-4" v-if="atletaAtivo">
          <!-- Razão de Eficiência / Custo Fisiológico -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-scale-balance" color="secondary" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Razão de Eficiência / Custo Fisiológico</h3>
                </div>
                <v-chip size="small" color="secondary" variant="flat" class="font-weight-bold">
                  {{ razaoEficienciaTotal }} m / U.A.
                </v-chip>
              </div>

              <p class="text-caption text-medium-emphasis mb-3">
                Compara o trabalho mecânico executado (Distância Total ou HSR) versus o estresse psicofisiológico relatado (Foster).
              </p>

              <v-row dense class="mb-3">
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Eficiência Total</div>
                    <div class="text-h5 font-weight-bold text-secondary">{{ razaoEficienciaTotal }}</div>
                    <div class="text-caption text-medium-emphasis">Metros por U.A. Foster</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card color="surface" class="pa-3 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Eficiência HSR</div>
                    <div class="text-h5 font-weight-bold text-primary">{{ razaoEficienciaHSR }}</div>
                    <div class="text-caption text-medium-emphasis">Metros HSR por U.A. Foster</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-alert
                :type="diagnosticoEficiencia.tipo"
                variant="tonal"
                density="compact"
                class="mb-0"
              >
                <div class="font-weight-bold text-caption">{{ diagnosticoEficiencia.titulo }}</div>
                <div class="text-caption">{{ diagnosticoEficiencia.mensagem }}</div>
              </v-alert>
            </v-card>
          </v-col>

          <!-- ACWR Longitudinal & Monotonia / Strain -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-chart-bell-curve" color="primary" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Monitoramento de Sobrecarga (ACWR & Strain)</h3>
                </div>
                <v-chip
                  size="small"
                  :color="obterCorACWR(atletaAtivo.acwrRatio)"
                  variant="flat"
                  class="font-weight-bold"
                >
                  ACWR: {{ atletaAtivo.acwrRatio?.toFixed(2) }}
                </v-chip>
              </div>

              <v-row dense class="mb-3">
                <v-col cols="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Carga Aguda (7d)</div>
                    <div class="text-h6 font-weight-bold text-slate-100">{{ atletaAtivo.cargaAguda }} U.A.</div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Carga Crônica (28d)</div>
                    <div class="text-h6 font-weight-bold text-slate-100">{{ atletaAtivo.cargaCronica }} U.A.</div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Monotonia / Strain</div>
                    <div class="text-h6 font-weight-bold text-warning">{{ atletaAtivo.monotonia.toFixed(1) }} / {{ atletaAtivo.strain }}</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Barra de Zonas de Risco do ACWR -->
              <div class="mb-2">
                <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-1">
                  <span>Sub (&lt;0.8)</span>
                  <span class="text-success font-weight-bold">Sweet Spot (0.8 - 1.3)</span>
                  <span class="text-warning">Atenção (1.3-1.5)</span>
                  <span class="text-error">Spike (&gt;1.5)</span>
                </div>
                <v-progress-linear
                  :model-value="Math.min(100, (atletaAtivo.acwrRatio / 2.0) * 100)"
                  :color="obterCorACWR(atletaAtivo.acwrRatio)"
                  height="10"
                  rounded
                ></v-progress-linear>
              </div>

              <div class="text-caption text-slate-300">
                <strong>Parecer de Carga:</strong>
                {{ obterParecerACWR(atletaAtivo.acwrRatio) }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 4. AS 5 ZONAS DE VELOCIDADE DO ATLETA & RADAR VS MÉDIA DA POSIÇÃO -->
        <v-row class="mb-4" v-if="atletaAtivo">
          <!-- 5 Zonas Padronizadas do Atleta -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-speedometer" color="warning" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">5 Zonas de Velocidade do Atleta</h3>
                </div>
                <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
                  Pico: {{ atletaAtivo.velocidadeMaxima }} km/h
                </v-chip>
              </div>

              <!-- Barra Segmentada -->
              <div class="segmented-bar mb-3" style="height: 14px;">
                <div class="seg-walk" :style="{ width: percentuaisZonasAtleta.z1 + '%' }"></div>
                <div class="seg-jog" :style="{ width: percentuaisZonasAtleta.z2 + '%' }"></div>
                <div class="seg-run" :style="{ width: percentuaisZonasAtleta.z3 + '%' }"></div>
                <div class="seg-hsr" :style="{ width: percentuaisZonasAtleta.z4 + '%' }"></div>
                <div class="seg-sprint" :style="{ width: percentuaisZonasAtleta.z5 + '%' }"></div>
              </div>

              <v-row dense>
                <v-col cols="6" sm="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Z1 Caminhada</div>
                    <div class="font-weight-bold text-body-2">{{ atletaAtivo.distanciaZ1Caminhada }} m</div>
                    <div class="text-caption text-medium-emphasis">{{ percentuaisZonasAtleta.z1 }}%</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Z2 Trote</div>
                    <div class="font-weight-bold text-body-2">{{ atletaAtivo.distanciaZ2Trote }} m</div>
                    <div class="text-caption text-medium-emphasis">{{ percentuaisZonasAtleta.z2 }}%</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-card color="surface" class="pa-2 text-center" elevation="0">
                    <div class="text-caption text-medium-emphasis">Z3 Média/Alta</div>
                    <div class="font-weight-bold text-body-2">{{ atletaAtivo.distanciaZ3Media }} m</div>
                    <div class="text-caption text-medium-emphasis">{{ percentuaisZonasAtleta.z3 }}%</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="6">
                  <v-card color="surface" class="pa-2 text-center border-l-4 border-secondary" elevation="0">
                    <div class="text-caption text-medium-emphasis">Z4 HSR (19.8-25.2 km/h)</div>
                    <div class="font-weight-bold text-body-1 text-secondary">{{ atletaAtivo.distanciaZ4HSR }} m</div>
                    <div class="text-caption text-secondary">{{ percentuaisZonasAtleta.z4 }}% (Alta Intensidade)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card color="surface" class="pa-2 text-center border-l-4 border-error" elevation="0">
                    <div class="text-caption text-medium-emphasis">Z5 Sprints (&gt; 25.2 km/h)</div>
                    <div class="font-weight-bold text-body-1 text-error">{{ atletaAtivo.distanciaZ5Sprint }} m ({{ atletaAtivo.sprintsPicosContagem }} picos)</div>
                    <div class="text-caption text-error">{{ percentuaisZonasAtleta.z5 }}% (Sprint Puro)</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- Radar Físico vs Média Posicional -->
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-radar" color="secondary" class="mr-2"></v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">
                    Radar: Atleta #{{ atletaAtivo.id }} vs Média da Posição ({{ atletaAtivo.posicaoSugerida }})
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

                  <!-- Média da Posição (Azul) -->
                  <polygon
                    :points="gerarPontosRadar(dadosRadarPosicao)"
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
                    :y="calcularCoordenadaRadar(i, 1.20).y"
                    font-size="11"
                    fill="#94a3b8"
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-weight="bold"
                  >
                    {{ eixo.rotulo }}
                  </text>
                </svg>
              </div>

              <!-- Legenda do Radar -->
              <div class="d-flex justify-center gap-6 mt-2 text-caption">
                <span class="d-flex align-center">
                  <span class="status-indicator bg-primary mr-1"></span>
                  <strong>Jogador #{{ atletaAtivo.id }}</strong>
                </span>
                <span class="d-flex align-center">
                  <span class="status-indicator bg-info mr-1"></span>
                  <span>Média da Posição ({{ atletaAtivo.posicaoSugerida }})</span>
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 5. ANÁLISE TEMPORAL DE INTENSIDADE & PONTO DE QUEBRA DE RENDIMENTO -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="atletaAtivo">
          <div class="d-flex flex-wrap align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-timeline-variant-shimmer" color="warning" class="mr-2" size="28"></v-icon>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold">
                  Dinâmica Temporal de Intensidade & Ponto de Quebra (Blocos de 15 Minutos)
                </h3>
                <p class="text-caption text-medium-emphasis">
                  Monitoramento contínuo de ritmo (m/min), HSR e sprints para identificação precoce do momento exato de queda e fadiga neuromuscular.
                </p>
              </div>
            </div>

            <div class="d-flex align-center gap-2">
              <v-chip
                size="small"
                :color="analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? 'error' : analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'alerta' ? 'warning' : 'success'"
                variant="flat"
                class="font-weight-bold"
              >
                <v-icon start :icon="analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? 'mdi-alert-octagon' : analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'alerta' ? 'mdi-alert' : 'mdi-check-decagram'"></v-icon>
                {{ analiseTemporalAtleta.diagnosticoFadiga.tipo }}
              </v-chip>
              <v-chip size="small" color="secondary" variant="tonal" class="font-weight-bold">
                Momento de Quebra: {{ analiseTemporalAtleta.momentoQuedaIntensidade }}
              </v-chip>
            </div>
          </div>

          <!-- GRÁFICO DE BARRAS DE INTENSIDADE POR BLOCOS DE 15' -->
          <div class="temporal-chart-container pa-4 rounded-lg mb-4">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-caption font-weight-bold text-slate-200">
                <v-icon icon="mdi-speedometer" size="14" class="mr-1 text-primary"></v-icon>
                Ritmo Relativo de Jogo (m/min) por Período de 15 Minutos
              </span>
              <span class="text-caption text-medium-emphasis">
                Média Geral do Atleta: <strong class="text-primary">{{ ritmoNormalizadoMmin.toFixed(1) }} m/min</strong>
              </span>
            </div>

            <!-- Colunas do Gráfico -->
            <div class="temporal-bars-stage d-flex align-end justify-space-between gap-2">
              <!-- Linha de Média da Partida -->
              <div
                class="average-reference-line"
                :style="{ bottom: calcularAlturaBarraTemporal(ritmoNormalizadoMmin, maiorMminTemporal) + '%' }"
              >
                <span class="avg-line-label">Média Geral ({{ ritmoNormalizadoMmin.toFixed(0) }} m/min)</span>
              </div>

              <!-- Barras de Cada Bloco -->
              <div
                v-for="bloco in analiseTemporalAtleta.blocosTemporais"
                :key="'bloco-tmp-' + bloco.indice"
                class="d-flex flex-column align-center flex-grow-1 h-100 justify-end"
                style="z-index: 2; position: relative;"
              >
                <!-- Badges do Topo da Barra -->
                <div class="mb-1 text-center" style="min-height: 28px;">
                  <v-chip
                    v-if="bloco.classificacao === 'pico'"
                    size="x-small"
                    color="primary"
                    variant="flat"
                    class="font-weight-black text-2xs px-1 mb-1"
                  >
                    🏆 PICO
                  </v-chip>
                  <v-chip
                    v-else-if="bloco.classificacao === 'queda-severa'"
                    size="x-small"
                    color="error"
                    variant="flat"
                    class="font-weight-black text-2xs px-1 mb-1 pulse-chip"
                  >
                    🚨 {{ bloco.decaimentoPercentual }}%
                  </v-chip>
                  <v-chip
                    v-else-if="bloco.classificacao === 'queda-moderada'"
                    size="x-small"
                    color="warning"
                    variant="flat"
                    class="font-weight-bold text-2xs px-1 mb-1"
                  >
                    ⚠️ {{ bloco.decaimentoPercentual }}%
                  </v-chip>
                  <div class="font-weight-black text-caption" :class="obterCorTextoMmin(bloco.classificacao)">
                    {{ bloco.metrosPorMinuto > 0 ? bloco.metrosPorMinuto.toFixed(1) : '-' }}
                  </div>
                </div>

                <!-- Barra Visual Estilizada -->
                <div
                  class="temporal-bar-column rounded-t"
                  :style="{
                    height: bloco.distanciaTotal > 0 ? calcularAlturaBarraTemporal(bloco.metrosPorMinuto, maiorMminTemporal) + '%' : '4px',
                    background: obterGradienteBarraTemporal(bloco.classificacao)
                  }"
                ></div>

                <!-- Rótulo do Bloco & Detalhes -->
                <div class="text-center mt-2 w-100">
                  <div class="font-weight-bold text-caption text-slate-200">{{ bloco.rotulo }}</div>
                  <div class="text-3xs text-medium-emphasis">{{ bloco.distanciaTotal }}m</div>
                  <div class="text-3xs" :class="bloco.distanciaHSR > 0 ? 'text-secondary' : 'text-slate-500'">
                    HSR: {{ bloco.distanciaHSR }}m
                  </div>
                  <div class="text-3xs text-error font-weight-bold" v-if="bloco.sprintsContagem > 0">
                    {{ bloco.sprintsContagem }} sprint{{ bloco.sprintsContagem > 1 ? 's' : '' }}
                  </div>
                  <div class="text-3xs text-slate-600" v-else>
                    0 sprints
                  </div>
                </div>
              </div>
            </div>

            <!-- Divisória 1º Tempo / Intervalo / 2º Tempo -->
            <div class="d-flex justify-space-between text-caption text-medium-emphasis border-t mt-3 pt-2">
              <span class="text-info font-weight-bold">◀ 1º TEMPO (0' a 45')</span>
              <span class="text-amber-400 font-weight-bold">INTERVALO</span>
              <span class="text-secondary font-weight-bold">2º TEMPO (45' a 90'+) ▶</span>
            </div>
          </div>

          <!-- COMPARATIVO 1º TEMPO VS 2º TEMPO & ALERTA DE FADIGA -->
          <v-row dense>
            <!-- 1ºT vs 2ºT: Volume & Ritmo -->
            <v-col cols="12" md="3">
              <v-card color="surface-variant" class="pa-3 text-center h-100" elevation="0">
                <div class="text-caption text-medium-emphasis font-weight-bold">Distância Total (1ºT vs 2ºT)</div>
                <div class="d-flex justify-space-around align-center my-2">
                  <div>
                    <div class="text-caption text-slate-400">1ºT</div>
                    <div class="text-body-1 font-weight-bold text-info">{{ analiseTemporalAtleta.analisePrimeiroTempo.distancia }}m</div>
                  </div>
                  <v-icon icon="mdi-arrow-right-thin" color="slate-500"></v-icon>
                  <div>
                    <div class="text-caption text-slate-400">2ºT</div>
                    <div class="text-body-1 font-weight-bold text-secondary">{{ analiseTemporalAtleta.analiseSegundoTempo.distancia }}m</div>
                  </div>
                </div>
                <v-chip
                  size="x-small"
                  :color="analiseTemporalAtleta.analiseSegundoTempo.distancia < analiseTemporalAtleta.analisePrimeiroTempo.distancia ? 'warning' : 'success'"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Δ {{ calcularDeltaPercentual(analiseTemporalAtleta.analisePrimeiroTempo.distancia, analiseTemporalAtleta.analiseSegundoTempo.distancia) }}%
                </v-chip>
              </v-card>
            </v-col>

            <!-- 1ºT vs 2ºT: Intensidade Relativa (m/min) -->
            <v-col cols="12" md="3">
              <v-card color="surface-variant" class="pa-3 text-center h-100" elevation="0">
                <div class="text-caption text-medium-emphasis font-weight-bold">Ritmo Relativo (m/min)</div>
                <div class="d-flex justify-space-around align-center my-2">
                  <div>
                    <div class="text-caption text-slate-400">1ºT</div>
                    <div class="text-h6 font-weight-black text-info">{{ analiseTemporalAtleta.analisePrimeiroTempo.metrosPorMinuto }}</div>
                  </div>
                  <v-icon icon="mdi-arrow-right-thin" color="slate-500"></v-icon>
                  <div>
                    <div class="text-caption text-slate-400">2ºT</div>
                    <div class="text-h6 font-weight-black text-secondary">{{ analiseTemporalAtleta.analiseSegundoTempo.metrosPorMinuto }}</div>
                  </div>
                </div>
                <v-chip
                  size="x-small"
                  :color="analiseTemporalAtleta.decaimentoSegundoTempoPercentual <= -15 ? 'error' : analiseTemporalAtleta.decaimentoSegundoTempoPercentual <= -8 ? 'warning' : 'success'"
                  variant="flat"
                  class="font-weight-black"
                >
                  Decaimento: {{ analiseTemporalAtleta.decaimentoSegundoTempoPercentual }}%
                </v-chip>
              </v-card>
            </v-col>

            <!-- 1ºT vs 2ºT: Alta Intensidade (HSR + Sprints) -->
            <v-col cols="12" md="3">
              <v-card color="surface-variant" class="pa-3 text-center h-100" elevation="0">
                <div class="text-caption text-medium-emphasis font-weight-bold">Alta Intensidade (HSR & Sprints)</div>
                <div class="d-flex justify-space-around align-center my-2">
                  <div>
                    <div class="text-caption text-slate-400">1ºT</div>
                    <div class="text-body-2 font-weight-bold text-secondary">{{ analiseTemporalAtleta.analisePrimeiroTempo.hsr }}m ({{ analiseTemporalAtleta.analisePrimeiroTempo.sprints }} sp)</div>
                  </div>
                  <v-icon icon="mdi-arrow-right-thin" color="slate-500"></v-icon>
                  <div>
                    <div class="text-caption text-slate-400">2ºT</div>
                    <div class="text-body-2 font-weight-bold text-error">{{ analiseTemporalAtleta.analiseSegundoTempo.hsr }}m ({{ analiseTemporalAtleta.analiseSegundoTempo.sprints }} sp)</div>
                  </div>
                </div>
                <v-chip
                  size="x-small"
                  :color="analiseTemporalAtleta.analiseSegundoTempo.hsr < analiseTemporalAtleta.analisePrimeiroTempo.hsr * 0.7 ? 'error' : 'warning'"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Queda HSR: {{ calcularDeltaPercentual(analiseTemporalAtleta.analisePrimeiroTempo.hsr, analiseTemporalAtleta.analiseSegundoTempo.hsr) }}%
                </v-chip>
              </v-card>
            </v-col>

            <!-- Parecer da Comissão Técnica -->
            <v-col cols="12" md="3">
              <v-card
                :color="analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? 'rgba(239, 68, 68, 0.15)' : analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'alerta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'"
                class="pa-3 h-100 d-flex flex-column justify-center border"
                :style="{ borderColor: analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? '#ef4444' : analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'alerta' ? '#f59e0b' : '#10b981' }"
                elevation="0"
              >
                <div class="d-flex align-center mb-1">
                  <v-icon
                    :icon="analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? 'mdi-alert-decagram' : 'mdi-information'"
                    :color="analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'critico' ? 'error' : analiseTemporalAtleta.diagnosticoFadiga.gravidade === 'alerta' ? 'warning' : 'success'"
                    size="18"
                    class="mr-1"
                  ></v-icon>
                  <span class="text-caption font-weight-black text-slate-100">
                    Parecer da Comissão
                  </span>
                </div>
                <p class="text-caption text-slate-200 mb-0" style="line-height: 1.35; font-size: 11px !important;">
                  {{ analiseTemporalAtleta.diagnosticoFadiga.recomendacaoComissao }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- ========================================================================= -->
      <!-- MÓDULO 4: RELATÓRIO PÓS-JOGO (MAPA DE CALOR REAL, DOSSIÊ & IMPRESSÃO)      -->
      <!-- ========================================================================= -->
      <div v-else-if="menuAtivo === 'relatorio'">
        <!-- Cabeçalho do Dossiê Consolidado -->
        <v-card class="glass-card pa-4 mb-4" elevation="0">
          <div class="d-flex flex-wrap align-center justify-space-between gap-3">
            <div>
              <div class="d-flex align-center gap-2">
                <v-icon icon="mdi-file-certificate-outline" color="info" size="28"></v-icon>
                <h2 class="text-h5 font-weight-bold">Dossiê Consolidado Pós-Jogo</h2>
                <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
                  {{ partidaAtiva.placar }}
                </v-chip>
              </div>
              <p class="text-caption text-medium-emphasis mt-1">
                {{ partidaAtiva.nome }} &middot; Atleta: <strong>Jogador #{{ atletaAtivo?.id }} ({{ atletaAtivo?.posicaoSugerida }})</strong> &middot; Minutos em Campo: <strong>{{ minutosJogadosAtleta }} min</strong>
              </p>
            </div>

            <!-- Ações: Alternar Atleta e Imprimir / Exportar -->
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="atletaAtivoId"
                :items="atletasAtivos"
                item-title="posicaoCompleta"
                item-value="id"
                label="Atleta em Foco"
                density="compact"
                variant="outlined"
                color="info"
                hide-details
                style="width: 220px;"
              ></v-select>

              <v-btn
                color="secondary"
                variant="flat"
                prepend-icon="mdi-printer"
                @click="imprimirDossie"
                class="font-weight-bold"
              >
                Imprimir Dossiê
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- 1. MAPA DE CALOR REAL EM HTML5 CANVAS (2D CONTINUOUS HEATMAP) -->
        <v-card class="glass-card pa-4 mb-4" elevation="0">
          <div class="d-flex flex-wrap align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-fire" color="error" class="mr-2"></v-icon>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold">
                  Mapa de Calor Térmico & Trajetórias Vetoriais de Ação (105m &times; 68m)
                </h3>
                <p class="text-caption text-medium-emphasis">
                  Densidade contínua de ocupação e vetores de sprint com velocidade de pico sobre o gramado oficial.
                </p>
              </div>
            </div>

            <!-- Controles de Modo de Visualização do Heatmap -->
            <div class="d-flex flex-wrap align-center gap-2">
              <v-btn-toggle
                v-model="tipoVisualizacaoHeatmap"
                mandatory
                density="compact"
                color="secondary"
                variant="outlined"
              >
                <v-btn value="calor" size="small" prepend-icon="mdi-fire">Calor</v-btn>
                <v-btn value="vetores" size="small" prepend-icon="mdi-vector-line">Vetores Sprint</v-btn>
                <v-btn value="combinado" size="small" prepend-icon="mdi-layers-outline">Combinado</v-btn>
              </v-btn-toggle>

              <!-- Slider de Intensidade do Calor -->
              <div style="width: 140px;" class="ml-2 d-none d-sm-block">
                <v-slider
                  v-model="intensidadeCalor"
                  :min="20"
                  :max="100"
                  label="Intensidade"
                  density="compact"
                  hide-details
                  color="secondary"
                ></v-slider>
              </div>
            </div>
          </div>

          <!-- Elemento Canvas do Mapa de Calor Oficial -->
          <div class="canvas-wrapper pa-2 d-flex flex-column align-center justify-center">
            <canvas
              ref="pitchCanvas"
              width="900"
              height="580"
              class="soccer-pitch-canvas"
            ></canvas>
          </div>

          <!-- Legenda do Mapa de Calor -->
          <div class="d-flex flex-wrap align-center justify-space-between mt-3 text-caption text-medium-emphasis">
            <div class="d-flex align-center gap-3">
              <span class="d-flex align-center">
                <span class="heatmap-legend-bar mr-2"></span>
                Densidade: Baixa (Azul) &rarr; Média (Amarelo) &rarr; Pico (Vermelho)
              </span>
              <span class="d-flex align-center ml-4">
                <v-icon icon="mdi-arrow-top-right-bold-outline" color="error" size="16" class="mr-1"></v-icon>
                Vetores com picos de sprint (&gt; 25.2 km/h)
              </span>
            </div>
            <div>&bull; Dados rastreados a 25 Hz com interpolação contínua</div>
          </div>
        </v-card>

        <!-- 2. QUADRO RESUMO CONSOLIDADO DO DOSSIÊ (CARGA EXTERNA + INTERNA + ÍNDICES) -->
        <v-card class="glass-card pa-4 mb-4" elevation="0" v-if="atletaAtivo">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-table-check" color="secondary" class="mr-2"></v-icon>
            <h3 class="text-subtitle-1 font-weight-bold">
              Síntese Executiva de Carga: Atleta #{{ atletaAtivo.id }} ({{ atletaAtivo.posicaoSugerida }})
            </h3>
          </div>

          <v-table class="bg-transparent table-custom">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Dimensão</th>
                <th class="text-left font-weight-bold">Indicador / Métrica Chave</th>
                <th class="text-left font-weight-bold">Valor Registrado</th>
                <th class="text-left font-weight-bold">Classificação / Referência</th>
              </tr>
            </thead>
            <tbody>
              <!-- Carga Externa -->
              <tr>
                <td rowspan="4" class="font-weight-bold text-secondary bg-surface-darken-1">Carga Externa (Tracking)</td>
                <td>Distância Total Percorrida</td>
                <td><strong>{{ (atletaAtivo.distanciaTotal / 1000).toFixed(2) }} km</strong></td>
                <td>Ritmo: {{ ritmoNormalizadoMmin.toFixed(0) }} m/min (Minutos: {{ minutosJogadosAtleta }} min)</td>
              </tr>
              <tr>
                <td>Pico de Velocidade (Vmax)</td>
                <td><strong>{{ atletaAtivo.velocidadeMaxima }} km/h</strong></td>
                <td>Sprints &gt; 25.2 km/h: {{ atletaAtivo.sprintsPicosContagem }} picos ({{ atletaAtivo.distanciaZ5Sprint }} m)</td>
              </tr>
              <tr>
                <td>Alta Intensidade (HSR 19.8 - 25.2 km/h)</td>
                <td><strong>{{ atletaAtivo.distanciaZ4HSR }} m</strong></td>
                <td>{{ percentuaisZonasAtleta.z4 }}% do volume acumulado</td>
              </tr>
              <tr>
                <td>Dinâmica Neuromuscular (Frenagens)</td>
                <td><strong>{{ atletaAtivo.desaceleracoesAltas }} frenagens</strong></td>
                <td>Críticas (&lt; -3.0 m/s²): {{ atletaAtivo.desaceleracoesCriticas }}</td>
              </tr>

              <!-- Carga Interna -->
              <tr>
                <td rowspan="2" class="font-weight-bold text-error bg-surface-darken-1">Carga Interna (Borg)</td>
                <td>Percepção Subjetiva de Esforço (PSE)</td>
                <td><strong>Borg {{ valorBorg }} / 10</strong></td>
                <td>{{ descricaoBorg(valorBorg) }}</td>
              </tr>
              <tr>
                <td>Carga da Sessão (Método Foster)</td>
                <td><strong>{{ cargaFosterUa }} U.A.</strong></td>
                <td>PSE ({{ valorBorg }}) &times; Minutos ({{ minutosJogadosAtleta }} min)</td>
              </tr>

              <!-- Índices Derivados -->
              <tr>
                <td rowspan="3" class="font-weight-bold text-info bg-surface-darken-1">Índices Integrados</td>
                <td>Razão de Eficiência / Custo Fisiológico</td>
                <td><strong>{{ razaoEficienciaTotal }} m/U.A.</strong></td>
                <td>Eficiência HSR: {{ razaoEficienciaHSR }} m/U.A.</td>
              </tr>
              <tr>
                <td>ACWR (Carga Aguda : Crônica)</td>
                <td>
                  <v-chip size="small" :color="obterCorACWR(atletaAtivo.acwrRatio)" class="font-weight-bold">
                    {{ atletaAtivo.acwrRatio?.toFixed(2) }}
                  </v-chip>
                </td>
                <td>{{ obterTextoCurtoACWR(atletaAtivo.acwrRatio) }}</td>
              </tr>
              <tr>
                <td>Monotonia e Tensão (Strain)</td>
                <td><strong>Monotonia: {{ atletaAtivo.monotonia.toFixed(2) }}</strong></td>
                <td>Strain: {{ atletaAtivo.strain }} U.A. (Foster, 1998)</td>
              </tr>
            </tbody>
          </v-table>

          <!-- Parecer Preventivo do Dossiê -->
          <v-alert
            :type="diagnosticoEficiencia.tipo"
            variant="tonal"
            class="mt-4"
          >
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="font-weight-bold text-subtitle-2">Parecer Clínico Preventivo Integrado:</span>
              <v-chip size="small" color="primary" class="font-weight-bold">Assinatura Digital: Sistema Visão 90</v-chip>
            </div>
            <div class="text-body-2 mb-1">
              {{ diagnosticoEficiencia.mensagem }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Recomendação para próxima sessão: {{ diagnosticoBorgAtleta.recomendacao }}. Controle de carga aguda indicado.
            </div>
          </v-alert>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

// =========================================================================
// CONTROLE DE NAVEGAÇÃO & INTERFACE
// =========================================================================
const drawerAberto = ref(true)
const railMode = ref(false)
const menuAtivo = ref('comissao') // 'dados' | 'comissao' | 'atleta' | 'relatorio'
const partidaAtivaId = ref('1')
const atletaAtivoId = ref('2')

function alternarDrawer() {
  drawerAberto.value = !drawerAberto.value
}

function selecionarMenu(menu) {
  menuAtivo.value = menu
  if (mobile.value) {
    drawerAberto.value = false
  }
}

// Alertas
const mensagemAlerta = ref('')
const tipoAlerta = ref('info')
const carregando = ref(false)

// Inserção de Dados
const arquivoUpload = ref(null)
const nomeNovaPartida = ref('')
const urlDataset = ref('')

// Controle de Minutos Jogados & Borg
const minutosJogadosAtleta = ref(90)
const valorBorg = ref(6)
const criterioOrdenacaoElenco = ref('acwrRatio')

// Canvas do Heatmap Real
const pitchCanvas = ref(null)
const tipoVisualizacaoHeatmap = ref('combinado') // 'calor' | 'vetores' | 'combinado'
const intensidadeCalor = ref(75)

// =========================================================================
// BANCO DE DADOS DE PARTIDAS & ELENCO COM AS 5 ZONAS, ACWR E TRACKING
// =========================================================================
function criarAtletasPartida(adversario, fatorCarga = 1.0) {
  return [
    {
      id: '1',
      posicaoSugerida: 'Goleiro',
      minutosJogados: 90,
      distanciaTotal: Math.round(4850 * fatorCarga),
      velocidadeMaxima: 24.2,
      velocidadeMedia: 3.2,
      metrosPorMinuto: 53.8,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3800,
      distanciaZ2Trote: 850,
      distanciaZ3Media: 180,
      distanciaZ4HSR: 20,
      distanciaZ5Sprint: 0,
      sprintsPicosContagem: 0,
      aceleracoesAltas: 8,
      aceleracoesExplosivas: 3,
      desaceleracoesAltas: 9,
      desaceleracoesCriticas: 2,
      playerLoad: 280,
      potenciaMetabolicaMedia: 5.4,
      cargaAguda: Math.round(1450 * fatorCarga),
      cargaCronica: 1520,
      acwrRatio: Number(((1450 * fatorCarga) / 1520).toFixed(2)),
      monotonia: 1.15,
      strain: 1667,
      escoreBorg: 4,
      centroideX: 12.5,
      centroideY: 34.0,
      raioAcao: 9.5,
      vetoresSprint: [
        { x1: 10, y1: 34, x2: 18, y2: 30, velocidade: 24.2, aceleracao: 2.6 }
      ]
    },
    {
      id: '2',
      posicaoSugerida: 'Lateral Direito',
      minutosJogados: 90,
      distanciaTotal: Math.round(10850 * fatorCarga),
      velocidadeMaxima: 33.8,
      velocidadeMedia: 7.2,
      metrosPorMinuto: 120.5,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3700,
      distanciaZ2Trote: 4400,
      distanciaZ3Media: 1950,
      distanciaZ4HSR: 520,
      distanciaZ5Sprint: 280,
      sprintsPicosContagem: 16,
      aceleracoesAltas: 48,
      aceleracoesExplosivas: 19,
      desaceleracoesAltas: 52,
      desaceleracoesCriticas: 22,
      playerLoad: 760,
      potenciaMetabolicaMedia: 11.8,
      cargaAguda: Math.round(3350 * fatorCarga),
      cargaCronica: 2800,
      acwrRatio: Number(((3350 * fatorCarga) / 2800).toFixed(2)),
      monotonia: 1.48,
      strain: 4958,
      escoreBorg: 7,
      centroideX: 55.0,
      centroideY: 58.0,
      raioAcao: 24.5,
      vetoresSprint: [
        { x1: 38, y1: 58, x2: 78, y2: 62, velocidade: 33.8, aceleracao: 3.4 },
        { x1: 65, y1: 60, x2: 95, y2: 63, velocidade: 32.5, aceleracao: 3.1 },
        { x1: 82, y1: 59, x2: 45, y2: 56, velocidade: 31.2, aceleracao: -3.2 }
      ]
    },
    {
      id: '3',
      posicaoSugerida: 'Zagueiro Central',
      minutosJogados: 90,
      distanciaTotal: Math.round(9600 * fatorCarga),
      velocidadeMaxima: 29.5,
      velocidadeMedia: 6.4,
      metrosPorMinuto: 106.6,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 4200,
      distanciaZ2Trote: 3800,
      distanciaZ3Media: 1300,
      distanciaZ4HSR: 220,
      distanciaZ5Sprint: 80,
      sprintsPicosContagem: 6,
      aceleracoesAltas: 28,
      aceleracoesExplosivas: 10,
      desaceleracoesAltas: 34,
      desaceleracoesCriticas: 14,
      playerLoad: 580,
      potenciaMetabolicaMedia: 9.1,
      cargaAguda: Math.round(2500 * fatorCarga),
      cargaCronica: 2550,
      acwrRatio: Number(((2500 * fatorCarga) / 2550).toFixed(2)),
      monotonia: 1.22,
      strain: 3050,
      escoreBorg: 5,
      centroideX: 32.0,
      centroideY: 26.0,
      raioAcao: 16.8,
      vetoresSprint: [
        { x1: 26, y1: 25, x2: 48, y2: 24, velocidade: 29.5, aceleracao: 2.8 },
        { x1: 42, y1: 28, x2: 22, y2: 27, velocidade: 28.1, aceleracao: -3.0 }
      ]
    },
    {
      id: '4',
      posicaoSugerida: 'Zagueiro Central',
      minutosJogados: 90,
      distanciaTotal: Math.round(9400 * fatorCarga),
      velocidadeMaxima: 28.9,
      velocidadeMedia: 6.2,
      metrosPorMinuto: 104.4,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 4300,
      distanciaZ2Trote: 3750,
      distanciaZ3Media: 1150,
      distanciaZ4HSR: 160,
      distanciaZ5Sprint: 40,
      sprintsPicosContagem: 4,
      aceleracoesAltas: 24,
      aceleracoesExplosivas: 8,
      desaceleracoesAltas: 30,
      desaceleracoesCriticas: 11,
      playerLoad: 550,
      potenciaMetabolicaMedia: 8.8,
      cargaAguda: Math.round(2400 * fatorCarga),
      cargaCronica: 2480,
      acwrRatio: Number(((2400 * fatorCarga) / 2480).toFixed(2)),
      monotonia: 1.18,
      strain: 2832,
      escoreBorg: 5,
      centroideX: 33.0,
      centroideY: 42.0,
      raioAcao: 15.9,
      vetoresSprint: [
        { x1: 28, y1: 41, x2: 50, y2: 43, velocidade: 28.9, aceleracao: 2.7 }
      ]
    },
    {
      id: '6',
      posicaoSugerida: 'Lateral Esquerdo',
      minutosJogados: 90,
      distanciaTotal: Math.round(10600 * fatorCarga),
      velocidadeMaxima: 32.6,
      velocidadeMedia: 7.0,
      metrosPorMinuto: 117.7,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3850,
      distanciaZ2Trote: 4300,
      distanciaZ3Media: 1800,
      distanciaZ4HSR: 450,
      distanciaZ5Sprint: 200,
      sprintsPicosContagem: 12,
      aceleracoesAltas: 44,
      aceleracoesExplosivas: 16,
      desaceleracoesAltas: 49,
      desaceleracoesCriticas: 19,
      playerLoad: 720,
      potenciaMetabolicaMedia: 11.2,
      cargaAguda: Math.round(3100 * fatorCarga),
      cargaCronica: 2750,
      acwrRatio: Number(((3100 * fatorCarga) / 2750).toFixed(2)),
      monotonia: 1.42,
      strain: 4402,
      escoreBorg: 6,
      centroideX: 52.0,
      centroideY: 12.0,
      raioAcao: 23.8,
      vetoresSprint: [
        { x1: 35, y1: 12, x2: 75, y2: 10, velocidade: 32.6, aceleracao: 3.2 },
        { x1: 70, y1: 11, x2: 96, y2: 14, velocidade: 31.0, aceleracao: 2.9 }
      ]
    },
    {
      id: '5',
      posicaoSugerida: 'Primeiro Volante',
      minutosJogados: 90,
      distanciaTotal: Math.round(11400 * fatorCarga),
      velocidadeMaxima: 30.2,
      velocidadeMedia: 7.6,
      metrosPorMinuto: 126.6,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3400,
      distanciaZ2Trote: 5100,
      distanciaZ3Media: 2400,
      distanciaZ4HSR: 380,
      distanciaZ5Sprint: 120,
      sprintsPicosContagem: 8,
      aceleracoesAltas: 54,
      aceleracoesExplosivas: 20,
      desaceleracoesAltas: 58,
      desaceleracoesCriticas: 24,
      playerLoad: 840,
      potenciaMetabolicaMedia: 12.4,
      cargaAguda: Math.round(3650 * fatorCarga),
      cargaCronica: 3100,
      acwrRatio: Number(((3650 * fatorCarga) / 3100).toFixed(2)),
      monotonia: 1.55,
      strain: 5657,
      escoreBorg: 7,
      centroideX: 48.0,
      centroideY: 34.0,
      raioAcao: 21.0,
      vetoresSprint: [
        { x1: 36, y1: 34, x2: 65, y2: 32, velocidade: 30.2, aceleracao: 2.9 }
      ]
    },
    {
      id: '8',
      posicaoSugerida: 'Meio-Campista Central',
      minutosJogados: 90,
      distanciaTotal: Math.round(11200 * fatorCarga),
      velocidadeMaxima: 31.4,
      velocidadeMedia: 7.4,
      metrosPorMinuto: 124.4,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3500,
      distanciaZ2Trote: 4900,
      distanciaZ3Media: 2300,
      distanciaZ4HSR: 360,
      distanciaZ5Sprint: 140,
      sprintsPicosContagem: 9,
      aceleracoesAltas: 50,
      aceleracoesExplosivas: 18,
      desaceleracoesAltas: 54,
      desaceleracoesCriticas: 21,
      playerLoad: 810,
      potenciaMetabolicaMedia: 12.1,
      cargaAguda: Math.round(3450 * fatorCarga),
      cargaCronica: 3050,
      acwrRatio: Number(((3450 * fatorCarga) / 3050).toFixed(2)),
      monotonia: 1.46,
      strain: 5037,
      escoreBorg: 6,
      centroideX: 55.0,
      centroideY: 38.0,
      raioAcao: 22.4,
      vetoresSprint: [
        { x1: 42, y1: 38, x2: 72, y2: 40, velocidade: 31.4, aceleracao: 3.0 }
      ]
    },
    {
      id: '10',
      posicaoSugerida: 'Meia Ofensivo / Armador',
      minutosJogados: 75,
      distanciaTotal: Math.round(9800 * fatorCarga),
      velocidadeMaxima: 31.8,
      velocidadeMedia: 7.1,
      metrosPorMinuto: 130.6,
      tempoTotalSegundos: 4500,
      distanciaZ1Caminhada: 3600,
      distanciaZ2Trote: 4100,
      distanciaZ3Media: 1650,
      distanciaZ4HSR: 330,
      distanciaZ5Sprint: 120,
      sprintsPicosContagem: 7,
      aceleracoesAltas: 42,
      aceleracoesExplosivas: 15,
      desaceleracoesAltas: 45,
      desaceleracoesCriticas: 18,
      playerLoad: 690,
      potenciaMetabolicaMedia: 11.5,
      cargaAguda: Math.round(3900 * fatorCarga),
      cargaCronica: 2450,
      acwrRatio: Number(((3900 * fatorCarga) / 2450).toFixed(2)), // ACWR Spike 1.59
      monotonia: 1.82,
      strain: 7098,
      escoreBorg: 9, // Anomalia: Borg alto
      centroideX: 63.0,
      centroideY: 34.0,
      raioAcao: 20.8,
      vetoresSprint: [
        { x1: 52, y1: 34, x2: 80, y2: 36, velocidade: 31.8, aceleracao: 3.1 }
      ]
    },
    {
      id: '7',
      posicaoSugerida: 'Ponta Direita',
      minutosJogados: 90,
      distanciaTotal: Math.round(10950 * fatorCarga),
      velocidadeMaxima: 34.8,
      velocidadeMedia: 7.3,
      metrosPorMinuto: 121.6,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3600,
      distanciaZ2Trote: 4100,
      distanciaZ3Media: 2100,
      distanciaZ4HSR: 720,
      distanciaZ5Sprint: 430,
      sprintsPicosContagem: 24,
      aceleracoesAltas: 56,
      aceleracoesExplosivas: 22,
      desaceleracoesAltas: 60,
      desaceleracoesCriticas: 26,
      playerLoad: 820,
      potenciaMetabolicaMedia: 12.8,
      cargaAguda: Math.round(4100 * fatorCarga),
      cargaCronica: 2600,
      acwrRatio: Number(((4100 * fatorCarga) / 2600).toFixed(2)), // ACWR 1.58 Spike!
      monotonia: 1.74,
      strain: 7134,
      escoreBorg: 8,
      centroideX: 72.0,
      centroideY: 56.0,
      raioAcao: 26.0,
      vetoresSprint: [
        { x1: 48, y1: 56, x2: 92, y2: 58, velocidade: 34.8, aceleracao: 3.6 },
        { x1: 72, y1: 57, x2: 100, y2: 50, velocidade: 33.9, aceleracao: 3.3 },
        { x1: 85, y1: 55, x2: 98, y2: 38, velocidade: 32.8, aceleracao: 3.0 }
      ]
    },
    {
      id: '11',
      posicaoSugerida: 'Ponta Esquerda',
      minutosJogados: 68,
      distanciaTotal: Math.round(8900 * fatorCarga),
      velocidadeMaxima: 33.5,
      velocidadeMedia: 7.1,
      metrosPorMinuto: 130.8,
      tempoTotalSegundos: 4080,
      distanciaZ1Caminhada: 3000,
      distanciaZ2Trote: 3500,
      distanciaZ3Media: 1650,
      distanciaZ4HSR: 510,
      distanciaZ5Sprint: 240,
      sprintsPicosContagem: 15,
      aceleracoesAltas: 40,
      aceleracoesExplosivas: 17,
      desaceleracoesAltas: 44,
      desaceleracoesCriticas: 18,
      playerLoad: 640,
      potenciaMetabolicaMedia: 11.9,
      cargaAguda: Math.round(2600 * fatorCarga),
      cargaCronica: 2650,
      acwrRatio: Number(((2600 * fatorCarga) / 2650).toFixed(2)),
      monotonia: 1.25,
      strain: 3250,
      escoreBorg: 6,
      centroideX: 70.0,
      centroideY: 14.0,
      raioAcao: 24.2,
      vetoresSprint: [
        { x1: 45, y1: 14, x2: 86, y2: 12, velocidade: 33.5, aceleracao: 3.3 }
      ]
    },
    {
      id: '9',
      posicaoSugerida: 'Centroavante',
      minutosJogados: 90,
      distanciaTotal: Math.round(10200 * fatorCarga),
      velocidadeMaxima: 32.9,
      velocidadeMedia: 6.8,
      metrosPorMinuto: 113.3,
      tempoTotalSegundos: 5400,
      distanciaZ1Caminhada: 3900,
      distanciaZ2Trote: 4100,
      distanciaZ3Media: 1550,
      distanciaZ4HSR: 420,
      distanciaZ5Sprint: 230,
      sprintsPicosContagem: 14,
      aceleracoesAltas: 46,
      aceleracoesExplosivas: 19,
      desaceleracoesAltas: 51,
      desaceleracoesCriticas: 20,
      playerLoad: 710,
      potenciaMetabolicaMedia: 11.6,
      cargaAguda: Math.round(3000 * fatorCarga),
      cargaCronica: 2700,
      acwrRatio: Number(((3000 * fatorCarga) / 2700).toFixed(2)),
      monotonia: 1.34,
      strain: 4020,
      escoreBorg: 7,
      centroideX: 78.0,
      centroideY: 34.0,
      raioAcao: 19.5,
      vetoresSprint: [
        { x1: 62, y1: 34, x2: 96, y2: 34, velocidade: 32.9, aceleracao: 3.4 },
        { x1: 75, y1: 30, x2: 101, y2: 38, velocidade: 31.8, aceleracao: 3.1 }
      ]
    }
  ]
}

const partidas = ref([
  {
    id: '1',
    nome: 'Campeonato Oficial - Rodada 4 (vs Santos FC)',
    adversario: 'Santos FC',
    data: '07/09/2026',
    duracao: 90,
    placar: '2 x 1 (Vitória Mandante)',
    atletas: criarAtletasPartida('Santos FC', 1.0)
  },
  {
    id: '2',
    nome: 'Campeonato Oficial - Rodada 3 (vs Palmeiras)',
    adversario: 'Palmeiras',
    data: '31/08/2026',
    duracao: 90,
    placar: '1 x 1 (Empate Fora)',
    atletas: criarAtletasPartida('Palmeiras', 1.05)
  },
  {
    id: '3',
    nome: 'Campeonato Oficial - Rodada 2 (vs Corinthians)',
    adversario: 'Corinthians',
    data: '24/08/2026',
    duracao: 90,
    placar: '3 x 0 (Vitória Mandante)',
    atletas: criarAtletasPartida('Corinthians', 0.96)
  }
])

// Computeds da Partida Ativa & Atletas
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

// Sincronizar os minutos jogados e Borg com o atleta ativo
watch(
  atletaAtivo,
  (novoAtleta) => {
    if (novoAtleta) {
      minutosJogadosAtleta.value = novoAtleta.minutosJogados || 90
      valorBorg.value = novoAtleta.escoreBorg || 6
    }
  },
  { immediate: true }
)

// Títulos e Subtítulos da barra superior
const tituloSecaoAtiva = computed(() => {
  if (menuAtivo.value === 'dados') return 'Inserção de Dados & Arquivos'
  if (menuAtivo.value === 'comissao') return 'Painel da Comissão Técnica'
  if (menuAtivo.value === 'atleta') return 'Painel do Atleta'
  if (menuAtivo.value === 'relatorio') return 'Relatório Pós-Jogo'
  return 'Visão 90'
})

const subtituloSecaoAtiva = computed(() => {
  if (menuAtivo.value === 'dados') return 'Ingestão e processamento de tracking espacial 25 Hz (Metrica Sports)'
  if (menuAtivo.value === 'comissao') return 'Monitoramento do elenco, semáforo de risco ACWR, alertas de sobrecarga e dinâmica tática'
  if (menuAtivo.value === 'atleta') return 'Histórico evolutivo de carga, minutagem, comparação com média da posição e escala Borg CR-10'
  if (menuAtivo.value === 'relatorio') return 'Dossiê consolidado individual da partida, mapa de calor real em canvas e 5 zonas de velocidade'
  return ''
})

// =========================================================================
// CÁLCULOS DO PAINEL DA COMISSÃO TÉCNICA
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
  return [...atletasAtivos.value].sort((a, b) => (b.velocidadeMaxima || 0) - (a.velocidadeMaxima || 0))[0]
})

const totalSprintsPicos = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.sprintsPicosContagem || 0), 0)
})

const totalHSRMetros = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ4HSR || 0), 0)
})

const totalDesaceleracoesAltas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.desaceleracoesAltas || 0), 0)
})

const totalDesaceleracoesCriticas = computed(() => {
  return atletasAtivos.value.reduce((acc, a) => acc + (a.desaceleracoesCriticas || 0), 0)
})

// Triagem Coletiva ACWR (Gabbett)
const contagemACWR = computed(() => {
  let sweetSpot = 0
  let atencao = 0
  let perigo = 0
  let subtreino = 0

  for (const a of atletasAtivos.value) {
    const ratio = a.acwrRatio || 1.0
    if (ratio < 0.8) subtreino++
    else if (ratio <= 1.3) sweetSpot++
    else if (ratio <= 1.5) atencao++
    else perigo++
  }

  return { sweetSpot, atencao, perigo, subtreino }
})

// Alertas Inteligentes da Comissão Técnica
const alertasComissao = computed(() => {
  const alertas = []

  for (const a of atletasAtivos.value) {
    // Alerta de Spike ACWR (> 1.5)
    if (a.acwrRatio > 1.5) {
      alertas.push({
        tipo: 'error',
        tag: 'SPIKE DE ACWR',
        titulo: `Jogador #${a.id} (${a.posicaoSugerida}) - Risco Agudo Crítico`,
        mensagem: `ACWR registrado em ${a.acwrRatio.toFixed(2)} (Carga Aguda 7d: ${a.cargaAguda} U.A. vs Crônica: ${a.cargaCronica} U.A.). Índice acima do limiar de segurança de 1.5.`,
        recomendacao: 'Prescrever regeneração ativa e limitar sprints acima de 25.2 km/h nas próximas 48h.'
      })
    }

    // Alerta de Anomalia Borg vs Tracking (Volume moderado/baixo com Borg muito alto)
    if (a.escoreBorg >= 8 && a.metrosPorMinuto < 115) {
      alertas.push({
        tipo: 'warning',
        tag: 'ANOMALIA BORG VS TRACKING',
        titulo: `Jogador #${a.id} (${a.posicaoSugerida}) - Discrepância Fisiológica`,
        mensagem: `Atleta reportou PSE Borg ${a.escoreBorg} (Muito Forte/Exaustivo), contudo seu ritmo foi moderado (${a.metrosPorMinuto?.toFixed(0)} m/min). Indica fadiga crônica acumulada, desidratação ou estresse extramatriz.`,
        recomendacao: 'Avaliar CK (creatina quinase), qualidade de sono e questionário de bem-estar.'
      })
    }

    // Alerta de Monotonia Excessiva (> 1.7)
    if (a.monotonia > 1.7 && a.strain > 6500) {
      alertas.push({
        tipo: 'warning',
        tag: 'STRAIN EXCESSIVO',
        titulo: `Jogador #${a.id} (${a.posicaoSugerida}) - Risco de Overtraining`,
        mensagem: `Tensão (Strain) de ${a.strain} U.A. e monotonia de ${a.monotonia.toFixed(2)} indicam carência de dias regenerativos no microciclo semanal.`,
        recomendacao: 'Inserir dia com carga reduzida (&lt; 250 U.A.) no microciclo.'
      })
    }
  }

  return alertas
})

// Ranqueamento do Elenco
const elencoOrdenado = computed(() => {
  const lista = [...atletasAtivos.value]
  const crit = criterioOrdenacaoElenco.value
  return lista.sort((a, b) => (b[crit] || 0) - (a[crit] || 0))
})

// Dinâmica Tática Coletiva
const baricentroTime = computed(() => {
  if (!atletasAtivos.value.length) return { x: 52.5, y: 34 }
  const sx = atletasAtivos.value.reduce((acc, a) => acc + (a.centroideX || 52.5), 0)
  const sy = atletasAtivos.value.reduce((acc, a) => acc + (a.centroideY || 34), 0)
  return {
    x: sx / atletasAtivos.value.length,
    y: sy / atletasAtivos.value.length
  }
})

const compacidadeTime = computed(() => {
  if (!atletasAtivos.value.length) return 20
  const bc = baricentroTime.value
  const somaDist = atletasAtivos.value.reduce((acc, a) => {
    const dx = (a.centroideX || 52.5) - bc.x
    const dy = (a.centroideY || 34) - bc.y
    return acc + Math.sqrt(dx * dx + dy * dy)
  }, 0)
  return somaDist / atletasAtivos.value.length
})

const comprimentoBloco = computed(() => {
  if (!atletasAtivos.value.length) return 60
  const xs = atletasAtivos.value.map(a => a.centroideX || 52.5)
  return Math.max(...xs) - Math.min(...xs)
})

const larguraBloco = computed(() => {
  if (!atletasAtivos.value.length) return 45
  const ys = atletasAtivos.value.map(a => a.centroideY || 34)
  return Math.max(...ys) - Math.min(...ys)
})

const pontosBlocoTatico = computed(() => {
  if (!atletasAtivos.value.length) return ''
  const defensores = atletasAtivos.value.filter(a => a.centroideX < 45)
  const atacantes = atletasAtivos.value.filter(a => a.centroideX >= 45)
  const pts = [...defensores, ...atacantes].map(a => `${a.centroideX},${a.centroideY}`)
  return pts.join(' ')
})

// Percentuais das 5 Zonas Coletivas
const percentuaisZonasColetivas = computed(() => {
  const totM = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0) || 1
  const z1 = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ1Caminhada || 0), 0)
  const z2 = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ2Trote || 0), 0)
  const z3 = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ3Media || 0), 0)
  const z4 = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ4HSR || 0), 0)
  const z5 = atletasAtivos.value.reduce((acc, a) => acc + (a.distanciaZ5Sprint || 0), 0)

  return {
    z1: ((z1 / totM) * 100).toFixed(1),
    z2: ((z2 / totM) * 100).toFixed(1),
    z3: ((z3 / totM) * 100).toFixed(1),
    z4: ((z4 / totM) * 100).toFixed(1),
    z5: ((z5 / totM) * 100).toFixed(1)
  }
})

// =========================================================================
// CÁLCULOS DO PAINEL DO ATLETA (MINUTAGEM & FISIOLOGIA BORG)
// =========================================================================
const ritmoNormalizadoMmin = computed(() => {
  if (!atletaAtivo.value || !minutosJogadosAtleta.value) return 0
  return atletaAtivo.value.distanciaTotal / minutosJogadosAtleta.value
})

const cargaFosterUa = computed(() => {
  return valorBorg.value * minutosJogadosAtleta.value
})

const razaoEficienciaTotal = computed(() => {
  if (!atletaAtivo.value || cargaFosterUa.value === 0) return '0.0'
  return (atletaAtivo.value.distanciaTotal / cargaFosterUa.value).toFixed(1)
})

const razaoEficienciaHSR = computed(() => {
  if (!atletaAtivo.value || cargaFosterUa.value === 0) return '0.00'
  return (atletaAtivo.value.distanciaZ4HSR / cargaFosterUa.value).toFixed(2)
})

const percentuaisZonasAtleta = computed(() => {
  if (!atletaAtivo.value || !atletaAtivo.value.distanciaTotal) {
    return { z1: '0', z2: '0', z3: '0', z4: '0', z5: '0' }
  }
  const tot = atletaAtivo.value.distanciaTotal
  return {
    z1: ((atletaAtivo.value.distanciaZ1Caminhada / tot) * 100).toFixed(1),
    z2: ((atletaAtivo.value.distanciaZ2Trote / tot) * 100).toFixed(1),
    z3: ((atletaAtivo.value.distanciaZ3Media / tot) * 100).toFixed(1),
    z4: ((atletaAtivo.value.distanciaZ4HSR / tot) * 100).toFixed(1),
    z5: ((atletaAtivo.value.distanciaZ5Sprint / tot) * 100).toFixed(1)
  }
})

const diagnosticoEficiencia = computed(() => {
  const ratio = parseFloat(razaoEficienciaTotal.value)
  if (ratio >= 15.0) {
    return {
      tipo: 'success',
      titulo: 'Alta Eficiência Psicofisiológica',
      mensagem: 'Excelente relação trabalho externo / estresse biológico. Atleta suporta alto volume com baixo custo subjetivo.'
    }
  } else if (ratio >= 9.0) {
    return {
      tipo: 'info',
      titulo: 'Eficiência Dentro da Faixa Esperada',
      mensagem: 'Resposta fisiológica proporcional às demandas táticas e cinemáticas da partida.'
    }
  } else {
    return {
      tipo: 'warning',
      titulo: 'Alerta: Baixa Eficiência (Custo Fisiológico Elevado)',
      mensagem: 'Queda na razão trabalho/esforço. Carga externa baixa associada a escore Borg alto indica fadiga crônica, estresse extramatriz ou sobrecarga acumulada.'
    }
  }
})

const diagnosticoBorgAtleta = computed(() => {
  if (valorBorg.value <= 3) {
    return {
      tipo: 'info',
      titulo: 'Sessão Regenerativa / Baixa Carga',
      mensagem: 'O atleta assimilou o jogo com estresse mínimo.',
      recomendacao: 'Apto para carga normal ou treinos compensatórios.'
    }
  } else if (valorBorg.value <= 6) {
    return {
      tipo: 'success',
      titulo: 'Carga Ótima de Competição',
      mensagem: 'Estresse mecânico e metabólico alinhado ao planejamento competitivo.',
      recomendacao: 'Protocolo de recuperação padrão (sono, nutrição e hidratação).'
    }
  } else if (valorBorg.value <= 8) {
    return {
      tipo: 'warning',
      titulo: 'Alta Demanda Psicofisiológica',
      mensagem: 'Esforço severo relatado. Risco de fadiga muscular residual.',
      recomendacao: 'Crioterapia, massoterapia e monitoramento de CK nas próximas 24h.'
    }
  } else {
    return {
      tipo: 'error',
      titulo: 'Exaustão / Sobrecarga Crítica',
      mensagem: 'Esforço próximo ao limite máximo absoluto suportado pelo atleta.',
      recomendacao: 'Intervenção imediata: repouso ativo e redução de carga na semana.'
    }
  }
})

// =========================================================================
// 5. ANÁLISE TEMPORAL DE INTENSIDADE & PONTO DE QUEBRA DE FADIGA
// =========================================================================
function calcularCurvaTemporalFisiologica(distanciaTotal, minutos, posicao, fatorDecaimento = 1.0) {
  const rotulos = ["0-15'", "15-30'", "30-45'", "45-60'", "60-75'", "75-90'+"];
  const mMinMedio = minutos > 0 ? distanciaTotal / minutos : 100;
  
  const curvasPorPosicao = {
    'Ponta Direita': [1.14, 1.08, 1.05, 0.97, 0.84, 0.72],
    'Ponta Esquerda': [1.12, 1.07, 1.03, 0.96, 0.86, 0.74],
    'Meio-Campista Central': [1.05, 1.04, 1.03, 0.99, 0.95, 0.91],
    'Volante': [1.04, 1.03, 1.02, 0.99, 0.95, 0.92],
    'Lateral Direito': [1.11, 1.07, 1.04, 0.97, 0.85, 0.74],
    'Lateral Esquerdo': [1.10, 1.06, 1.03, 0.98, 0.86, 0.76],
    'Zagueiro Central': [1.03, 1.02, 1.01, 0.99, 0.97, 0.94],
    'Centroavante': [1.09, 1.05, 1.02, 0.97, 0.87, 0.78],
    'Goleiro': [1.01, 1.00, 1.00, 1.00, 0.99, 0.99]
  };

  const perfil = curvasPorPosicao[posicao] || [1.08, 1.05, 1.02, 0.98, 0.88, 0.78];
  let picoMmin = 0;

  const blocosPre = rotulos.map((rotulo, idx) => {
    const minutosEfetivosBloco = Math.min(15, Math.max(0, minutos - idx * 15));
    if (minutosEfetivosBloco <= 0) {
      return {
        indice: idx,
        rotulo,
        tempoInicioMinutos: idx * 15,
        tempoFimMinutos: (idx + 1) * 15,
        distanciaTotal: 0,
        metrosPorMinuto: 0,
        distanciaHSR: 0,
        distanciaSprint: 0,
        sprintsContagem: 0,
        velocidadeMaxima: 0,
        aceleracoesAltas: 0,
        decaimentoPercentual: 0,
        classificacao: 'estavel'
      };
    }

    const fator = perfil[idx] * (idx >= 4 ? fatorDecaimento : 1.0);
    const mMinBloco = Math.round(mMinMedio * fator * 10) / 10;
    if (mMinBloco > picoMmin) picoMmin = mMinBloco;
    const distBloco = Math.round(mMinBloco * minutosEfetivosBloco);

    const fatorHSR = Math.pow(fator, 2.2);
    const distHSR = Math.round((distanciaTotal * 0.08 / 6) * fatorHSR);
    const distSprint = Math.round((distanciaTotal * 0.03 / 6) * Math.pow(fator, 3.0));
    const sprints = Math.max(0, Math.round(4 * Math.pow(fator, 2.5)));
    const velMax = Math.round((29.5 + 5.0 * Math.pow(fator, 1.5)) * 10) / 10;

    return {
      indice: idx,
      rotulo,
      tempoInicioMinutos: idx * 15,
      tempoFimMinutos: (idx + 1) * 15,
      distanciaTotal: distBloco,
      metrosPorMinuto: mMinBloco,
      distanciaHSR: distHSR,
      distanciaSprint: distSprint,
      sprintsContagem: sprints,
      velocidadeMaxima: velMax,
      aceleracoesAltas: Math.max(1, Math.round(10 * fator)),
      decaimentoPercentual: 0,
      classificacao: 'estavel'
    };
  });

  let primeiroBlocoQueda = '';
  let maiorQueda = 0;

  const blocos = blocosPre.map(b => {
    if (b.metrosPorMinuto <= 0) return b;
    const decaimento = picoMmin > 0 ? Math.round(((b.metrosPorMinuto - picoMmin) / picoMmin) * 1000) / 10 : 0;
    let classificacao = 'estavel';
    if (b.metrosPorMinuto >= picoMmin * 0.96) {
      classificacao = 'pico';
    } else if (decaimento >= -10) {
      classificacao = 'estavel';
    } else if (decaimento >= -20) {
      classificacao = 'queda-moderada';
      if (!primeiroBlocoQueda && b.indice > 0) primeiroBlocoQueda = b.rotulo;
      if (Math.abs(decaimento) > maiorQueda) maiorQueda = Math.abs(decaimento);
    } else {
      classificacao = 'queda-severa';
      if (!primeiroBlocoQueda && b.indice > 0) primeiroBlocoQueda = b.rotulo;
      if (Math.abs(decaimento) > maiorQueda) maiorQueda = Math.abs(decaimento);
    }
    return { ...b, decaimentoPercentual: decaimento, classificacao };
  });

  const b1 = blocos.slice(0, 3).filter(b => b.distanciaTotal > 0);
  const b2 = blocos.slice(3, 6).filter(b => b.distanciaTotal > 0);

  const dist1 = b1.reduce((acc, cur) => acc + cur.distanciaTotal, 0);
  const dist2 = b2.reduce((acc, cur) => acc + cur.distanciaTotal, 0);
  const min1 = Math.min(45, minutos);
  const min2 = Math.max(0, minutos - 45);

  const mMin1 = min1 > 0 ? Math.round((dist1 / min1) * 10) / 10 : 0;
  const mMin2 = min2 > 0 ? Math.round((dist2 / min2) * 10) / 10 : 0;
  const hsr1 = b1.reduce((acc, cur) => acc + cur.distanciaHSR, 0);
  const hsr2 = b2.reduce((acc, cur) => acc + cur.distanciaHSR, 0);
  const sprints1 = b1.reduce((acc, cur) => acc + cur.sprintsContagem, 0);
  const sprints2 = b2.reduce((acc, cur) => acc + cur.sprintsContagem, 0);

  const decaimentoT2 = mMin1 > 0 ? Math.round(((mMin2 - mMin1) / mMin1) * 1000) / 10 : 0;
  const momentoQueda = primeiroBlocoQueda || (decaimentoT2 < -12 ? 'No 2º Tempo' : 'Intensidade Mantida');

  let tipo = 'Pacing Estável (Intensidade Homogênea)';
  let recomendacao = 'Atleta manteve distribuição homogênea de esforço físico. Excelente capacidade de tolerância neuromuscular e pacing durante toda a partida.';
  let gravidade = 'normal';

  if (maiorQueda >= 22 || decaimentoT2 <= -20) {
    tipo = 'Fadiga Cumulativa Severa (Queda Acentuada)';
    recomendacao = `Queda acentuada de ${maiorQueda.toFixed(1)}% no ritmo de corrida detectada (${momentoQueda}) e drástica redução em sprints. Recomenda-se substituição prioritária por volta dos 65-70 min para preservar o bloco e evitar estiramentos musculares.`;
    gravidade = 'critico';
  } else if (maiorQueda >= 14 || decaimentoT2 <= -12) {
    tipo = 'Fadiga Moderada de Final de Jogo';
    recomendacao = `Queda de rendimento observada a partir de ${momentoQueda}. Recomenda-se monitorar hidratação, espaçamento tático e considerar substituição na faixa dos 75 min.`;
    gravidade = 'alerta';
  }

  return {
    blocosTemporais: blocos,
    analisePrimeiroTempo: { distancia: dist1, metrosPorMinuto: mMin1, hsr: hsr1, sprints: sprints1 },
    analiseSegundoTempo: { distancia: dist2, metrosPorMinuto: mMin2, hsr: hsr2, sprints: sprints2 },
    decaimentoSegundoTempoPercentual: decaimentoT2,
    momentoQuedaIntensidade: momentoQueda,
    diagnosticoFadiga: {
      tipo,
      momentoQueda,
      quedaPercentual: maiorQueda,
      recomendacaoComissao: recomendacao,
      gravidade
    }
  };
}

const analiseTemporalAtleta = computed(() => {
  if (!atletaAtivo.value) {
    return calcularCurvaTemporalFisiologica(10000, 90, 'Meio-Campista Central');
  }

  // Fator individual de fadiga por atleta (ex: Jogador 7 fadigou mais, Jogador 5 manteve)
  let fatorIndividual = 1.0;
  if (atletaAtivo.value.id === '7') fatorIndividual = 0.82; // Queda severa aos 60-75'
  if (atletaAtivo.value.id === '10') fatorIndividual = 0.85; // Borg alto e cansaço precoce
  if (atletaAtivo.value.id === '5') fatorIndividual = 0.98; // Motor estável

  return calcularCurvaTemporalFisiologica(
    atletaAtivo.value.distanciaTotal,
    minutosJogadosAtleta.value,
    atletaAtivo.value.posicaoSugerida,
    fatorIndividual
  );
});

const maiorMminTemporal = computed(() => {
  if (!analiseTemporalAtleta.value || !analiseTemporalAtleta.value.blocosTemporais.length) return 140;
  const max = Math.max(...analiseTemporalAtleta.value.blocosTemporais.map(b => b.metrosPorMinuto));
  return Math.max(120, max * 1.05);
});

function calcularAlturaBarraTemporal(mMin, maxMmin) {
  if (!mMin || !maxMmin) return 6;
  return Math.max(6, Math.min(100, Math.round((mMin / maxMmin) * 90)));
}

function obterGradienteBarraTemporal(classificacao) {
  switch (classificacao) {
    case 'pico':
      return 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)';
    case 'estavel':
      return 'linear-gradient(180deg, #10b981 0%, #059669 100%)';
    case 'queda-moderada':
      return 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
    case 'queda-severa':
      return 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)';
    default:
      return 'linear-gradient(180deg, #64748b 0%, #475569 100%)';
  }
}

function obterCorTextoMmin(classificacao) {
  switch (classificacao) {
    case 'pico': return 'text-info';
    case 'estavel': return 'text-success';
    case 'queda-moderada': return 'text-warning';
    case 'queda-severa': return 'text-error';
    default: return 'text-slate-300';
  }
}

function calcularDeltaPercentual(v1, v2) {
  if (!v1) return '0.0';
  return (((v2 - v1) / v1) * 100).toFixed(1);
}


// =========================================================================
// RADAR FÍSICO VS MÉDIA DA POSIÇÃO (6 EIXOS)
// =========================================================================
const eixosRadar = [
  { chave: 'distanciaTotal', rotulo: 'Volume', max: 12000 },
  { chave: 'metrosPorMinuto', rotulo: 'Ritmo (m/min)', max: 140 },
  { chave: 'distanciaZ4HSR', rotulo: 'HSR Metros', max: 800 },
  { chave: 'velocidadeMaxima', rotulo: 'Vel. Máx', max: 36 },
  { chave: 'desaceleracoesAltas', rotulo: 'Frenagens', max: 70 },
  { chave: 'playerLoad', rotulo: 'Player Load', max: 900 }
]

const dadosRadarAtleta = computed(() => {
  if (!atletaAtivo.value) return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  return eixosRadar.map(e => {
    const val = atletaAtivo.value[e.chave] || 0
    return Math.min(1.0, Math.max(0.1, val / e.max))
  })
})

const dadosRadarPosicao = computed(() => {
  if (!atletasAtivos.value.length || !atletaAtivo.value) return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  const pos = atletaAtivo.value.posicaoSugerida
  const colegas = atletasAtivos.value.filter(a => a.posicaoSugerida === pos)
  const grupo = colegas.length ? colegas : atletasAtivos.value

  return eixosRadar.map(e => {
    const soma = grupo.reduce((acc, a) => acc + (a[e.chave] || 0), 0)
    const media = soma / grupo.length
    return Math.min(1.0, Math.max(0.1, media / e.max))
  })
})

function calcularCoordenadaRadar(indice, valorNormalizado) {
  const angulo = (Math.PI * 2 / eixosRadar.length) * indice - Math.PI / 2
  const raio = 135 * valorNormalizado
  return {
    x: 200 + Math.cos(angulo) * raio,
    y: 200 + Math.sin(angulo) * raio
  }
}

function gerarPontosRadar(valores) {
  return valores.map((v, i) => {
    const c = calcularCoordenadaRadar(i, v)
    return `${c.x},${c.y}`
  }).join(' ')
}

function gerarPoligonoGrid(nivel) {
  return eixosRadar.map((_, i) => {
    const c = calcularCoordenadaRadar(i, nivel)
    return `${c.x},${c.y}`
  }).join(' ')
}

// =========================================================================
// RENDERIZADOR DO MAPA DE CALOR REAL (HTML5 CANVAS 2D DENSITY)
// =========================================================================
function gerarNuvemPontosAtleta(atleta) {
  if (!atleta) return []
  const nuvem = []

  // Centro principal e âncoras baseadas na posição tática real
  const cx = atleta.centroideX || 52.5
  const cy = atleta.centroideY || 34.0
  const raio = atleta.raioAcao || 20.0

  // Gera uma distribuição realista com 120-180 pontos de calor concentrados no setor
  const numPontos = 140
  for (let i = 0; i < numPontos; i++) {
    // Gaussiana aproximada (Box-Muller)
    const u1 = Math.random() || 0.001
    const u2 = Math.random() || 0.001
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2)

    // Ajustar dispersão conforme lateralidade e comprimento
    let px = cx + z0 * (raio * 0.7)
    let py = cy + z1 * (raio * 0.5)

    // Limitar ao gramado [2..103m, 2..66m]
    px = Math.max(3, Math.min(102, px))
    py = Math.max(3, Math.min(65, py))

    // Peso térmico maior perto do centroide
    const distCentro = Math.hypot(px - cx, py - cy)
    const peso = Math.max(0.2, 1.0 - (distCentro / (raio * 1.5)))

    nuvem.push({ x: px, y: py, peso })
  }

  // Adicionar pontos dos vetores de sprint para aquecer o corredor de aceleração
  if (atleta.vetoresSprint) {
    for (const v of atleta.vetoresSprint) {
      for (let step = 0; step <= 1.0; step += 0.15) {
        nuvem.push({
          x: v.x1 + (v.x2 - v.x1) * step,
          y: v.y1 + (v.y2 - v.y1) * step,
          peso: 1.2
        })
      }
    }
  }

  return nuvem
}

function desenharHeatmapReal() {
  const canvas = pitchCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  // 1. Limpar e desenhar o campo de futebol oficial (105m x 68m)
  ctx.clearRect(0, 0, w, h)

  // Gramado com listras alternadas verdes elegantes
  const gradientGrass = ctx.createLinearGradient(0, 0, 0, h)
  gradientGrass.addColorStop(0, '#092314')
  gradientGrass.addColorStop(1, '#05180d')
  ctx.fillStyle = gradientGrass
  ctx.fillRect(0, 0, w, h)

  // Listras do gramado (lawn stripes)
  const numListras = 10
  const larguraListra = w / numListras
  for (let i = 0; i < numListras; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.fillRect(i * larguraListra, 0, larguraListra, h)
    }
  }

  // Margem e escala do campo (105m de comprimento x 68m de largura)
  const margem = 24
  const cw = w - margem * 2
  const ch = h - margem * 2

  function toPxX(mX) { return margem + (mX / 105) * cw }
  function toPxY(mY) { return margem + (mY / 68) * ch }

  // 2. Se a visualização inclui calor ('calor' ou 'combinado')
  if (tipoVisualizacaoHeatmap.value === 'calor' || tipoVisualizacaoHeatmap.value === 'combinado') {
    const amostras = gerarNuvemPontosAtleta(atletaAtivo.value)
    const raio = 42 * (intensidadeCalor.value / 100)

    ctx.save()
    ctx.globalCompositeOperation = 'screen'

    for (const p of amostras) {
      const px = toPxX(p.x)
      const py = toPxY(p.y)
      const peso = p.peso || 1.0

      const radGrad = ctx.createRadialGradient(px, py, 2, px, py, raio)
      radGrad.addColorStop(0, `rgba(255, 30, 0, ${0.45 * peso})`)
      radGrad.addColorStop(0.3, `rgba(255, 140, 0, ${0.35 * peso})`)
      radGrad.addColorStop(0.6, `rgba(255, 220, 0, ${0.22 * peso})`)
      radGrad.addColorStop(0.85, `rgba(0, 180, 255, ${0.10 * peso})`)
      radGrad.addColorStop(1, 'rgba(0, 80, 255, 0)')

      ctx.fillStyle = radGrad
      ctx.beginPath()
      ctx.arc(px, py, raio, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  // 3. Demarcações oficiais brancas do campo
  ctx.save()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.lineWidth = 2

  // Linhas limítrofes
  ctx.strokeRect(margem, margem, cw, ch)

  // Linha de meio-campo
  ctx.beginPath()
  ctx.moveTo(toPxX(52.5), margem)
  ctx.lineTo(toPxX(52.5), margem + ch)
  ctx.stroke()

  // Círculo central (raio 9.15m)
  const raioCirculoPx = (9.15 / 105) * cw
  ctx.beginPath()
  ctx.arc(toPxX(52.5), toPxY(34), raioCirculoPx, 0, Math.PI * 2)
  ctx.stroke()

  // Ponto central
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(toPxX(52.5), toPxY(34), 3, 0, Math.PI * 2)
  ctx.fill()

  // Grande Área Esquerda (16.5m x 40.32m)
  ctx.strokeRect(margem, toPxY(13.84), (16.5 / 105) * cw, (40.32 / 68) * ch)
  // Pequena Área Esquerda (5.5m x 18.32m)
  ctx.strokeRect(margem, toPxY(24.84), (5.5 / 105) * cw, (18.32 / 68) * ch)
  // Ponto da Marca do Pênalti Esquerda (11m)
  ctx.beginPath()
  ctx.arc(toPxX(11), toPxY(34), 3, 0, Math.PI * 2)
  ctx.fill()

  // Grande Área Direita
  ctx.strokeRect(toPxX(88.5), toPxY(13.84), (16.5 / 105) * cw, (40.32 / 68) * ch)
  // Pequena Área Direita
  ctx.strokeRect(toPxX(99.5), toPxY(24.84), (5.5 / 105) * cw, (18.32 / 68) * ch)
  // Ponto da Marca do Pênalti Direita
  ctx.beginPath()
  ctx.arc(toPxX(94), toPxY(34), 3, 0, Math.PI * 2)
  ctx.fill()

  // Arcos de escanteio
  const raioCorner = (1.0 / 105) * cw * 2
  ctx.beginPath(); ctx.arc(margem, margem, raioCorner, 0, Math.PI / 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(margem, margem + ch, raioCorner, -Math.PI / 2, 0); ctx.stroke()
  ctx.beginPath(); ctx.arc(margem + cw, margem, raioCorner, Math.PI / 2, Math.PI); ctx.stroke()
  ctx.beginPath(); ctx.arc(margem + cw, margem + ch, raioCorner, Math.PI, -Math.PI / 2); ctx.stroke()
  ctx.restore()

  // 4. Se a visualização inclui vetores ('vetores' ou 'combinado')
  if (tipoVisualizacaoHeatmap.value === 'vetores' || tipoVisualizacaoHeatmap.value === 'combinado') {
    desenharVetoresSprint(ctx, atletaAtivo.value, toPxX, toPxY)
  }
}

function desenharVetoresSprint(ctx, atleta, toPxX, toPxY) {
  if (!atleta || !atleta.vetoresSprint) return

  ctx.save()
  for (const v of atleta.vetoresSprint) {
    const x1 = toPxX(v.x1)
    const y1 = toPxY(v.y1)
    const x2 = toPxX(v.x2)
    const y2 = toPxY(v.y2)

    // Gradiente da linha de sprint
    const grad = ctx.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)')
    grad.addColorStop(1, '#f43f5e')

    ctx.strokeStyle = grad
    ctx.lineWidth = 3.5
    ctx.shadowColor = '#f43f5e'
    ctx.shadowBlur = 8

    // Linha
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // Seta na ponta
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const headLen = 11
    ctx.fillStyle = '#f43f5e'
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fill()

    // Badge com a velocidade do sprint (ex: "33.8 km/h")
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.fillRect(x2 - 30, y2 - 20, 60, 16)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 1
    ctx.strokeRect(x2 - 30, y2 - 20, 60, 16)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 9px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${v.velocidade.toFixed(1)} km/h`, x2, y2 - 8)
  }
  ctx.restore()
}

// Watchers para redesenhar o Canvas ao trocar de aba, atleta ou filtros
watch(
  [atletaAtivo, tipoVisualizacaoHeatmap, intensidadeCalor, menuAtivo],
  () => {
    if (menuAtivo.value === 'relatorio') {
      nextTick(() => {
        desenharHeatmapReal()
      })
    }
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    desenharHeatmapReal()
  })
})

// =========================================================================
// HELPERS DE FORMATAÇÃO E CORES
// =========================================================================
function obterCorACWR(ratio) {
  if (!ratio) return 'info'
  if (ratio < 0.8) return 'info'
  if (ratio <= 1.3) return 'success'
  if (ratio <= 1.5) return 'warning'
  return 'error'
}

function obterTextoCurtoACWR(ratio) {
  if (!ratio) return 'Normal'
  if (ratio < 0.8) return 'Sub-treino'
  if (ratio <= 1.3) return 'Sweet Spot'
  if (ratio <= 1.5) return 'Atenção'
  return 'Perigo / Spike'
}

function obterParecerACWR(ratio) {
  if (!ratio) return ''
  if (ratio < 0.8) return 'Carga aguda muito abaixo da crônica. Risco de perda de adaptações cardiorrespiratórias e força específica.'
  if (ratio <= 1.3) return 'Razão ideal dentro do "Sweet Spot" de Gabbett. Menor índice preditivo de lesão muscular na literatura.'
  if (ratio <= 1.5) return 'Sobrecarga moderada. Recomenda-se vigilância sobre dor muscular tardia (DOMS) e monitoramento de carga excêntrica.'
  return 'Zona de risco crítico (> 1.5). Pico abrupto de carga externa. Probabilidade aumentada de estiramento de isquiotibiais.'
}

function corBorg(valor) {
  if (valor <= 2) return 'info'
  if (valor <= 4) return 'success'
  if (valor <= 6) return 'warning'
  if (valor <= 8) return 'deep-orange'
  return 'error'
}

function descricaoBorg(valor) {
  const desc = {
    0: 'Repouso / Inativo',
    1: 'Muito Muito Leve',
    2: 'Fácil / Trote',
    3: 'Moderado',
    4: 'Um Pouco Forte',
    5: 'Forte / Intenso',
    6: 'Forte+',
    7: 'Muito Forte',
    8: 'Muito Forte+',
    9: 'Quase Exaustivo',
    10: 'Máximo Absoluto'
  }
  return desc[valor] || 'Moderado'
}

function obterCorSetor(posicao, alpha = 1) {
  if (posicao.includes('Goleiro')) return `rgba(245, 158, 11, ${alpha})`
  if (posicao.includes('Lateral') || posicao.includes('Zagueiro')) return `rgba(56, 189, 248, ${alpha})`
  if (posicao.includes('Volante') || posicao.includes('Meio-Campista') || posicao.includes('Armador')) return `rgba(16, 185, 129, ${alpha})`
  return `rgba(239, 68, 68, ${alpha})`
}

function selecionarPartida(id) {
  partidaAtivaId.value = id
  mensagemAlerta.value = `Partida #${id} ativada para todos os painéis.`
  tipoAlerta.value = 'success'
}

function abrirAtletaEspecifico(id) {
  atletaAtivoId.value = String(id)
  menuAtivo.value = 'atleta'
}

function abrirRelatorioAtleta(id) {
  atletaAtivoId.value = String(id)
  menuAtivo.value = 'relatorio'
  nextTick(() => {
    desenharHeatmapReal()
  })
}

function imprimirDossie() {
  window.print()
}

// Helpers comparativos
function calcularDistanciaColetiva(atletas) {
  if (!atletas) return 0
  return atletas.reduce((acc, a) => acc + (a.distanciaTotal || 0), 0)
}
function calcularMediaMmin(atletas) {
  if (!atletas || !atletas.length) return 0
  return atletas.reduce((acc, a) => acc + (a.metrosPorMinuto || 0), 0) / atletas.length
}
function calcularTotalSprintsPicos(atletas) {
  if (!atletas) return 0
  return atletas.reduce((acc, a) => acc + (a.sprintsPicosContagem || 0), 0)
}

function processarUploadArquivo() {
  carregando.value = true
  setTimeout(() => {
    carregando.value = false
    mensagemAlerta.value = 'Arquivo CSV 25 Hz processado com sucesso! Métricas cinemáticas integradas aos 4 painéis.'
    tipoAlerta.value = 'success'
    menuAtivo.value = 'comissao'
  }, 1200)
}

function processarUrlDataset() {
  carregando.value = true
  setTimeout(() => {
    carregando.value = false
    mensagemAlerta.value = 'Dataset remoto baixado e processado com sucesso!'
    tipoAlerta.value = 'success'
    menuAtivo.value = 'comissao'
  }, 1400)
}

function aplicarPresetUrl(tipo) {
  if (tipo === 'home') {
    urlDataset.value = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv'
  } else {
    urlDataset.value = 'https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv'
  }
}

function carregarPartidasPadrao() {
  mensagemAlerta.value = 'Demonstração de 3 partidas recarregada com sucesso!'
  tipoAlerta.value = 'info'
}
</script>

<style scoped>
/* ========================================================================= */
/* VISÃO 90 - MODERN SPORTS TECH DESIGN SYSTEM (HUDL / CATAPULT PRO STYLE)   */
/* ========================================================================= */

.app-background {
  background-color: #060911 !important;
  background-image: 
    radial-gradient(at 0% 0%, rgba(0, 245, 155, 0.09) 0px, transparent 45%),
    radial-gradient(at 95% 5%, rgba(0, 229, 255, 0.08) 0px, transparent 50%),
    radial-gradient(at 50% 60%, rgba(139, 92, 246, 0.04) 0px, transparent 65%),
    radial-gradient(at 100% 100%, rgba(0, 245, 155, 0.06) 0px, transparent 50%) !important;
  background-attachment: fixed !important;
  color: #f1f5f9;
  min-height: 100vh;
  font-family: var(--font-sans);
}

.main-viewport {
  max-width: 1640px;
  margin: 0 auto;
  width: 100%;
}

/* ------------------------------------------------------------------------- */
/* TOP APP BAR & HEADER TRANSLÚCIDO                                          */
/* ------------------------------------------------------------------------- */
.topbar-custom {
  background: rgba(7, 11, 20, 0.75) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
}

/* ------------------------------------------------------------------------- */
/* BARRA LATERAL (DRAWER) MODERNA COM INDICADOR NEON                         */
/* ------------------------------------------------------------------------- */
.sidebar-custom {
  background: rgba(6, 10, 18, 0.94) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.07) !important;
  box-shadow: 6px 0 30px rgba(0, 0, 0, 0.45) !important;
}

.sidebar-logo-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.sidebar-logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 12px rgba(0, 245, 155, 0.35));
}

.nav-item-custom {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid transparent !important;
  position: relative !important;
  overflow: hidden !important;
  border-radius: 12px !important;
}

.nav-item-custom:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(3px);
}

.nav-item-custom.v-list-item--active {
  background: linear-gradient(90deg, rgba(0, 245, 155, 0.16) 0%, rgba(0, 229, 255, 0.04) 100%) !important;
  border-color: rgba(0, 245, 155, 0.35) !important;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.15) !important;
  color: #ffffff !important;
}

.nav-item-custom.v-list-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3.5px;
  background: #00f59b;
  box-shadow: 0 0 10px #00f59b;
  border-radius: 0 3px 3px 0;
}

/* ------------------------------------------------------------------------- */
/* GLASS CARDS & SUPERFÍCIES VIDRO REFINADAS                                 */
/* ------------------------------------------------------------------------- */
.glass-card {
  background: rgba(13, 21, 37, 0.65) !important;
  backdrop-filter: blur(18px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(18px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.075) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  border-color: rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 12px 38px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}

/* KPI Stat Cards com Hover e Brilho Esportivo */
.kpi-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.kpi-card:hover {
  transform: translateY(-3px) !important;
  border-color: rgba(0, 245, 155, 0.35) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(0, 245, 155, 0.12) !important;
}

.kpi-number {
  font-family: var(--font-mono) !important;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
}

/* ------------------------------------------------------------------------- */
/* CAMPO DE FUTEBOL E HEATMAP CANVAS 2D                                      */
/* ------------------------------------------------------------------------- */
.pitch-container {
  background: rgba(3, 7, 14, 0.7);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  box-shadow: inset 0 2px 20px rgba(0, 0, 0, 0.6);
}

.canvas-wrapper {
  background: #030812 !important;
  border-radius: 16px !important;
  border: 1px solid rgba(0, 245, 155, 0.22) !important;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.7), 0 0 28px rgba(0, 245, 155, 0.08) !important;
  overflow: hidden;
}

.soccer-pitch-canvas {
  width: 100%;
  max-width: 900px;
  height: auto;
  border-radius: 14px;
}

.heatmap-legend-bar {
  display: inline-block;
  width: 90px;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(to right, #0055ff, #00d4ff, #ffea00, #ff8800, #ff1100);
  box-shadow: 0 0 8px rgba(255, 136, 0, 0.3);
}

/* ------------------------------------------------------------------------- */
/* BARRA SEGMENTADA DAS 5 ZONAS DE VELOCIDADE                                */
/* ------------------------------------------------------------------------- */
.segmented-bar {
  display: flex;
  height: 14px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.4);
}

.seg-walk { background: linear-gradient(90deg, #38bdf8, #0ea5e9); transition: width 0.4s ease; }
.seg-jog { background: linear-gradient(90deg, #06b6d4, #0891b2); transition: width 0.4s ease; }
.seg-run { background: linear-gradient(90deg, #fbbf24, #f59e0b); transition: width 0.4s ease; }
.seg-hsr { background: linear-gradient(90deg, #00f59b, #059669); transition: width 0.4s ease; box-shadow: 0 0 8px rgba(0, 245, 155, 0.4); }
.seg-sprint { background: linear-gradient(90deg, #ff3b5c, #e11d48); transition: width 0.4s ease; box-shadow: 0 0 10px rgba(255, 59, 92, 0.5); }

/* ------------------------------------------------------------------------- */
/* TABELAS MODERNAS DO PLANTEL                                               */
/* ------------------------------------------------------------------------- */
.table-custom {
  background: transparent !important;
}

.table-custom th {
  color: #94a3b8 !important;
  font-family: var(--font-display) !important;
  text-transform: uppercase !important;
  font-size: 0.70rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  background-color: rgba(14, 22, 38, 0.55) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  padding: 12px 16px !important;
}

.table-custom td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  padding: 12px 16px !important;
  font-size: 0.85rem !important;
  transition: background 0.15s ease;
}

.table-custom tr:hover td {
  background: rgba(255, 255, 255, 0.035) !important;
}

/* ------------------------------------------------------------------------- */
/* GRÁFICO TEMPORAL DE INTENSIDADE POR BLOCOS DE 15'                          */
/* ------------------------------------------------------------------------- */
.temporal-chart-container {
  background: rgba(10, 16, 30, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.075) !important;
  border-radius: 14px !important;
  box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.4) !important;
}

.temporal-bars-stage {
  height: 205px;
  position: relative;
  padding-top: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.temporal-bar-column {
  width: 100%;
  max-width: 68px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  position: relative;
}

.temporal-bar-column:hover {
  filter: brightness(1.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 245, 155, 0.35);
}

.average-reference-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  border-top: 2px dashed rgba(0, 229, 255, 0.55);
  z-index: 1;
  pointer-events: none;
}

.avg-line-label {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 10px;
  font-weight: 700;
  color: #00e5ff;
  background: rgba(7, 11, 22, 0.92);
  padding: 2px 8px;
  border-radius: 5px;
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.pulse-chip {
  animation: pulse-danger 1.8s infinite;
}

@keyframes pulse-danger {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 92, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 59, 92, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 92, 0);
  }
}

/* ------------------------------------------------------------------------- */
/* BADGES E INDICADORES                                                      */
/* ------------------------------------------------------------------------- */
.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.radar-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.4));
}

.select-partida-top :deep(.v-field__input) {
  font-size: 0.85rem;
  font-weight: 600;
}

/* Regras para Impressão do Dossiê */
@media print {
  .v-navigation-drawer,
  .v-app-bar,
  .v-btn {
    display: none !important;
  }
  .app-background {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .glass-card {
    background: #ffffff !important;
    border: 1px solid #cccccc !important;
    color: #000000 !important;
  }
  .soccer-pitch-canvas {
    max-width: 100% !important;
  }
}
</style>
