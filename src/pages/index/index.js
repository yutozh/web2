import Vue from 'vue'
import router from './route'
import App from './App.vue'
import Api from '../../api/api'
import moment from 'moment'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.prototype.$api = Api
Vue.prototype.$moment = moment

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    eventHub: new Vue()
  }
})
