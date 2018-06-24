import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase/app'
import 'firebase/database'

import auth from './modules/auth'
import snackbar from './modules/snackbar'
import navmenu from './modules/navmenu'
import check from './modules/check'

Vue.use(Vuex)

const state = {
  loading: false,
  error: null,
  checkId: null,
  checks: [],
  extLoad: false,
  workpack: [],
  eo: [],
  nrcs: [],
  spares: []
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
  },
  setChecks (state, payload) {
    state.checks = payload
  },
  setWorkpack (state, payload) {
    state.workpack = payload
  },
  setEo (state, payload) {
    state.eo = payload
  },
  setNrcs (state, payload) {
    state.nrcs = payload
  },
  setSpares (state, payload) {
    state.spares = payload
  },
  setExtLoad (state, payload) {
    state.extLoad = payload
  }
}

const actions = {
  followCheck (context, payload) {
    context.commit('setCheckId', payload)
    context.dispatch('getWorkpack')
    context.dispatch('getNrcs')
    context.dispatch('getEo')
    context.dispatch('getSpares')
  },
  unFollowCheck (context) {
    context.commit('setCheckId', null)
    context.commit('setWorkpack', [])
  },
  getChecks (context) {
    context.commit('setExtLoad', true)
    if (context.state.extLoad) context.commit('setLoading', true)
    firebase.database().ref('checks').on('value',
      (data) => {
        console.log('load checks')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setChecks', Object.values(obj) || [])
        } else {
          context.commit('setChecks', [])
        }
        if (context.state.extLoad) {
          context.commit('setLoading', false)
          context.commit('setExtLoad', false)
        }
      },
      (error) => {
        console.log(error)
        if (context.state.extLoad) {
          context.commit('setLoading', false)
          context.commit('setExtLoad', false)
        }
      }
    )
  },
  getWorkpack (context) {
    firebase.database().ref('workpacks/' + context.state.checkId).on('value',
      (data) => {
        console.log('load workpack')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setWorkpack', Object.values(obj) || [])
        } else {
          context.commit('setWorkpack', [])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  getNrcs (context) {
    firebase.database().ref('nrcs/' + context.state.checkId).on('value',
      (data) => {
        console.log('load nrc list')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setNrcs', Object.values(obj) || [])
        } else {
          context.commit('setNrcs', [])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  getEo (context) {
    firebase.database().ref('eo').on('value',
      (data) => {
        console.log('load eo list')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setEo', Object.values(obj) || [])
        } else {
          context.commit('setEo', [])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  getSpares (context) {
    firebase.database().ref('spares/' + context.state.checkId).on('value',
      (data) => {
        console.log('load spare list')
        let obj = data.val()
        if (obj !== null && obj !== undefined) {
          context.commit('setSpares', Object.values(obj) || [])
        } else {
          context.commit('setSpares', [])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
}

const getters = {
  loading: state => state.loading,
  error: state => state.error,
  checkId: state => state.checkId,
  isFollowingCheck: state => state.checkId !== null && state.checkId !== undefined,
  checks: state => state.checks,
  check: state => state.checks.find(item => item.id === state.checkId)
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
    navmenu,
    check
  }
})
