import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Auth from '@/components/Auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HelloWorld,
      name: 'HelloWorld'
    },
    {
      path: '/auth',
      component: Auth,
      name: 'Auth'
    }
  ]
})
