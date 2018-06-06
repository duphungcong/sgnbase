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
          const list = Object.values(data.val()) || []
          // console.log(list)
          context.commit('setAircraftList', list)
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
