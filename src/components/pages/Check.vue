<template>
  <v-flex xs12>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="step > 1">Basic Infor</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="step > 2">Import WP</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="step > 3">Zone Division</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4" :complete="step > 4">Finish</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <!-- <v-layout row wrap class="px-10">
            <v-flex md6 xs12>
              <v-text-field name="checkName" label="Check" hint="Check name is required" value="Input text" v-model="check.name"
                class="input-group--focused" required></v-text-field>
            </v-flex>
            <v-flex md6 xs12>
              <v-select :items="aircraftList" label="Aircraft" v-model="check.aircraft.name" item-text="name" class="input-group--focused" required autocomplete></v-select>
            </v-flex>
            <v-flex md6 xs12>
              Start Date<br>
              <v-date-picker v-model="check.startDate"></v-date-picker>
            </v-flex>
            <v-flex md6 xs12>
              Finish Date<br>
              <v-date-picker v-model="check.finishDate"></v-date-picker>
            </v-flex>
          </v-layout>
          <v-btn @click.native="dialogConfirmCancel = true">Cancel</v-btn>
          <v-btn color="primary" @click.native="step = 2" :disabled="!inputCheckInfoCompleted">Next</v-btn> -->
        </v-stepper-content>

        <v-stepper-content step="2">
          <!-- <v-card class="lighten-4 elevation-0">
            <v-card-title><h3>Import WP CONTROL</h3></v-card-title>
            <v-card-text>
              <v-form>
                <input type="file" id="file" @change="onFileChange">
              </v-form>
              &nbsp;
              <p>Number of task cards: {{ numberTaskCard }}</p>
            </v-card-text>
          </v-card>
          <v-btn @click.native="step = 1">Back</v-btn>
          <v-btn color="primary" @click.native="scanZoneDivision()" :disabled="!readingIsCompleted">Next</v-btn> -->
        </v-stepper-content>

        <v-stepper-content step="3">
          <!-- <v-card class="lighten-4 elevation-0">
            <v-card-title><h3>Zone Division</h3></v-card-title>
            <v-card-actions>
              <v-btn @click.native="step = 2">Back</v-btn>
              <v-btn color="primary" @click.native="step = 4">Next</v-btn>
            </v-card-actions>

            <v-data-table :headers="headers" :items="workpack">
              <template slot="items" slot-scope="props" class="body-0">
                <td class="body-0">{{ props.item.wpItem }}</td>
                <td class="body-0">{{ props.item.taskName }}</td>
                <td class="body-0">{{ props.item.zone }}</td>
                <td class="body-0">{{ props.item.taskType }}</td>
                <td class="body-0">{{ props.item.taskTitle }}</td>
                <td class="body-0">{{ props.item.amsMH }}</td>
                <td class="body-0">{{ props.item.macMH }}</td>
                <td class="body-0">{{ props.item.men }}</td>
                <td class="body-0">{{ props.item.hour }}</td>
                <td class="body-0">{{ props.item.zoneDivision }}</td>
                <td class="body-0">{{ props.item.remarks }}</td>
              </template>
            </v-data-table>
          </v-card> -->
        </v-stepper-content>

        <v-stepper-content step="4">
          <!-- <v-card class="lighten-4 elevation-0">
            <v-card-title><h3>Review and submit</h3></v-card-title>
            <v-card-text>
              <p>Check: <strong>{{ check.name }}</strong></p>
              <p>Aircraft: <strong>{{ check.aircraft.name }}</strong></p>
              <p>Task Cards: <strong>{{ numberTaskCard }}</strong></p>
              <p>From: <strong>{{ check.startDate }}</strong></p>
              <p>To: <strong>{{ check.finishDate }}</strong></p>
            </v-card-text>
          </v-card>
          <v-btn @click.native="step = 3">Back</v-btn>
          <v-btn color="primary" @click.native="saveCheck()">Save</v-btn> -->
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'

export default {
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'Check') {
      // console.log('leaved')
      this.setCheckId(null)
      this.setCheck(null)
    }
    next()
  },
  data () {
    return {
      title: '',
      step: 0
    }
  },
  computed: {
    ...mapState('checks', ['checks']),
    ...mapState('check', ['checkId', 'check', 'aircraftList'])
  },
  methods: {
    ...mapMutations('check', ['setCheck', 'setCheckId'])
  },
  created () {
    this.$store.dispatch('check/getAircraftList')
  },
  mounted () {
    if (this.$route.params.id) {
      this.title = 'Edit Check'
      this.setCheckId(this.$route.params.id)
    } else this.title = 'New Check'
    this.$store.dispatch('check/getCheck', this.checkId)
  }
}
</script>
