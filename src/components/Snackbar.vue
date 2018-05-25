<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    :color="snackbar.color"
    top>

    {{ snackbar.text }}

    <v-btn flat @click="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  computed: {
    snackbar () {
      return this.$store.getters['snackbar/snackbar']
    }
  },
  methods: {
    ...mapMutations('snackbar', ['closeSnackbar'])
  }
}
</script>
