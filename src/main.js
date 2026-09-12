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
          primary: '#2E6B66', // Verde petróleo / teal
          secondary: '#4F6E80', // Azul ardósia
          accent: '#B38C40', // Dourado queimado
          background: '#101820', // Navy profundo
          surface: '#1B2530', // Slate
          'surface-variant': '#23303E', // Slate elevado
          info: '#4F6E80', // Azul ardósia
          success: '#2E6B66', // Verde petróleo
          warning: '#B38C40', // Dourado queimado
          error: '#D9534F', // Alerta / perigo
        },
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
