<template>
  <v-app>
    <navmenu @goTo="goTo"></navmenu>
    <v-toolbar
      dense
      app
      dark
      color="primary"
      class="elevation-0">
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.native.stop="toggleMenu"></v-toolbar-side-icon>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex row>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <snackbar></snackbar>
  </v-app>
</template>

<script>

import snackbar from './components/Snackbar'
import navmenu from './components/NavMenu'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    snackbar,
    navmenu
  },
  methods: {
    ...mapMutations('navmenu', ['toggleMenu']),
    goTo (route) {
      this.$router.push({ name: route })
    }
  }
}
</script>
