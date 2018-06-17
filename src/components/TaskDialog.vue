<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">{{ mode }} task</h4>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm12 md12>
            <v-text-field :disabled="editMode" rows="3" label="TITLE" v-model="task.title"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="AMS MH" v-model="task.amsMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MAC MH" v-model="task.macMH"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="MEN" v-model="task.men"></v-text-field>
          </v-flex>
          <v-flex xs12 sm3 md3>
            <v-text-field type="number" label="HOUR" v-model="task.hour"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="2" label="ZONE DIVISION" v-model="task.zoneDivision"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field multi-line rows="2" no-resize label="NOTES" v-model="task.notes"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" flat @click.native="cancel()">Cancel</v-btn>
        <v-btn color="blue" depressed dark @click.native="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
    editMode: true,
    current: {}
  },
  data () {
    return {
      mode: 'Edit',
      task: Object.assign({}, this.current)
    }
  },
  watch: {
    editMode (value) {
      value ? this.mode = 'Edit' : this.mode = 'New'
    },
    current (value) {
      this.task = Object.assign({}, value)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.task)
    }
  }
}
</script>
