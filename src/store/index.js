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
  }
}

const actions = {
  followCheck ({ commit }, payload) {
    commit('setCheckId', payload)
  },
  unFollowCheck ({ commit }) {
    commit('setCheckId', null)
  },
  getChecks ({ commit }) {
    commit('setLoading', true)
    firebase.database().ref('checks').once('value').then(
      (data) => {
        const checks = Object.values(data.val()) || []
        commit('setChecks', checks)
        commit('setLoading', false)
      },
      (error) => {
        console.log(error)
        commit('setLoading', false)
      }
    )
  }
}

const getters = {
  loading: state => state.loading,
  error: state => state.error,
  checkId: state => state.checkId,
  isFollowingCheck: state => state.checkId !== null && state.checkId !== undefined,
  checks: state => state.checks
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
