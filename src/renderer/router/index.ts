import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage.vue').default
    }
    // {
    //   path: '/',
    //   name: 'index',
    //   component: require('views/Index').default
    // },
    // {
    //   path: '/result',
    //   name: 'result',
    //   component: require('views/Result').default
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: require('views/Login').default
    // },
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
