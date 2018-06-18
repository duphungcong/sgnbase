<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">Link to EO</h4>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>
            <v-select
              clearable open-on-clear
              label="Select EO"
              v-model="eo"
              item-text="name"
              class="input-group--focused"
              required autocomplete
              :items="list"
              @keyup.native.enter="addEo"></v-select>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="AMS MH" v-model="eo.amsMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MAC MH" v-model="eo.macMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MEN" v-model="eo.men"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="HOUR" v-model="eo.hour"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="1" label="ZONE DIVISION" v-model="eo.zoneDivision"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="1" label="REMARKS" v-model="eo.remarks"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" small flat @click.native="cancel()">Cancel</v-btn>
        <v-btn color="blue" small depressed dark @click.native="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/database'

export default {
  props: {
    dialog: false,
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      eo: {}
    }
  },
  watch: {
    dialog (value) {
      !value && (this.eo = {})
    },
    eo (value) {
      value === null && (this.eo = {})
    }
  },
  methods: {
    addEo (e) {
      let eo = this.list.find((item) => {
        return item.name === e.target.value
      })

      if (eo === undefined) {
        let id = firebase.database().ref('eo').push().key
        eo = Object.assign({}, {
          id: id,
          name: e.target.value,
          amsMH: 0,
          macMH: 0,
          men: 0,
          hour: 0,
          zoneDivision: 'N/A',
          remarks: 'NIL'
        })

        firebase.database().ref('eo/' + id).set(eo).then(
          (data) => {},
          (error) => {
            console.log(error)
          }
        )
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.eo)
    }
  }
}
</script>
