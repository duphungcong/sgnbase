<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="exportData">Export</v-btn>
        <v-spacer></v-spacer>
        <v-layout row>
          <v-flex lg2></v-flex>
           <v-flex lg4>
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
      :headers="header"
      :items="tarsByFilter"
      :pagination.sync="pagination"
      :search="search"
      item-key="id">
      <template slot="items" slot-scope="props">
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.number }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.question }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.answer }}</td>
         <td class="boyd-0" @click="props.expanded = !props.expanded">{{ appFunction.formatDate(props.item.sendDate) || 'NIL' }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ appFunction.formatDate(props.item.replyDate) || 'NIL' }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.zoneDivision }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded"><v-chip :class="appFunction.tarStatusColor(props.item.status)" small label>{{ props.item.status }}</v-chip></td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL'}}</td>
        <td class="body-0">
          <v-menu bottom right>
            <v-btn icon class="mx-0" slot="activator">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">edit</v-icon><span>status</span>
              </v-tooltip>
            </v-btn>
            <v-list>
              <v-list-tile v-for="sta in status" :key="sta" @click="updateStatus(props.item, sta)">
                <v-list-tile-title v-text="sta"></v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-menu
            lazy
            transition="scale-transition"
            offset-y
            :nudge-right="40"
            min-width="290px">
            <v-btn icon class="mx-0" slot="activator">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">today</v-icon><span>reply date</span>
              </v-tooltip>
            </v-btn>
            <v-date-picker v-model="props.item.replyDate" @change="updateReplyDate(props.item)"></v-date-picker>
          </v-menu>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
          <v-card flat color="blue lighten-5" class="elevation-0">
            <v-card-actions>
              <v-btn icon class="mx-0" @click="editTar(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                </v-tooltip>
              </v-btn>
            </v-card-actions>
          </v-card>
      </template>
    </v-data-table>

    <tar-dialog
      :dialog="tarDialog"
      :tar="tar"
      @save="saveTar($event)"
      @cancel="closeTar"></tar-dialog>

  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import TarDialog from '@/components/TarDialog'
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
  components: {
    TarDialog
  },
  data () {
    return {
      tarDialog: false,
      tar: {},
      search: '',
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'refName',
        descending: true
      },
      header: [
        { text: 'NUMBER', left: true, value: 'number', width: '10%' },
        { text: 'QUESTION', left: true, value: 'question', width: '20%' },
        { text: 'ANSWER', left: true, value: 'answer', width: '20%' },
        { text: 'SEND DATE', left: true, value: 'sendDate', width: '5%' },
        { text: 'REPLY DATE', left: true, value: 'replyDate', width: '5%' },
        { text: 'ZONE', left: true, value: 'zoneDivision', width: '10%' },
        { text: 'STATUS', left: true, value: 'status', width: '10%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'QUICK UPDATE', sortable: false, value: '', width: '5%' }
      ],
      status: this.appConst.tarStatus,
      selectedStatus: [],
      tarsByFilter: []
    }
  },
  watch: {
    tars (value) {
      this.showTars()
    },
    selectedStatus (value) {
      value === null && (this.selectedStatus = [])
      this.showTars()
    }
  },
  computed: {
    ...mapState(['tars', 'checkId']),
    ref () {
      return {
        tar: 'tars/' + this.checkId
      }
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    editTar (tar) {
      this.tar = Object.assign({}, tar)
      this.tarDialog = true
    },
    closeTar () {
      this.tarDialog = false
      setTimeout(() => {
        this.tar = {}
      }, 200)
    },
    saveTar (tar) {
      this.setLoading(true)
      if (tar.id === '') {
        tar.id = firebase.database().ref(this.ref.tar).push().key
      }
      firebase.database().ref(this.ref.tar + '/' + tar.id).update(tar).then(
        (data) => {
          this.closeTar()
          this.setLoading(false)
        },
        (error) => {
          console.log('ERROR - tasks - saveTar -' + error.message)
          this.closeTar()
          this.setLoading(false)
        }
      )
    },
    updateStatus (tar, status) {
      let updatedTar = Object.assign(tar, { status: status })
      this.saveTar(updatedTar)
    },
    updateReplyDate (tar) {
      this.saveTar(tar)
    },
    showTars () {
      const filterAll = compose(this.filterByStatus)
      this.tarsByFilter = filterAll(Object.assign([], this.tars))
    },
    filterByStatus (tar) {
      const byStatus = (arr) => {
        return arr.filter(item =>
          this.selectedStatus.some(el => el === item.status)
        )
      }
      const getTarByStatus = filterBy(byStatus)
      return this.selectedStatus.length === 0 ? tar : getTarByStatus(tar)
    },
    exportData () {
      let exported = []
      this.tarsByFilter.forEach((element) => {
        let item = {
          NUMBER: element.number,
          QUESTION: element.question,
          ANSWER: element.answer,
          SEND: this.appFunction.formatDate(element.sendDate) || 'NIL',
          REPLY: this.appFunction.formatDate(element.replyDate) || 'NIL',
          ZONE: element.zoneDivision,
          STATUS: element.status,
          NOTES: element.notes
        }
        exported.push(item)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exported))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'TARS')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'TARS.xlsx')
    }
  },
  mounted () {
    this.showTars()
  }
}
</script>
