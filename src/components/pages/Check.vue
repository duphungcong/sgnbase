<template>
  <v-flex xs12>
    <v-stepper v-model="step" vertical class="elevation-0">

      <v-stepper-step step="1" :complete="step > 1">Basic Information</v-stepper-step>
      <v-stepper-content step="1">
        <v-layout row wrap class="px-10">
          <v-flex xs12 md5 lg5>
            <v-text-field
              v-model="check.name"
              :rules="step1Rules.name"
              name="checkName"
              label="Check"
              hint="Check name is required"
              value="Input text"
              required></v-text-field>
          </v-flex>
          <v-flex xs12 md5 lg6 offset-lg1>
            <v-select
              :items="aircraftList"
              v-model="check.aircraft"
              :rules="step1Rules.aircraft"
              :disabled="editMode"
              label="Aircraft"
              item-text="name"
              item-value="name"
              return-object
              required
              autocomplete></v-select>
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
                :rules="step1Rules.startDate"
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
                :rules="step1Rules.finishDate"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="check.finishDate"
                :allowed-dates="allowedDates"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-btn flat outline small @click.native="cancelProgress">Cancel</v-btn>
        <v-btn
          v-if="editMode"
          flat outline small
          color="primary"
          :disabled="!validStep1"
          @click.native="saveEditCheck">Save</v-btn>
        <v-btn
          v-else
          flat outline small
          color="primary"
          :disabled="!validStep1"
          @click.native="nextStep2">Next</v-btn>
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
        <v-btn flat outline small @click.native="step = 1">Back</v-btn>
        <v-btn flat outline small color="primary" @click.native="nextStep3()" :disabled="!validStep2">Next</v-btn>
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
        <v-btn flat outline small @click.native="step = 2">Back</v-btn>
        <v-btn flat outline small color="primary" @click.native="submit()" :disabled="!validStep3">submit</v-btn>
      </v-stepper-content>

    </v-stepper>

    <confirm-dialog
      :dialog="dialog"
      :title="dialogTitle"
      @confirm="onConfirm"
      @cancel="onCancel"></confirm-dialog>

  </v-flex>
</template>

<script>

import XLSX from 'xlsx'
import firebase from 'firebase/app'
import 'firebase/database'
import { mapState, mapMutations } from 'vuex'
import { Check } from '@/models/Check'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  components: {
    ConfirmDialog
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'Check') {
      // console.log('leaved')
      this.setCheckId(null)
      this.setEditMode(false)
    }
    next()
  },
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      check: new Check(),
      step: 1,
      step1Rules: {
        name: [v => !!v || 'Check name is required'],
        aircraft: [v => !!v || 'Aircraft is required'],
        startDate: [v => !!v || 'Start Date is required'],
        finishDate: [v => !!v || 'Finish Date is required']
      },
      validStep2: true,
      validStep3: true,
      ams: [],
      workpack: [],
      updatedWorkpack: []
    }
  },
  computed: {
    ...mapState(['checks']),
    ...mapState('check', ['checkId', 'aircraftList', 'editMode']),
    numberTaskCard () {
      return this.workpack.length
    },
    numberTaskCardNA () {
      return this.updatedWorkpack.filter((item) => {
        return item.zoneDivision.indexOf('N/A') === 0
      }).length
    },
    validStep1 () {
      return this.check.name !== '' && this.check.aircraft !== '' && this.check.startDate !== '' && this.check.finishDate !== ''
    }
  },
  methods: {
    ...mapMutations('check', ['setCheckId', 'setEditMode']),
    ...mapMutations(['setLoading']),
    nextStep2 () {
      this.getAms()
      this.step = 2
    },
    nextStep3 () {
      this.updatedWorkpack = this.scanZoneDivision()
      this.step = 3
    },
    submit () {
      this.check.setShifts()
      this.saveNewCheck()
    },
    saveNewCheck () {
      this.setLoading(true)

      let updates = {}

      this.check.id = firebase.database().ref('checks/').push().key
      let checkRef = '/checks/' + this.check.id
      let workpackRef = '/workpacks/' + this.check.id

      this.updatedWorkpack.forEach(item => {
        item.id = firebase.database().ref('workpacks/' + this.check.id).push().key
        let itemRef = workpackRef + '/' + item.id
        updates[itemRef] = item
      })
      updates[checkRef] = this.check

      firebase.database().ref().update(updates).then(
        (data) => {
          this.setLoading(false)
          this.$router.push({ name: 'Checks' })
        },
        (error) => {
          console.log(error)
          this.setLoading(false)
        }
      )
    },
    saveEditCheck () {
      this.setLoading(true)
      this.check.setShifts()
      firebase.database().ref('checks/' + this.check.id).update(this.check).then(
        (data) => {
          this.setLoading(false)
          this.$router.push({ name: 'Checks' })
        },
        (error) => {
          console.log(error)
          this.setLoading(false)
        }
      )
      console.log('save edit check')
    },
    getCheck () {
      const check = this.checks.find(item => {
        return item.id === this.checkId
      })
      if (check) {
        this.check = Object.assign(new Check(), check)
      }
    },
    getAms () {
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
      return this.workpack.map(item => {
        const task = this.ams.find(el => {
          return el.name === item.name
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
        const data = XLSX.utils.sheet_to_json(ws, { header: ['wpItem', 'name', 'zone', 'type', 'title'] })
        /* Update state */
        data.shift()
        this.workpack = data
        // this.cols = makeCols(ws['!ref'])
        this.readingIsCompleted = true
      }
      reader.readAsBinaryString(file)
    },
    cancelProgress () {
      this.dialogTitle = 'Do you want to cancel your progress?'
      this.dialog = true
    },
    onCancel () {
      this.dialog = false
      this.dialogTitle = ''
    },
    onConfirm () {
      this.$router.push({ name: 'Checks' })
    },
    allowedDates (val) {
      let min = new Date(this.check.startDate)
      let current = new Date(val)
      return new Date(current - min) >= 0
    }
  },
  created () {
    this.$store.dispatch('check/getAircraftList')
    if (this.$route.params.id) {
      this.setEditMode(true)
      this.setCheckId(this.$route.params.id)
    }
    this.getCheck()
  },
  mounted () {}
}
</script>
