<template>
  <v-app>
    <template v-if="!isAuthenticated">
      <router-view></router-view>
    </template>
    <template v-else>
      <nav-menu
        :isFollowingCheck="isFollowingCheck"
        @goTo="goTo">
      </nav-menu>
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
        <v-container fluid ma-0 pa-0>
          <v-layout>
            <v-flex row>
              <router-view></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </template>
    <snackbar></snackbar>
    <loading-progress></loading-progress>
  </v-app>
</template>

<script>

import Snackbar from './components/Snackbar'
import NavMenu from './components/NavMenu'
import LoadingProgress from './components/LoadingProgress'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    Snackbar,
    NavMenu,
    LoadingProgress
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    isFollowingCheck () {
      return this.$store.getters.isFollowingCheck
    }
  },
  watch: {
    isAuthenticated (value) {
      if (!value) {
        this.$router.push({ name: 'Auth' })
      } else {
        this.$router.push({ name: 'root' })
      }
    },
    isFollowingCheck (value) {
      if (!value) {
        this.$router.push({ name: 'Checks' })
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
