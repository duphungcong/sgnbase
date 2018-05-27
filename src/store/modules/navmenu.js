const state = {
  navmenu: {
    visible: true
  }
}

const mutations = {
  toggleMenu (state) {
    state.navmenu.visible = !state.navmenu.visible
  }
}

const getters = {
  navmenu: state => state.navmenu
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
