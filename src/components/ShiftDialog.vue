<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">Shift Selection</h4>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex lg1 md1 sm1 xs1 v-for="shift in checkShifts" :key="shift.number">
            <v-checkbox :label="shift.number.toString()" v-model="model" :value="shift.number"></v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" small flat @click.native="cancel()">Cancel</v-btn>
        <v-btn color="blue" small depressed dark @click.native="save()" :disabled="inValid">Save</v-btn>
      </v-card-actions>
      <v-alert :value="inValid" type="error" class="elevation-0">
        A least one shift must be selected
      </v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
    checkShifts: {
      type: Array,
      default: () => {
        return []
      }
    },
    taskShifts: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      inValid: false,
      model: Object.assign([], this.taskShifts)
    }
  },
  watch: {
    dialog (value) {
      value && (this.model = Object.assign([], this.taskShifts))
    },
    model (value) {
      value.length === 0 ? this.inValid = true : this.inValid = false
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
