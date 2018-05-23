const state = {
  user: null
}

const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

const actions = {
  login ({ commit }, payload) {
    commit('setLoading', { loading: true }, { root: true })
    setTimeout(() => {
      commit('setUser', {
        email: payload.email,
        password: payload.password
      })
    }, 3000)
    // commit('setLoading', { loading: false }, { root: true })
  },
  logout ({ commit }) {
    commit('setUser', null)
  }
}

const getters = {
  user: state => state.user
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
