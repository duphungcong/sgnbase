import firebase from 'firebase/app'
import 'firebase/database'

const state = {
  checks: []
}
const mutations = {
  setChecks (state, checks) {
    state.checks = checks
  }
}

const actions = {
  getChecks ({ commit }) {
    commit('setLoading', true, { root: true })
    firebase.database().ref('checks').on('value',
      (data) => {
        const checks = Object.values(data.val()) || []
        commit('setChecks', checks)
        // console.log(checks)
        commit('setLoading', false, { root: true })
      },
      (error) => {
        console.log(error)
        commit('setLoading', false, { root: true })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
