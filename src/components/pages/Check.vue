<template>
  <v-flex xs12>
    <v-stepper v-model="step" vertical>

      <v-stepper-step step="1" :complete="step > 1">Basic Information</v-stepper-step>
      <v-stepper-content step="1">
        <v-layout row wrap class="px-10">
          <v-flex xs12 md5 lg5>
            <v-text-field v-model="check.name" name="checkName" label="Check" hint="Check name is required" value="Input text" required></v-text-field>
          </v-flex>
          <v-flex xs12 md5 lg6 offset-lg1>
            <v-select :items="aircraftList" v-model="check.aircraft" label="Aircraft" item-text="name" item-value="name" return-object required autocomplete></v-select>
          </v-flex>
          <v-flex xs12 md5 lg5>
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
                label="Start date"
                v-model="check.startDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="check.startDate"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 md5 lg6 offset-lg1>
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
                label="Finish date"
                v-model="check.finishDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="check.finishDate"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-btn @click.native="dialogConfirmCancel = true">Cancel</v-btn>
        <v-btn color="primary" @click.native="step = 2" :disabled="!completeStep1">Next</v-btn>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="step > 2">Import WP</v-stepper-step>
      <v-stepper-content step="2">
        <v-card class="lighten-4 elevation-0">
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
        <v-btn color="primary" @click.native="scanZoneDivision()" :disabled="!completeStep2">Next</v-btn>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="step > 3">Zone Division</v-stepper-step>
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
        <v-btn @click.native="step = 2">Back</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4" :complete="step > 4">Finish</v-stepper-step>
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
        <v-btn @click.native="step = 3">Back</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-flex>
</template>

<script>

import XLSX from 'xlsx'
import firebase from 'firebase/app'
import 'firebase/database'
import { mapState, mapMutations } from 'vuex'
import { Check } from '@/models/Check'

export default {
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'Check') {
      // console.log('leaved')
      this.setCheckId(null)
    }
    next()
  },
  data () {
    return {
      title: '',
      check: new Check(),
      step: 1,
      completeStep1: true,
      completeStep2: true,
      ams: [],
      workpack: []
    }
  },
  computed: {
    ...mapState(['checks']),
    ...mapState('check', ['checkId', 'aircraftList']),
    numberTaskCard () {
      return this.workpack.length
    }
  },
  methods: {
    ...mapMutations('check', ['setCheckId']),
    ...mapMutations(['setLoading']),
    getCheck () {
      const check = this.checks.find((item) => {
        return item.id === this.checkId
      })
      if (check) {
        this.check = Object.assign({}, check)
      }
    },
    getAMS () {
      this.setLoading(true)
      firebase.database().ref('ams' + this.check.aircraft.type).once('value').then(
        (data) => {
          this.ams = Object.values(data.val()) || []
          console.log(this.ams)
          this.setLoading(false)
        },
        (error) => {
          console.log(error)
          this.setLoading(false)
        }
      )
    },
    scanZoneDivision () {
      this.step = 3
    },
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files[0]) {
        this.readFile(files[0])
      }
    },
    readFile (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, {type: 'binary'})
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: ['wpItem', 'taskName', 'zone', 'taskType', 'taskTitle'] })
        /* Update state */
        data.shift()
        this.workpack = data
        // this.cols = makeCols(ws['!ref'])
        this.readingIsCompleted = true
      }
      reader.readAsBinaryString(file)
    }
  },
  created () {
    this.$store.dispatch('check/getAircraftList')
    if (this.$route.params.id) {
      this.title = 'Edit Check'
      this.setCheckId(this.$route.params.id)
    } else {
      this.title = 'New Check'
    }
    this.getCheck()
    this.getAMS()
  },
  mounted () {}
}
</script>
