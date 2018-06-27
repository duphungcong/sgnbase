<template>
  <v-flex xs12>
    <v-layout>
      <v-flex xs4 pl-2>
        <v-text-field
        prepend-icon="person"
        disabled
        label="PPC"
        :value="person"></v-text-field>
      </v-flex>
      <v-flex xs7 ml-5>
        <v-text-field
          prepend-icon="format_paint"
          autofocus
          ref="scanBox"
          label="Scan Task"
          @change.native="onBarcodeScanned(barcode)"
          v-model="barcode"></v-text-field>
      </v-flex>
      <v-flex xs1 ml-3 pt-2>
        <v-btn depressed small dark color="primary" @click.native="update">IN</v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  data () {
    return {
      person: 'duphungcong@gmail.com',
      barcode: ''
    }
  }
}
</script>
