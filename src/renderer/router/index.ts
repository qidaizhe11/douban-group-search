import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage.vue').default
    },
    {
      path: '/',
      name: 'index',
      component: require('@/views/Index.vue').default
    },
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
