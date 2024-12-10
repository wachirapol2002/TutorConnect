import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from '@vuelidate/core'
import VueCookies from 'vue-cookies'
import 'bulma/css/bulma.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(router)
app.use(Vuelidate)  // ใช้ Vuelidate สำหรับ Vue 3
app.use(VueCookies, {
  expireTimes: 60 * 60 // กำหนดเวลาหมดอายุให้เป็น 1 ชั่วโมง (60 วินาที * 60 วินาที)
})

app.mount('#app')