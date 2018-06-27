// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from './store'
import appConst from './utils/const'
import appFunction from './utils/function'

import firebase from 'firebase/app'
import 'firebase/auth'

import 'vuetify/dist/vuetify.min.css'
import 'babel-polyfill'
import VueBarcodeScanner from 'vue-barcode-scanner'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(Vuetify)

window.Store = store
Vue.prototype.appConst = appConst
Vue.prototype.appFunction = appFunction

const barcodeOptions = {
  // sound: true, // default is false
  // soundSrc: '/static/sound.wav', // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true // default is false
}
Vue.use(VueBarcodeScanner, barcodeOptions)

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDmJzjL0ZudgtdkXTmREnogsrqfO4iixt4',
  authDomain: 'sgnbase.firebaseapp.com',
  databaseURL: 'https://sgnbase.firebaseio.com',
  projectId: 'sgnbase',
  storageBucket: 'sgnbase.appspot.com',
  messagingSenderId: '100760308598'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('auth/autoSignIn', user)
      } else {
        this.$store.dispatch('auth/logout')
      }
    })
  },
  mounted () {
    console.log('init App')
  }
})
