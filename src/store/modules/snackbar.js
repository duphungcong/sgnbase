const state = {
  snackbar: {
    visible: false,
    text: null,
    timeout: 3000,
    multiline: false,
    color: undefined
  }
}

const mutations = {
  showSnackbar (state, payload) {
    state.snackbar.text = payload.text
    state.snackbar.multiline = payload.text.length > 50

    if (payload.multiline) {
      state.snackbar.multiline = payload.multiline
    }

    if (payload.timeout) {
      state.snackbar.timeout = payload.timeout
    }

    if (payload.color) {
      state.snackbar.color = payload.color
    }

    state.snackbar.visible = true
  },
  closeSnackbar (state) {
    state.snackbar.visible = false
    state.snackbar.multiline = false
    state.snackbar.text = null
    state.snackbar.timeout = 3000
  }
}

const getters = {
  snackbar: state => state.snackbar
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
