import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import snackbar from './modules/snackbar'
import navmenu from './modules/navmenu'

Vue.use(Vuex)

const state = {
  loading: false,
  error: null
}

const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setError (state, payload) {
    state.error = payload
  }
}

const getters = {
  loading: state => state.loading,
  error: state => state.error
}

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  getters,
  modules: {
    auth,
    snackbar,
    navmenu
  }
})
