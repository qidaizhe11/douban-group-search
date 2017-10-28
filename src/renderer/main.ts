import Vue from 'vue'
import axios from 'axios'
// import ElementUI from 'element-ui'
// import moment from 'moment'

// import 'element-ui/lib/theme-default/index.css'

import App from './App.vue'
import router from './router'
// import store from './store'

// moment.locale('zh-cn')

// Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  // store,
  template: '<App/>'
}).$mount('#app')
