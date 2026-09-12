import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#00f59b', // Verde Neon Gramado
          secondary: '#00e5ff', // Ciano Elétrico
          accent: '#8b5cf6', // Roxo Moderno
          background: '#070b14', // Preto Espaço Obsidiana
          surface: '#0e1728', // Superfície Vidro Elevada
          'surface-variant': '#142036', // Card Interno
          info: '#38bdf8', // Azul Celeste
          success: '#00f59b', // Sucesso / Verde
          warning: '#fbbf24', // Âmbar Atenção
          error: '#ff3b5c', // Vermelho Perigo
        },
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
