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

    <v-data-table
      :headers="headerTask"
      :items="workpackByTab"
      :pagination.sync="paginationTask"
      :search="search"
      item-key="wpItem"
      >
      <template slot="items" slot-scope="props">
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.title }}</td>
        <td class="body-0" @click="editShift(props.item)"><v-chip v-for="shift in props.item.shifts" :key="shift" label :color="shiftColor(props.item.shifts, shift, props.item.status)">{{ shift }}</v-chip></td>
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
            <v-menu transition="slide-x-transition">
              <v-btn icon class="mx-0" slot="activator">
                <v-tooltip bottom>
                    <v-icon color="blue" slot="activator" medium>forward</v-icon><span>move to</span>
                </v-tooltip>
              </v-btn>
              <v-list>
                <v-list-tile v-for="zone in zoneSelection" :key="zone" @click="moveTask(zone, props.item)">
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
  </v-flex>
</template>

<script>

import { mapState } from 'vuex'

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

const zoneSelection = [
  'N/A',
  '100-200-800',
  '300-400',
  '500-600-700',
  'AVIONIC',
  'STRUCTURE',
  'CABIN',
  'CLEANING'
]

export default {
  data () {
    return {
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
      zoneSelection: zoneSelection
    }
  },
  computed: {
    ...mapState(['workpack'])
  },
  watch: {
    tabs (value) {
      this.showTab(value)
    }
  },
  methods: {
    editShift () {},
    editTask () {},
    moveTask () {},
    deleteTask () {},
    showLog () {},
    showTab (tab) {
      this.workpackByTab = Object.assign([], this.filterByTab(tab))
    },
    filterByTab (tab) {
      if (zoneByTab(tab) === 'ALL') {
        return this.workpack
      } else if (zoneByTab(tab) === 'N/A') {
        return this.workpack.filter(item =>
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
        return this.workpack.filter(item => item.zoneDivision.indexOf(zoneByTab(tab)) === 0)
      }
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
    this.showTab(this.tabs)
  }
}
</script>
