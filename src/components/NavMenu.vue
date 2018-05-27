<template>
  <v-navigation-drawer
    v-model="navmenu.visible"
    app
    :mini-variant.sync="mini">

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
                  <v-list-tile @click="goTo('Acount')">Account</v-list-tile>
                  <v-list-tile @click="onLogOut">Logout</v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

       <v-divider></v-divider>

      <v-list-tile v-for="item in items" :key="item.title" @click="goTo(item.route)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>

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
      items: [
        { title: 'Dashboard', icon: 'dashboard', route: 'Dashboard' },
        { title: 'About', icon: 'question_answer', route: 'About' }
      ]
    }
  },
  computed: {
    navmenu () {
      return this.$store.getters['navmenu/navmenu']
    }
  },
  methods: {
    goTo (route) {
      this.$emit('goTo', route)
    },
    onLogOut () {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
