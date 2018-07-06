<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="exportData">Export</v-btn>
        <v-spacer></v-spacer>
        <v-layout row>
          <v-flex xs5>
            Select Action
            <v-radio-group v-model="action" row mandatory>
              <v-radio label="In" value="receive"></v-radio>
              <v-radio label="Out" value="take out"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5>
            Select Shift
            <v-select
              :items="check.shifts"
              v-model="selectedShift"
              clearable item-text="number"
              item-value="number"></v-select>
            </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>

import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import XLSX from 'xlsx'

const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)))
}

const filterBy = (by) => {
  return (arr) => {
    return by(arr)
  }
}

export default {
  data () {
    return {
      action: 'receive',
      selectedShift: null,
      taskLogs: [],
      taskLogsByFilter: [],
      nrcLogs: [],
      nrcLogsByFilter: [],
      result: []
    }
  },
  computed: {
    ...mapState(['workpack', 'checkId']),
    check () {
      return this.$store.getters.check
    }
  },
  watch: {
    taskLogs (value) {
      this.filterTaskLogs()
    },
    nrcLogs (value) {
      this.filterNrcLogs()
    },
    selectedShift (value) {
      this.filterTaskLogs()
      this.filterNrcLogs()
    },
    action (value) {
      this.filterTaskLogs()
      this.filterNrcLogs()
    }
  },
  methods: {
    getTaskLogs () {
      firebase.database().ref('taskLogs/' + this.checkId).on('value',
        (data) => {
          let obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.taskLogs = Object.values(obj) || []
          } else {
            this.taskLogs = []
          }
        },
        (error) => {
          console.log('ERROR - export - getTaskLogs -' + error.message)
        }
      )
    },
    getNrcLogs () {
      firebase.database().ref('nrcLogs/' + this.checkId).on('value',
        (data) => {
          let obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.nrcLogs = Object.values(obj) || []
          } else {
            this.nrcLogs = []
          }
        },
        (error) => {
          console.log('ERROR - export - getNrcLogs -' + error.message)
        }
      )
    },
    filterByShift (logs) {
      const byShift = (arr) => {
        return arr.filter(item =>
          item.shift === this.selectedShift
        )
      }
      const getLogsByShift = filterBy(byShift)
      return this.selectedShift === null ? logs : getLogsByShift(logs)
    },
    filterByAction (logs) {
      const byAction = (arr) => {
        return arr.filter(item =>
          item.action === this.action
        )
      }
      const getLogsByAction = filterBy(byAction)
      return getLogsByAction(logs)
    },
    filterTaskLogs () {
      const filterAll = compose(this.filterByShift, this.filterByAction)
      this.taskLogsByFilter = filterAll(Object.assign([], this.taskLogs))
    },
    filterNrcLogs () {
      const filterAll = compose(this.filterByShift, this.filterByAction)
      this.nrcLogsByFilter = filterAll(Object.assign([], this.nrcLogs))
    },
    exportData () {
      let exported = []
      this.nrcLogsByFilter.forEach((element) => {
        let item = {
          NAME: element.refName,
          ZONE_DIVISION: element.zoneDivision,
          STATUS: element.status
        }
        exported.push(item)
      })
      this.taskLogsByFilter.forEach((element) => {
        let item = {
          NAME: element.refName,
          ZONE_DIVISION: element.zoneDivision,
          STATUS: element.status
        }
        exported.push(item)
      })
      exported.sort((a, b) => {
        return a.ZONE_DIVISION.localeCompare(b.ZONE_DIVISION) || a.NAME.localeCompare(b.NAME)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exported))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'HISTORY')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'HISTORY.xlsx')
    }
  },
  created () {
    this.getTaskLogs()
    this.getNrcLogs()
  },
  mounted () {
    this.filterTaskLogs()
    this.filterNrcLogs()
  }
}
</script>
