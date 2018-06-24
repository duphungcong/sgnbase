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
        <v-layout row>
          <v-flex lg1></v-flex>
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
          <v-flex lg5>
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
      :headers="headerTask"
      :items="workpackByTab"
      :pagination.sync="paginationTask"
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
            <v-btn icon class="mx-0" @click.native="showLog(props.item)">
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
      :editMode="true"
      :task="task"
      @save="submitEditTask($event)"
      @cancel="closeEditTask">
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

  </v-flex>
</template>

<script>

import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import { Spare } from '@/models/Spare'
import ShiftDialog from '@/components/ShiftDialog'
import TaskDialog from '@/components/TaskDialog'
import EoDialog from '@/components/EoDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import SpareDialog from '@/components/SpareDialog'

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
    SpareDialog
  },
  data () {
    return {
      task: {},
      spare: {},
      shiftDialog: false,
      taskDialog: false,
      eoDialog: false,
      confirmDialog: false,
      spareDialog: false,
      tabs: 'tab-0',
      search: '',
      workpackByTab: [],
      headerTask: [
        { text: 'TITLE', left: true, value: 'title', width: '20%' },
        { text: 'STATUS', left: true, value: 'status', width: '15%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'WP ITEM', left: true, value: 'wpItem', width: '15%' },
        { text: 'TYPE', left: true, value: 'type', width: '5%' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' }
      ],
      paginationTask: {
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
        spare: 'spares/' + this.check.id
      }
    },
    currentShift () {
      let today = Date.now()
      let start = new Date(this.check.startDate)
      if (today < start) {
        return 0
      }
      let diff = new Date(today - start)
      return diff.getUTCDate()
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
    editShift (task) {
      this.task = Object.assign({}, task)
      this.shiftDialog = true
    },
    closeEditShift () {
      this.shiftDialog = false
      setTimeout(() => {
        this.task = {}
      }, 200)
    },
    saveEditShift (shifts) {
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
    editTask (task) {
      this.task = Object.assign({}, task)
      this.taskDialog = true
    },
    closeEditTask () {
      this.taskDialog = false
      setTimeout(() => {
        this.task = {}
      }, 100)
    },
    isEo (task) {
      return task.name.indexOf('VN ') === 0
    },
    submitEditTask (task) {
      if (!this.isEo(task)) {
        if (task.taskId === '') {
          this.createAmsTask(task, this.saveEditTask)
        } else {
          this.updateAmsTask(task, this.saveEditTask)
        }
      } else {
        this.saveEditTask(task, this.closeEditTask)
      }
    },
    saveEditTask (task, callback) {
      console.log('saving task')
      firebase.database().ref(this.ref.workpack + '/' + task.id).set(task).then(
        (data) => {
          callback()
        },
        (error) => {
          console.log('ERROR - tasks - saveEditTask -' + error.message)
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
          callback(task, this.closeEditTask)
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
          callback(Object.assign(task, { taskId: amsTask.id }), this.closeEditTask)
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
      this.updateEo(eo, this.saveEditTask)
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
    showLog () {},
    showTab () {
      const filterAll = compose(this.filterByShift, this.filterByStatus, this.filterByTab)
      this.workpackByTab = filterAll(Object.assign([], this.workpack))
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
    }
  },
  mounted () {
    this.showTab()
  }
}
</script>
