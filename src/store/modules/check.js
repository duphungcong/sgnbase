import firebase from 'firebase/app'
import 'firebase/database'

const state = {
  checkId: null,
  aircraftList: []
}

const mutations = {
  setAircraftList (state, payload) {
    state.aircraftList = payload
  },
  setCheckId (state, payload) {
    state.checkId = payload
  }
}
const actions = {
  getAircraftList (context, payload) {
    if (context.state.aircraftList.length === 0) {
      firebase.database().ref('aircraft').on('value',
        (data) => {
          const obj = data.val()
          if (obj !== null && obj !== undefined) {
            context.commit('setAircraftList', Object.values(obj) || [])
          } else {
            context.commit('setAircraftList', [])
          }
        },
        (error) => {
          console.log('get aircraft list - ' + error)
        }
      )
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
