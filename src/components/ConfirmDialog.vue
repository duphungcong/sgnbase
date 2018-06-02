<template>
  <v-dialog v-model="dialog" persistent max-width="320">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-actions>
        <v-btn class="green--text darken-1" flat="flat" @click.native="$emit('onConfirm')">Confirm</v-btn>
        <v-btn class="orange--text darken-1" flat="flat" @click.native="$emit('onCancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  // computed: {
  //   ...mapState('confirmdialog', ['confirmdialog'])
  // },
  // methods: {
  //   onConfirm () {
  //     this.$store.dispatch('confirmdialog/confirm')
  //   },
  //   onCancel () {
  //     this.$store.dispatch('confirmdialog/cancel')
  //   }
  // }
  props: {
    dialog: false,
    title: ''
  }
}
</script>
