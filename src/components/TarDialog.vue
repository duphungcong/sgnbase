<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>

      <v-card-title class="blue">
        <h4 class="white--text">TAR</h4>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field label="Number" v-model="model.number"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field label="Question" v-model="model.question" multi-line rows="1"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field label="Answer" v-model="model.answer" multi-line rows="1"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
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
                v-model="model.sendDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="model.sendDate"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs6>
            <v-select label="Zone" :items="zones" v-model="model.zoneDivision"></v-select>
          </v-flex>
          <v-flex xs6>
            <v-select label="Status" :items="status" v-model="model.status"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-text-field label="Notes" v-model="model.notes" multi-line rows="1"></v-text-field>
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
    tar: {}
  },
  data () {
    return {
      model: {},
      zones: this.appConst.zoneSelection,
      status: this.appConst.tarStatus
    }
  },
  watch: {
    tar (value) {
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
