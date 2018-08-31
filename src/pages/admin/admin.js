import Vue from 'vue'
import router from './route'
import admin from './admin.vue'

import Api from '../../api/api'
import moment from 'moment'
import axios from '@/http/http'

Vue.prototype.$http = axios
Vue.prototype.$api = Api
Vue.prototype.$moment = moment

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(admin),
  router,
  data: {
    eventHub: new Vue()
  }
})
