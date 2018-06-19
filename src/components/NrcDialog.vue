<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">NRC {{ model.number }}</h4>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-text-field label="W/O" v-model="model.wo"></v-text-field>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5>
            <v-text-field label="Reference" v-model="model.ref"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-select label="Zone" :items="zones" v-model="model.zoneDivision"></v-select>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5>
            <v-select label="Status" :items="status" v-model="model.status"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-select label="Priority" :items="priorities" v-model="model.priority"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Content" v-model="model.content" multi-line rows="2"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Notes" v-model="model.notes" multi-line rows="2"></v-text-field>
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
    nrcs: {
      type: Array,
      default: () => {
        return []
      }
    },
    nrc: {}
  },
  data () {
    return {
      model: {},
      zones: this.appConst.zoneSelection,
      status: this.appConst.nrcStatus,
      priorities: this.appConst.priorities
    }
  },
  watch: {
    nrc (value) {
      this.model = Object.assign({}, value)
    },
    nrcs (value) {
      this.nrc.id === '' && (this.model.number = value.length + 1)
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
