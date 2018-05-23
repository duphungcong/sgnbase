import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'

Vue.use(Vuex)

const state = {
  loading: false
}

const mutations = {
  setLoading (state, { loading }) {
    state.loading = loading
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  modules: {
    user
  }
})
