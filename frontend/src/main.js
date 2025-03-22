import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from '@vuelidate/core'
import VueCookies from 'vue-cookies'
import 'bulma/css/bulma.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUser, faBell);

const app = createApp(App)

app.use(router)
app.use(Vuelidate)
app.use(VueCookies, {
  expireTimes: 60 * 60
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')