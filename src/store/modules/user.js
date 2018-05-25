import firebase from 'firebase'

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
    commit('setLoading', true, { root: true })
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        commit('setLoading', false, { root: true })
        firebase.database().ref('users/' + user.id).on('value',
          (data) => {
            let currentUser = data.val()
            commit('setUser', currentUser)
          },
          (console.error())
        )
      }
    )
  },
  signUp ({ commit }, payload) {
    commit('setLoading', true, { root: true })
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        commit('setLoading', false, { root: true })
        const newUser = {
          id: user.uid,
          email: user.email,
          displayName: '',
          photoUrl: './assets/img/avatar0.png'
        }
        firebase.database().ref('users/' + user.id).set(newUser).then(
          (data) => commit('setUser', newUser),
          (console.error())
        )
      },
      (error) => {
        commit('setLoading', false, { root: true })
        commit('setError', error)
      }
    )
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
