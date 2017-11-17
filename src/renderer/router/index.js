import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    // {
    //   path: '/',
    //   name: 'index',
    //   component: require('@/views/Index.vue').default
    // },
    // {
    //   path: '/result',
    //   name: 'result',
    //   component: require('views/Result.vue').default
    // },
    // {
    //   path: '/result/group-topics',
    //   name: 'group-posts-result',
    //   component: require('views/GroupTopicResult.vue').default
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: require('views/Login.vue').default
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
