import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies';
import datepicker from 'v-calendar';
import Vuetify from 'vuetify';
import configPlugin from '@/config'

Vue.use(configPlugin)
Vue.config.productionTip = false
Vue.use(VueCookies);
Vue.use(datepicker);
Vue.use(Vuetify);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
