import firebase from 'firebase/app'
import 'firebase/database'
import { Check } from '@/models/Check'

const state = {
  check: new Check(),
  checkId: null,
  aircraftList: []
}

const mutations = {
  setAircraftList (state, payload) {
    state.aircraftList = payload
  },
  setCheckId (state, payload) {
    state.checkId = payload
  },
  setCheck (state, payload) {
    state.check = payload
  }
}
const actions = {
  getAircraftList (context, payload) {
    if (context.state.aircraftList.length === 0) {
      firebase.database().ref('aircraft').on('value',
        (data) => {
          const list = Object.values(data.val()) || []
          console.log(list)
          context.commit('setAircraftList', list)
        },
        (error) => {
          console.log('get aircraft list - ' + error)
        }
      )
    }
  },
  getCheck (context, payload) {
    if (payload) {
      const check = context.rootState.checks.find((item) => {
        return item.id === payload
      })
      console.log(check)
      context.commit('setCheck', check)
    } else {
      context.commit('setCheck', new Check())
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
