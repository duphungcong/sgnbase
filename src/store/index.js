import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase/app'
import 'firebase/database'

import auth from './modules/auth'
import snackbar from './modules/snackbar'
import navmenu from './modules/navmenu'
import check from './modules/check'
import confirmdialog from './modules/confirmdialog'

Vue.use(Vuex)

const state = {
  loading: false,
  error: null,
  checkId: null,
  checks: [],
  extLoad: false,
  workpack: []
}

const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setCheckId (state, payload) {
    state.checkId = payload
  },
  setChecks (state, payload) {
    state.checks = payload
  },
  setWorkpack (state, payload) {
    state.workpack = payload
  },
  setExtLoad (state, payload) {
    state.extLoad = payload
  }
}

const actions = {
  followCheck (context, payload) {
    context.commit('setCheckId', payload)
    context.dispatch('getWorkpack')
  },
  unFollowCheck (context) {
    context.commit('setCheckId', null)
    context.commit('setWorkpack', [])
  },
  getChecks (context) {
    context.commit('setExtLoad', true)
    if (context.state.extLoad) context.commit('setLoading', true)
    firebase.database().ref('checks').on('value',
      (data) => {
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setChecks', Object.values(obj) || [])
        } else {
          context.commit('setChecks', [])
        }
        if (context.state.extLoad) {
          context.commit('setLoading', false)
          context.commit('setExtLoad', false)
        }
      },
      (error) => {
        console.log(error)
        if (context.state.extLoad) {
          context.commit('setLoading', false)
          context.commit('setExtLoad', false)
        }
      }
    )
  },
  getWorkpack (context) {
    firebase.database().ref('workpacks/' + context.state.checkId).on('value',
      (data) => {
        console.log('change wp')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setWorkpack', Object.values(obj) || [])
        } else {
          context.commit('setWorkpack', [])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
}

const getters = {
  loading: state => state.loading,
  error: state => state.error,
  checkId: state => state.checkId,
  isFollowingCheck: state => state.checkId !== null && state.checkId !== undefined,
  checks: state => state.checks,
  check: state => state.checks.find(item => item.id === state.checkId)
}

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  actions,
  getters,
  modules: {
    auth,
    snackbar,
    navmenu,
    check,
    confirmdialog
  }
})
