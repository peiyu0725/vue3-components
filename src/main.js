import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import VCalendar from 'v-calendar';
import './assets/global.scss'
import 'v-calendar/dist/style.css';

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VCalendar, {})
  .mount('#app')
