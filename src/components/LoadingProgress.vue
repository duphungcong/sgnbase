<template>
  <v-dialog v-model="loading" persistent max-width="80" max-height="80">
    <v-card class="v-card">
      <v-card-text>
        <v-progress-circular
        indeterminate
        color="primary"
        :size="30"
        :width="3"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['loading'])
  }
}
</script>

<style scoped>
  .v-card {
    text-align: center
  }
</style>
