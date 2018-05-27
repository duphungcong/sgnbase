import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import snackbar from './modules/snackbar'
import navmenu from './modules/navmenu'

Vue.use(Vuex)

const state = {
  loading: false,
  error: null,
  checkId: null
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
  }
}

const actions = {
  followCheck ({ commit }, payload) {
    commit('setCheckId', payload)
  },
  unFollowCheck ({ commit }) {
    commit('setCheckId', null)
  }
}

const getters = {
  loading: state => state.loading,
  error: state => state.error,
  checkId: state => state.checkId,
  isFollowingCheck: state => state.checkId !== null && state.checkId !== undefined
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
    navmenu
  }
})
