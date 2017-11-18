import Vue from 'vue'
import axios from 'axios'
import Element from 'element-ui'
// import moment from 'moment'

import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

// moment.locale('zh-cn')

Vue.use(Element)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* tslint:disable no-unused-expression */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
/* tslint:enable */
