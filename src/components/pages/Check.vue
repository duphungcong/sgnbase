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
        <v-btn color="primary" @click.native="nextStep2" :disabled="!completeStep1">Next</v-btn>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="step > 2">Import WP</v-stepper-step>
      <v-stepper-content step="2">
        <v-card class="lighten-4 elevation-0">
          <v-card-text>
            <v-form>
              <input type="file" id="file" @change="onFileChange">
            </v-form>
            &nbsp;
            <p>Number of task cards: {{ numberTaskCard }}</p>
          </v-card-text>
        </v-card>
        <v-btn @click.native="step = 1">Back</v-btn>
        <v-btn color="primary" @click.native="nextStep3()" :disabled="!completeStep2">Next</v-btn>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="step > 3">Review and submit</v-stepper-step>
      <v-stepper-content step="3">
        <v-card class="lighten-4 elevation-0">
          <v-card-text>
            <p>Check: <strong>{{ check.name }}</strong></p>
            <p>Aircraft: <strong>{{ check.aircraft.name }}</strong></p>
            <p>From: <strong>{{ check.startDate }}</strong></p>
            <p>To: <strong>{{ check.finishDate }}</strong></p>
            <p>Task cards: <strong>{{ numberTaskCard }}</strong></p>
            <p>Task cards do not have Zone Division: <strong>{{ numberTaskCardNA }}</strong></p>
          </v-card-text>
        </v-card>
        <v-btn @click.native="step = 2">Back</v-btn>
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
      workpack: [],
      updatedWorkpack: []
    }
  },
  computed: {
    ...mapState(['checks']),
    ...mapState('check', ['checkId', 'aircraftList']),
    numberTaskCard () {
      return this.workpack.length
    },
    numberTaskCardNA () {
      return this.updatedWorkpack.filter((item) => {
        return item.zoneDivision.indexOf('N/A') === 0
      }).length
    }
  },
  methods: {
    ...mapMutations('check', ['setCheckId']),
    ...mapMutations(['setLoading']),
    nextStep2 () {
      this.getAMS()
      this.step = 2
    },
    nextStep3 () {
      this.updatedWorkpack = this.scanZoneDivision()
      this.step = 3
    },
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
          // console.log(this.ams)
          this.setLoading(false)
        },
        (error) => {
          console.log(error)
          this.setLoading(false)
        }
      )
    },
    scanZoneDivision () {
      return this.workpack.map((item) => {
        const task = this.ams.find((el) => {
          return el.taskName === item.taskName
        })
        let additionalData
        if (task) {
          additionalData = {
            taskId: task.id || '',
            amsMH: task.amsMH || 0,
            macMH: task.macMH || 0,
            men: task.men || 0,
            hour: task.hour || 0,
            zoneDivision: task.zoneDivision || 'N/A',
            remarks: task.remarks || 'NIL'
          }
        } else {
          additionalData = {
            taskId: '',
            amsMH: 0,
            macMH: 0,
            men: 0,
            hour: 0,
            zoneDivision: 'N/A',
            remarks: 'NIL'
          }
        }
        return Object.assign({}, item, {
          notes: '',
          shifts: [ 1 ],
          status: 'notYet'
        }, additionalData)
      })
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
  },
  mounted () {}
}
</script>
