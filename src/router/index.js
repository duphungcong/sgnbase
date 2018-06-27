import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Auth from '@/components/pages/Auth'
import Check from '@/components/pages/Check'
import Checks from '@/components/pages/Checks'
import Consult from '@/components/pages/Consult'
import Dashboard from '@/components/pages/Dashboard'
import Task from '@/components/pages/Task'
import Tasks from '@/components/pages/Tasks'
import Nrcs from '@/components/pages/Nrcs'
import Spares from '@/components/pages/Spares'
import BarcodeIn from '@/components/pages/BarcodeIn'
import BarcodeOut from '@/components/pages/BarcodeOut'

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
      path: '/auth',
      component: Auth,
      name: 'Auth',
      beforeEnter: noRequireAuthenticated
    },
    {
      path: '/check',
      component: Check,
      name: 'Check',
      beforeEnter: noRequireFollowingCheck
    },
    {
      path: '/checks',
      component: Checks,
      name: 'Checks',
      beforeEnter: noRequireFollowingCheck
    },
    {
      path: '/consult',
      component: Consult,
      name: 'Consult'
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'Dashboard',
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/task',
      component: Task,
      name: 'Task'
    },
    {
      path: '/tasks',
      component: Tasks,
      name: 'Tasks',
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/nrcs',
      component: Nrcs,
      name: 'Nrcs',
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/spares',
      component: Spares,
      name: 'Spares',
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/in',
      component: BarcodeIn,
      name: 'BarcodeIn',
      beforeEnter: requireFollowingCheck
    },
    {
      path: '/out',
      component: BarcodeOut,
      name: 'BarcodeOut',
      beforeEnter: requireFollowingCheck
    }
  ]
})

export default router
