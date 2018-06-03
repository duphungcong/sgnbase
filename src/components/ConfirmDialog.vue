<template>
  <v-dialog v-model="dialog" persistent max-width="320">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-actions>
        <v-btn class="red--text darken-1" flat="flat" @click.native="$emit('onConfirm')">Confirm</v-btn>
        <v-btn class="blue--text darken-1" flat="flat" @click.native="$emit('onCancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
    title: ''
  }
}
</script>
