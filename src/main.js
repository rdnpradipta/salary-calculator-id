import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.css'
import '@vueform/toggle/themes/default.css'
import "./assets/css/custom.css";
import i18n from './i18n'

createApp(App).use(i18n).use(i18n).mount('#app')

