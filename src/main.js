import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'flag-icons/css/flag-icons.min.css'
import '@vueform/toggle/themes/default.css'
import "./assets/css/custom.css"
import i18n from './i18n'

createApp(App).use(i18n).use(i18n).mount('#app')

