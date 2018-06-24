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
              <img src="https://randomuser.me/api/portraits/men/85.jpg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu bottom left offset-y origin="bottom right" transition="v-slide-y-transition">
                <v-btn icon light slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-if="isFollowingCheck" @click="stopFollowingCheck">Stop following check</v-list-tile>
                  <v-list-tile @click="goTo('Acount')">Account</v-list-tile>
                  <v-list-tile @click="onLogOut">Logout</v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list-tile v-for="item in itemMenu" :key="item.title" @click="goTo(item.route)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
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
export default {
  data () {
    return {
      mini: false,
      checkMenu: [
        { title: 'Dashboard', icon: 'dashboard', route: 'Dashboard' },
        { title: 'Tasks', icon: 'dashboard', route: 'Tasks' },
        { title: 'NRCs', icon: 'dashboard', route: 'Nrcs' },
        { title: 'Spares', icon: 'dashboard', route: 'Spares' }
      ],
      noCheckMenu: [
        { title: 'Checks', icon: 'contacts', route: 'Checks' },
        { title: 'AMS Task', icon: 'contacts', route: 'Task' },
        { title: 'Mac Consult', icon: 'contacts', route: 'Consult' }
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
