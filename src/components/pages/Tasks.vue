<template>
  <v-flex xs12>
    <v-tabs
      height="40"
      fixed-tabs
      slider-color="red"
      show-arrows
      v-model="tabs">
      <v-tab href="#tab-0">All</v-tab>
      <v-tab href="#tab-1">Zone 128</v-tab>
      <v-tab href="#tab-2">Zone 34</v-tab>
      <v-tab href="#tab-3">Zone 567</v-tab>
      <v-tab href="#tab-4">Avionic</v-tab>
      <v-tab href="#tab-5">Structure</v-tab>
      <v-tab href="#tab-6">Cabin</v-tab>
      <v-tab href="#tab-7">Cleaning</v-tab>
      <v-tab href="#tab-8">Uncategorized</v-tab>
      <v-tab href="#tab-9">Removed</v-tab>
    </v-tabs>

    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="addTask">Add Task</v-btn>
        <v-btn depressed small dark color="primary" @click.native="exportData">Export</v-btn>
        <v-spacer></v-spacer>
        <v-layout row>
           <v-flex lg3>
            <v-select
              multiple
              :items="check.shifts"
              v-model="selectedShift"
              clearable item-text="number"
              item-value="number"
              label="Shift"></v-select>
          </v-flex>
          <v-flex lg1></v-flex>
          <v-flex lg3>
            <v-select
              multiple
              :items="status"
              v-model="selectedStatus"
              clearable
              label="Status"></v-select>
          </v-flex>
          <v-flex lg1></v-flex>
          <v-flex lg4>
            <v-text-field
              prepend-icon="search"
              label="Search"
              single-line hide-details
              v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>

    <v-data-table
      :headers="header"
      :items="workpackByTab"
      :pagination.sync="pagination"
      :search="search"
      item-key="wpItem"
      >
      <template slot="items" slot-scope="props">
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.title }}</td>
        <td class="body-0" @click="editShift(props.item)"><v-chip v-for="shift in props.item.shifts" :key="shift" small label :color="shiftColor(props.item.shifts, shift, props.item.status)">{{ shift }}</v-chip></td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.notes }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.wpItem }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.type }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.zoneDivision }}</td>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat color="blue lighten-5" class="elevation-0">
          <v-card-actions>
            <v-btn icon class="mx-0" @click.native="editTask(props.item)">
              <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="addSpare(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">shopping_cart</v-icon><span>order</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="linkTask(props.item)" v-if="isEo(props.item)">
              <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">link</v-icon><span>link</span>
              </v-tooltip>
            </v-btn>
            <v-menu transition="slide-x-transition">
              <v-btn icon class="mx-0" slot="activator">
                <v-tooltip bottom>
                    <v-icon color="blue" slot="activator" medium>forward</v-icon><span>move to</span>
                </v-tooltip>
              </v-btn>
              <v-list>
                <v-list-tile v-for="zone in zones" :key="zone" @click="moveTask(zone, props.item)">
                  <v-list-tile-title v-text="zone"></v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn icon class="mx-0" @click.native="deleteTask(props.item)" v-if="tabs !== 'tab-9'">
              <v-tooltip bottom>
                  <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="showLogs(props.item)">
              <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">assignment</v-icon><span>log</span>
              </v-tooltip>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <p>Zone: <strong>{{ props.item.zone }}</strong></p>
            <p>Task: <strong>{{ props.item.name }}</strong></p>
            <p>Remarks: <strong>{{ props.item.remarks }}</strong></p>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>

    <shift-dialog
      :dialog="shiftDialog"
      :checkShifts="check.shifts"
      :taskShifts="task.shifts"
      @save="saveEditShift($event)"
      @cancel="closeEditShift">
    </shift-dialog>

    <task-dialog
      :dialog="taskDialog"
      :task="task"
      @save="submitTask($event)"
      @cancel="closeTask">
    </task-dialog>

    <eo-dialog
      :dialog="eoDialog"
      :list="eo"
      @save="submitLinkTask($event)"
      @cancel="closeLinkTask">
    </eo-dialog>

    <confirm-dialog
      :dialog="confirmDialog"
      title="Do you want to delete this task"
      @confirm="submitDeleteTask"
      @cancel="closeDeleteTask"></confirm-dialog>

    <spare-dialog
      :dialog="spareDialog"
      :spare="spare"
      @save="saveSpare($event)"
      @cancel="closeSpare"></spare-dialog>

    <logs-dialog
      :dialog="logsDialog"
      :logs="logs"
      @cancel="closeLogs"></logs-dialog>

  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import { Task } from '@/models/Task'
