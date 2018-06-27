<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>

      <v-card-title class="blue">
        <h4 class="white--text">Spare</h4>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap align-baseline>
          <v-flex xs3>
            <v-text-field label="RQF" v-model="model.rqf"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="P/N" v-model="model.pn"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="Description" v-model="model.description"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="Quantity" v-model="model.quantity"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-select label="Priority" :items="priorities" v-model="model.priority"></v-select>
          </v-flex>
          <v-flex xs6>
            <v-select label="Status" :items="status" v-model="model.status"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-menu
              lazy
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                label="Req date"
                v-model="model.reqDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="model.reqDate"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-menu
              lazy
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                label="Due date"
                v-model="model.dueDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="model.dueDate"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-text-field label="Notes" v-model="model.notes"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Ref" v-model="model.refName" disabled></v-text-field>
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
    spare: {}
  },
  data () {
    return {
      model: {},
      status: this.appConst.spareStatus,
      priorities: this.appConst.priorities
    }
  },
  watch: {
    spare (value) {
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
