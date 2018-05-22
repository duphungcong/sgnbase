const state = {
  user: {
    name: 'udcun',
    email: 'duphungcong@gmail.com'
  }
}

const getters = {
  email: state => state.user.email
}

export default {
  namespaced: true,
  state,
  getters
}
