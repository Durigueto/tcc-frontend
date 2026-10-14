# Visão 90: Front-end da Aplicação

> **Projeto Integrado:** Este repositório contém a interface web (front-end) da plataforma **Visão 90**.
> Para a documentação completa do projeto, contextualização científica, dados de rastreamento e artigo do TCC, acesse o repositório unificado:
> 🔗 **[Repositório Principal - Visão 90](https://github.com/Durigueto/visao90)**
>
> Back-end da API: 🔗 **[tcc-backend](https://github.com/Durigueto/tcc-backend)**

---

## 1. Visão Geral

Interface gráfica desenvolvida em **Vue.js 3** e **Vuetify 3** para comissões técnicas de futebol. A aplicação apresenta visualização de desempenho físico e tático, renderizando mapas de calor espaciais em Canvas 2D acelerado por hardware e integrando o semáforo de risco epidemiológico ACWR de Gabbett com a Carga de Foster (Borg CR-10).

## 2. Tecnologias Utilizadas

* **Framework:** Vue.js 3 (Composition API)
* **Componentes e Estilos:** Vuetify 3 e Material Design Icons (@mdi/font)
* **Build e Bundler:** Vite
* **Gráficos e Renderização:** HTML5 Canvas 2D (60 fps) e SVG vetorial

## 3. Como Executar Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior).

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor Vite
npm run dev
```

A aplicação estará acessível em: `http://localhost:5173`

Para compilação de produção:
```bash
npm run build
```

## 4. Credenciais de Teste (Banca Examinadora)

Para visualizar as 3 partidas oficiais pré-carregadas e o elenco completo:
* **E-mail:** `joaopedrodias895@gmail.com`
* **Senha:** `123`

*(Também é possível registrar uma nova conta clicando em "Criar nova conta" na tela de login para validar o isolamento de dados).*

## 5. Importação de Arquivos da Metrica Sports

1. No menu lateral, acesse **"Inserir Partida"**.
2. Selecione o arquivo CSV de rastreamento oficial da Metrica Sports a 25 Hz (como `Sample_Game_1_RawTrackingData_Home_Team.csv` ou o arquivo de exemplo disponibilizado no back-end).
3. Informe o nome do confronto e confirme o processamento. O sistema converterá as coordenadas para metros, calculará as 5 zonas de velocidade e direcionará a visualização para o painel da comissão técnica.
