<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>

      <v-card-title class="blue">
        <h4 class="white--text">Task</h4>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-text-field label="Wp Item (Ex: VN00273172-15)" v-model="model.wpItem"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Ref (optional)" v-model="model.name"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field label="Title" v-model="model.title"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs3>
            <v-text-field type="number" label="Ams MH" v-model="model.amsMH"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field type="number" label="Mac MH" v-model="model.macMH"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field type="number" label="Men" v-model="model.men"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field type="number" label="Hour" v-model="model.hour"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-text-field multi-line rows="1" label="Zone Division" v-model="model.zoneDivision"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field multi-line rows="1" label="Remarks" v-model="model.remarks"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field multi-line rows="1" no-resize label="Notes" v-model="model.notes"></v-text-field>
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
    task: {}
  },
  data () {
    return {
      model: {}
    }
  },
  watch: {
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
