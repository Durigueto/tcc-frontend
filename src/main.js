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
          primary: '#10b981',
          secondary: '#06b6d4',
          accent: '#8b5cf6',
          background: '#0a0f1d',
          surface: '#131e33',
          'surface-variant': '#1e2c47',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
