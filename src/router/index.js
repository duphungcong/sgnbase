import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Auth from '@/components/Auth'

import Consult from '@/components/pages/Consult'
import Dashboard from '@/components/pages/Dashboard'
import Checks from '@/components/pages/Checks'
import Check from '@/components/pages/Check'

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

const noRequireFollowingCheck = (to, from, next) => {
  if (!store.getters.isFollowingCheck) {
    requireAuthenticated(to, from, next)
    return
  }
  next('/dashboard')
}

const requireFollowingCheck = (to, from, next) => {
  if (store.getters.isFollowingCheck) {
    requireAuthenticated(to, from, next)
    return
  }
  next('/checks')
}

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/dashboard', name: 'root' },
    { path: '*', redirect: '/dashboard' },
    {
      path: '/consult',
      component: Consult,
      name: 'Consult'
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
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/checks',
      component: Checks,
      name: 'Checks',
      beforeEnter: noRequireFollowingCheck
    },
    {
      path: '/check',
      component: Check,
      name: 'Check',
      beforeEnter: noRequireFollowingCheck
    }
  ]
})

export default router
