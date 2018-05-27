<template>
  <v-app>
    <template v-if="!isAuthenticated">
      <router-view></router-view>
    </template>
    <template v-else>
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
    </template>
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
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    }
  },
  watch: {
    isAuthenticated (value) {
      if (!value) {
        this.$router.push({ name: 'Auth' })
      } else {
        this.$router.push({ name: 'Dashboard' })
      }
    }
  },
  methods: {
    ...mapMutations('navmenu', ['toggleMenu']),
    goTo (route) {
      this.$router.push({ name: route })
    }
  }
}
</script>
