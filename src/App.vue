<template>
  <v-app>
    <router-view/>
    <snackbar></snackbar>
  </v-app>
</template>

<script>

import snackbar from './components/Snackbar'

export default {
  name: 'App',
  components: {
    snackbar: snackbar
  }
}
</script>
