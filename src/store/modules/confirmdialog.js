const state = {
  confirmdialog: {
    visible: false,
    title: null,
    text: null,
    isConfirmed: false
  }
}
const mutations = {
  showDialog (state, payload) {
    if (payload.title) {
      state.confirmdialog.title = payload.title
    }

    if (payload.text) {
      state.confirmdialog.text = payload.text
    }

    state.confirmdialog.visible = true
  },
  closeDialog (state) {
    state.confirmdialog.visible = false
    state.confirmdialog.isConfirmed = false
    state.confirmdialog.title = ''
    state.confirmdialog.text = ''
  },
  setConfirm (state) {
    state.confirmdialog.isConfirmed = true
  }
}

const actions = {
  confirm ({ commit }) {
    commit('setConfirm')
    commit('closeDialog')
  },
  cancel ({ commit }) {
    commit('closeDialog')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
