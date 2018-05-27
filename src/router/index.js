import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import About from '@/components/pages/About'
import Dashboard from '@/components/pages/Dashboard'
import Auth from '@/components/Auth'

Vue.use(Router)

const noRequireAuthenticated = (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    next()
    return
  }
  next('/')
}

const requireAuthenticated = (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) {
    next()
    return
  }
  next('/auth')
}

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '*', redirect: '/dashboard' },
    {
      path: '/about',
      component: About,
      name: 'About'
    },
    {
      path: '/auth',
      component: Auth,
      name: 'Auth',
      beforeEnter: noRequireAuthenticated
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'Dashboard',
      beforeEnter: requireAuthenticated
    }
  ]
})

export default router
