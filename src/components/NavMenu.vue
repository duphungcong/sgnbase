<template>
  <v-navigation-drawer
    v-model="navMenu.visible"
    app
    :mini-variant="mini">

    <v-list dense class="pt-0">

      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/3.jpg">
              <!-- <v-avatar color="teal" size="38">
                <span class="white--text headline">{{ user.email[0] }}</span>
              </v-avatar> -->
              <!-- <v-avatar color="info" size="38">
                <v-icon dark>account_circle</v-icon>
              </v-avatar> -->
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.email }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu bottom left offset-y origin="bottom right" transition="v-slide-y-transition">
                <v-btn icon light slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-if="isFollowingCheck" @click="stopFollowingCheck">Stop following check</v-list-tile>
                  <!-- <v-list-tile @click="goTo('Acount')">Account</v-list-tile> -->
                  <v-list-tile @click="onLogOut">Logout</v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list-tile v-for="item in itemMenu" :key="item.title" @click="goTo(item.route)">
        <v-list-tile-action>
          <v-tooltip right v-if="mini">
            <v-icon slot="activator">{{ item.icon }}</v-icon>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
          <v-icon v-else>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon v-if="!mini" size="28">chevron_left</v-icon>
                <v-icon v-else size="28">chevron_right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

    </v-list>

  </v-navigation-drawer>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      mini: false,
      checkMenu: [
        { title: 'Dashboard', icon: 'dashboard', route: 'Dashboard', tooltip: 'Dashboard' },
        { title: 'Tasks', icon: 'library_books', route: 'Tasks', tooltip: 'Tasks' },
        { title: 'NRCs', icon: 'file_copy', route: 'Nrcs', tooltip: 'NRCs' },
        { title: 'Spares', icon: 'shopping_cart', route: 'Spares', tooltip: 'Spares' },
        { title: 'TARs', icon: 'help_outline', route: 'Tars', tooltip: 'TARs' },
        { title: 'In/Out History', icon: 'history', route: 'History', tooltip: 'In/Out History' },
        { title: 'Barcode In', icon: 'arrow_back', route: 'BarcodeIn', tooltip: 'Barcode In' },
        { title: 'Barcode Out', icon: 'arrow_forward', route: 'BarcodeOut', tooltip: 'Barcode Out' }
      ],
      noCheckMenu: [
        { title: 'Checks', icon: 'flight_takeoff', route: 'Checks', tooltip: 'Checks' },
        // { title: 'AMS Task', icon: 'contacts', route: 'Task', tooltip: 'Task' },
        { title: 'Mac Consult', icon: 'layers', route: 'Consult', tooltip: 'Consult' }
      ]
    }
  },
  props: {
    isFollowingCheck: {
      type: Boolean,
      default: () => { return false }
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    navMenu () {
      return this.$store.getters['navmenu/navmenu']
    },
    itemMenu () {
      if (this.isFollowingCheck) {
        return this.checkMenu
      } else {
        return this.noCheckMenu
      }
    }
  },
  methods: {
    goTo (route) {
      this.$emit('goTo', route)
    },
    onLogOut () {
      this.$store.dispatch('auth/logout')
    },
    stopFollowingCheck () {
      this.$store.dispatch('unFollowCheck')
    }
  }
}
</script>
