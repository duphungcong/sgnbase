import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

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
    commit('setError', null, { root: true })
    commit('setLoading', true, { root: true })
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        // commit('setUser', user)
        commit('setLoading', false, { root: true })
      },
      (error) => {
        commit('setError', error, { root: true })
        commit('setLoading', false, { root: true })
      }
    )
  },
  signUp ({ commit }, payload) {
    commit('setError', null, { root: true })
    commit('setLoading', true, { root: true })
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        // commit('setUser', user)
        commit('setLoading', false, { root: true })
      },
      (error) => {
        console.log(error)
        commit('setError', error, { root: true })
        commit('setLoading', false, { root: true })
      }
    )
  },
  autoSignIn ({ commit }, payload) {
    commit('setUser', payload)
  },
  logout ({ commit }) {
    firebase.auth().signOut()
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
