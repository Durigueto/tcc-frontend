# Visão 90: Front-end da Aplicação

Módulo de interface com o usuário da plataforma **Visão 90**, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) em Ciência da Computação por João Pedro Dias, sob orientação do Prof. Me. Kenedy Antônio Freitas.

---

## 1. Visão Geral da Interface

O front-end foi construído para proporcionar uma experiência visual moderna, responsiva e de alta performance à beira do gramado ou na sala de análise técnica. 

### Principais Recursos Visuais:
* **Renderização Gráfica em HTML5 Canvas 2D:** Renderização contínua do mapa de calor espacial a 60 quadros por segundo, processando as trajetórias de posicionamento do atleta com aceleração por hardware.
* **Componentes Responsivos com Vuetify 3:** Adaptação ergonômica para desktops, tablets e smartphones com menus retráteis e tabelas com rolagem horizontal dedicada.
* **Semáforo Coletivo ACWR:** Cards de triagem epidemiológica baseados no modelo de Tim Gabbett (2016), colorindo em verde, amarelo e vermelho o nível de estresse agudo dos jogadores.
* **Gráficos Polares e Dinâmica Temporal:** Comparação visual entre o atleta e a média da sua posição tática (radar físico) e decomposição do ritmo em blocos de 15 minutos.

---

## 2. Tecnologias Empregadas

* **Framework Base:** [Vue.js 3](https://vuejs.org/) utilizando Composition API (`<script setup>`).
* **Design System & UI:** [Vuetify 3](https://vuetifyjs.com/) e ícones [Material Design Icons (@mdi/font)](https://pictogrammers.com/docs/library/mdi/).
* **Ferramenta de Build:** [Vite](https://vitejs.dev/) para compilação ultrarrápida e Hot Module Replacement (HMR).
* **Autenticação e Armazenamento Local:** Módulo `authService.js` com segregação de dados por usuário via `localStorage`.

---

## 3. Instruções de Instalação e Execução

### Pré-requisitos
* Node.js instalado (versão 18 ou superior).

### Instalação de dependências:
```bash
npm install
```

### Inicialização do servidor de desenvolvimento:
```bash
npm run dev
```

A interface estará disponível no navegador no endereço:
👉 `http://localhost:5173`

### Compilação para produção:
```bash
npm run build
```

---

## 4. Guia de Teste Prático (Banca Examinadora)

### Acesso ao Sistema:
Ao carregar a página inicial, utilize a conta central de testes:
* **E-mail:** `joaopedrodias895@gmail.com`
* **Senha:** `123`

### Importando Arquivos CSV da Metrica Sports:
1. No menu lateral, acesse **"Inserir Partida"**.
2. No formulário de envio, selecione o arquivo CSV de rastreamento. Você pode utilizar o arquivo de exemplo disponibilizado no projeto em:
   `../tcc-backend/dados/dados_rastreamento_exemplo.csv`
   ou qualquer arquivo oficial de rastreamento a 25 Hz baixado do repositório público da [Metrica Sports](https://github.com/metrica-sports/sample-data) (como `Sample_Game_1_RawTrackingData_Home_Team.csv`).
3. Informe o título do confronto e clique no botão **"Processar e Importar CSV"**.
4. O sistema processará as coordenadas, recalculará as zonas de velocidade metabólica e redirecionará a visualização para o painel da comissão técnica.

---

## 5. Estrutura dos Arquivos

```text
tcc-frontend/
├── index.html                 # Página base da aplicação
├── vite.config.js             # Configurações de compilação do Vite e Vuetify
├── package.json               # Dependências e scripts
└── src/
    ├── App.vue                # Componente principal contendo as 4 abas funcionais
    ├── main.js                # Ponto de entrada Vue e registro de plugins
    └── services/
        └── authService.js     # Gerenciamento de sessão e isolamento multiusuário
```
