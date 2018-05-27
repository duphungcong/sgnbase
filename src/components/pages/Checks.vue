<template>
  <v-layout>
    <v-btn @click="followCheck">Follow Check</v-btn>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    followCheck () {
      this.$store.dispatch('followCheck', 'abcxyz')
    }
  }
}
</script>