import { Spare } from '@/models/Spare'
import ShiftDialog from '@/components/ShiftDialog'
import TaskDialog from '@/components/TaskDialog'
import EoDialog from '@/components/EoDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import SpareDialog from '@/components/SpareDialog'
import LogsDialog from '@/components/LogsDialog'
import XLSX from 'xlsx'

const zoneByTab = (tab) => ({
  'tab-0': 'ALL',
  'tab-1': '100-200-800',
  'tab-2': '300-400',
  'tab-3': '500-600-700',
  'tab-4': 'AVI',
  'tab-5': 'STRUCTURE',
  'tab-6': 'CABIN',
  'tab-7': 'CLEANING',
  'tab-8': 'N/A',
  'tab-9': 'REMOVED'
})[tab]

const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)))
}

const filterBy = (by) => {
  return (arr) => {
    return by(arr)
  }
}

export default {
  components: {
    ShiftDialog,
    TaskDialog,
    EoDialog,
    ConfirmDialog,
    SpareDialog,
    LogsDialog
  },
  data () {
    return {
      task: {},
      spare: {},
      logs: [],
      shiftDialog: false,
      taskDialog: false,
      eoDialog: false,
      confirmDialog: false,
      spareDialog: false,
      logsDialog: false,
      tabs: 'tab-0',
      search: '',
      workpackByTab: [],
      header: [
        { text: 'TITLE', left: true, value: 'title', width: '20%' },
        { text: 'SHIFTS', left: true, value: 'status', width: '15%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'WP ITEM', left: true, value: 'wpItem', width: '15%' },
        { text: 'TYPE', left: true, value: 'type', width: '5%' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'zoneDivision'
      },
      zones: this.appConst.zoneSelection,
      status: this.appConst.taskStatus,
      selectedShift: [],
      selectedStatus: []
    }
  },
  computed: {
    ...mapState(['workpack', 'eo']),
    check () {
      return this.$store.getters.check
    },
    ref () {
      return {
        ams: 'ams' + this.check.aircraft.type,
        workpack: 'workpacks/' + this.check.id,
        spare: 'spares/' + this.check.id,
        log: 'taskLogs/' + this.check.id
      }
    },
    currentShift () {
      return this.appFunction.currentShift(this.check.startDate)
    }
  },
  watch: {
    tabs (value) {
      this.showTab()
    },
    workpack (value) {
      this.showTab()
    },
    selectedShift (value) {
      value === null && (this.selectedShift = [])
      this.showTab()
    },
    selectedStatus (value) {
      value === null && (this.selectedStatus = [])
      this.showTab()
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    editShift (task) {
      this.task = Object.assign({}, task)
      this.shiftDialog = true
    },
    closeEditShift () {
      this.shiftDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.task = {}
      }, 200)
    },
    saveEditShift (shifts) {
      this.setLoading(true)
      let sortedShifts = shifts.sort((a, b) => {
        return a - b
      })
      firebase.database().ref(this.ref.workpack + '/' + this.task.id + '/shifts').set(sortedShifts).then(
        (data) => {
          this.closeEditShift()
        },
        (error) => {
          console.log('ERROR - tasks - saveEditShift -' + error.message)
          this.closeEditShift()
        }
      )
    },
    addTask () {
      this.task = new Task()
      this.taskDialog = true
    },
    editTask (task) {
      this.task = Object.assign({}, task)
      this.taskDialog = true
    },
    closeTask () {
      this.taskDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.task = {}
      }, 100)
    },
    isEo (task) {
      return task.name.indexOf('VN ') === 0
    },
    submitTask (task) {
      this.setLoading(true)
      if (!this.isEo(task)) {
        if (task.taskId === '') {
          this.createAmsTask(task, this.saveTask)
        } else {
          this.updateAmsTask(task, this.saveTask)
        }
      } else {
        this.saveTask(task, this.closeTask)
      }
    },
    saveTask (task, callback) {
      if (task.id === '') {
        task.id = firebase.database().ref(this.ref.workpack).push().key
      }
      firebase.database().ref(this.ref.workpack + '/' + task.id).set(task).then(
        (data) => {
          callback()
        },
        (error) => {
          console.log('ERROR - tasks - saveTask -' + error.message)
          callback()
        }
      )
    },
    updateAmsTask (task, callback) {
      let updatedData = {
        amsMH: task.amsMH,
        macMH: task.macMH,
        men: task.men,
        hour: task.hour,
        zoneDivision: task.zoneDivision,
        remarks: task.remarks
      }
      firebase.database().ref(this.ref.ams + '/' + task.taskId).update(updatedData).then(
        (data) => {
          console.log('saving task after update ams task')
          callback(task, this.closeTask)
        },
        (error) => {
          console.log('ERROR - tasks - updateAmsTask -' + error.message)
        }
      )
    },
    createAmsTask (task, callback) {
      let amsTask = {
        amsMH: task.amsMH,
        macMH: task.macMH,
        men: task.men,
        hour: task.hour,
        name: task.name,
        title: task.title,
        type: task.type,
        zone: task.zone,
        zoneDivision: task.zoneDivision,
        remarks: task.remarks
      }
      amsTask.id = firebase.database().ref(this.ref.ams).push().key

      firebase.database().ref(this.ref.ams + '/' + amsTask.id).set(amsTask).then(
        (data) => {
          console.log('saving task after create ams task')
          callback(Object.assign(task, { taskId: amsTask.id }), this.closeTask)
        },
        (error) => {
          console.log('ERROR - tasks - createAmsTask -' + error.message)
        }
      )
    },
    addSpare (task) {
      this.spare = new Spare(task)
      this.spareDialog = true
    },
    closeSpare () {
      this.spareDialog = false
      setTimeout(() => {
        this.spare = {}
      }, 200)
    },
    saveSpare (spare) {
      if (spare.id === '') {
        spare.id = firebase.database().ref(this.ref.spare).push().key
      }
      firebase.database().ref(this.ref.spare + '/' + spare.id).update(spare).then(
        (data) => {
          this.closeSpare()
        },
        (error) => {
          console.log('ERROR - tasks - saveSpare -' + error.message)
          this.closeSpare()
        }
      )
    },
    linkTask (task) {
      this.task = Object.assign({}, task)
      this.eoDialog = true
    },
    closeLinkTask () {
      this.eoDialog = false
      setTimeout(() => {
        this.task = {}
      }, 100)
    },
    submitLinkTask (eo) {
      this.updateEo(eo, this.saveTask)
    },
    updateEo (eo, callback) {
      firebase.database().ref('eo/' + eo.id).update(eo).then(
        (data) => {
          console.log('saving task after update eo')
          callback(Object.assign(this.task, {
            amsMH: eo.amsMH,
            macMH: eo.macMH,
            men: eo.men,
            hour: eo.hour,
            zoneDivision: eo.zoneDivision,
            remarks: eo.remarks
          }), this.closeLinkTask)
        },
        (error) => {
          console.log('ERROR - tasks - updateEo -' + error.message)
        }
      )
    },
    moveTask (zone, task, callback) {
      let zoneDivision = zone + ' from ' + task.zoneDivision
      firebase.database().ref(this.ref.workpack + '/' + task.id + '/zoneDivision').set(zoneDivision).then(
        (data) => {
          callback()
        },
        (error) => {
          console.log('ERROR - tasks - moveTask -' + error.message)
        }
      )
    },
    deleteTask (task) {
      this.task = Object.assign({}, task)
      this.confirmDialog = true
    },
    submitDeleteTask () {
      this.moveTask('REMOVED', this.task, this.closeDeleteTask)
    },
    closeDeleteTask () {
      this.confirmDialog = false
      this.task = {}
    },
    showLogs (task) {
      this.task = Object.assign({}, task)

      this.setLoading(true)

      firebase.database().ref(this.ref.log).orderByChild('refId').equalTo(this.task.id).once('value').then(
        (data) => {
          let obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.logs = Object.values(obj) || []
          }
          this.setLoading(false)
          this.logsDialog = true
        }, (error) => {
          console.log('ERROR - tasks - showLogs -' + error.message)
          this.setLoading(false)
        }
      )
    },
    closeLogs () {
      this.logsDialog = false
      setTimeout(() => {
        this.logs = []
        this.task = {}
      }, 200)
    },
    showTab () {
      const filterAll = compose(this.filterByShift, this.filterByStatus, this.filterByTab)
      this.workpackByTab = filterAll(this.workpack.slice())
    },
    filterByTab (workpack) {
      if (zoneByTab(this.tabs) === 'ALL') {
        return workpack
      } else if (zoneByTab(this.tabs) === 'N/A') {
        return workpack.filter(item =>
          item.zoneDivision.indexOf('N/A') === 0 ||
          (item.zoneDivision.indexOf('100-200-800') === -1 &&
          item.zoneDivision.indexOf('300-400') === -1 &&
          item.zoneDivision.indexOf('500-600-700') === -1 &&
          item.zoneDivision.indexOf('AVI') === -1 &&
          item.zoneDivision.indexOf('STRUCTURE') === -1 &&
          item.zoneDivision.indexOf('CAB') === -1 &&
          item.zoneDivision.indexOf('CLEANING') === -1 &&
          item.zoneDivision.indexOf('REMOVED') === -1))
      } else {
        return workpack.filter(item => item.zoneDivision.indexOf(zoneByTab(this.tabs)) === 0)
      }
    },
    filterByShift (workpack) {
      const byShift = (arr) => {
        return arr.filter(item =>
          item.shifts.some(el => this.selectedShift.includes(el))
        )
      }
      const getWorkpackByShift = filterBy(byShift)
      return this.selectedShift.length === 0 ? workpack : getWorkpackByShift(workpack)
    },
    filterByStatus (workpack) {
      const byStatus = (arr) => {
        return arr.filter(item =>
          this.selectedStatus.some(el => el === item.status)
        )
      }
      const getWorkpackByStatus = filterBy(byStatus)
      return this.selectedStatus.length === 0 ? workpack : getWorkpackByStatus(workpack)
    },
    shiftColor (shifts, shiftNumber, taskStatus) {
      if (this.currentShift === 0) {
        return 'grey lighten-2'
      }
      let lastShiftNumber = shifts[shifts.length - 1]
      if (taskStatus === 'done') {
        return 'green'
      }
      if (taskStatus === 'out') {
        return 'blue-grey'
      }
      if (taskStatus === 'inProgress') {
        if (shiftNumber < this.currentShift && shiftNumber === lastShiftNumber) {
          return 'orange darken-3'
        } else if (shiftNumber > this.currentShift) {
          return 'grey lighten-2'
        } else {
          return 'yellow darken-3'
        }
      }
      if (taskStatus === 'notYet') {
        if (shiftNumber <= this.currentShift) {
          return 'red'
        } else {
          return 'grey lighten-2'
        }
      }
    },
    exportData () {
      let exported = []
      this.workpackByTab.forEach((element) => {
        let item = {
          WP_ITEM: element.wpItem,
          TASK: element.name,
          ZONE: element.zone,
          TASK_TYPE: element.type,
          TITLE: element.title,
          AMS_MH: element.amsMH,
          MAC_MH: element.macMH,
          MEN: element.men,
          HOURS: element.hour,
          ZONE_DIVISION: element.zoneDivision,
          REMARKS: element.remarks
        }
        exported.push(item)
      })
      // console.log(exported)
      exported.sort((a, b) => {
        return a.ZONE_DIVISION.localeCompare(b.ZONE_DIVISION) || a.WP_ITEM.localeCompare(b.WP_ITEM)
      })
      // console.log(exported)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exported))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ZD')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'TASKS.xlsx')
    }
  },
  mounted () {
    this.showTab()
  }
}
</script>
