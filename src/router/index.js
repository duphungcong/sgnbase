import Vue from 'vue'
import Router from 'vue-router'
import About from '@/components/pages/About'
import Dashboard from '@/components/pages/Dashboard'
import Auth from '@/components/Auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/about',
      component: About,
      name: 'About'
    },
    {
      path: '/auth',
      component: Auth,
      name: 'Auth'
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'Dashboard'
    }
  ]
})
