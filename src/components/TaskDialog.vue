<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">{{ mode }} task</h4>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm12 md12>
            <v-text-field :disabled="editMode" rows="3" label="TITLE" v-model="model.title"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="AMS MH" v-model="model.amsMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MAC MH" v-model="model.macMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MEN" v-model="model.men"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="HOUR" v-model="model.hour"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="1" label="ZONE DIVISION" v-model="model.zoneDivision"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="1" label="REMARKS" v-model="model.remarks"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="1" no-resize label="NOTES" v-model="model.notes"></v-text-field>
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
export default {
  props: {
    dialog: false,
    editMode: true,
    task: {}
  },
  data () {
    return {
      mode: 'Edit',
      model: Object.assign({}, this.task)
    }
  },
  watch: {
    editMode (value) {
      value ? this.mode = 'Edit' : this.mode = 'New'
    },
    task (value) {
      this.model = Object.assign({}, value)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.model)
    }
  }
}
</script>
