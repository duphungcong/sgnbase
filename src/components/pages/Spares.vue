<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-layout row>
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
          <v-flex lg3>
            <v-select
              multiple
              :items="priorities"
              v-model="selectedPriority"
              clearable
              label="Priority"></v-select>
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
      :headers="headerSpare"
      :items="sparesByFilter"
      :pagination.sync="paginationSpare"
      :search="search"
      item-key="id">
      <template slot="items" slot-scope="props">
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.rqf }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.refName }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.description }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.pn }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.quantity }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded" :class="appFunction.priorityColor(props.item.priority)">{{ props.item.priority }}</td>
        <td class="boyd-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" small label>{{ props.item.status }}</v-chip></td>
        <td class="boyd-0" @click="props.expanded = !props.expanded">{{ appFunction.formatDate(props.item.estDate) || 'NIL' }}</td>
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
                <v-icon color="blue" slot="activator">today</v-icon><span>est date</span>
              </v-tooltip>
            </v-btn>
            <v-date-picker v-model="props.item.estDate" @change="updateEstDate(props.item)"></v-date-picker>
          </v-menu>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
          <v-card flat color="blue lighten-5" class="elevation-0">
            <v-card-actions>
              <v-btn icon class="mx-0" @click="editSpare(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                </v-tooltip>
              </v-btn>
            </v-card-actions>
            <v-card-text>
              <p>Req Date: <strong>{{ appFunction.formatDate(props.item.reqDate) }}</strong></p>
              <p>Due Date: <strong>{{ appFunction.formatDate(props.item.dueDate) }}</strong></p>
            </v-card-text>
          </v-card>
      </template>
    </v-data-table>

    <spare-dialog
      :dialog="spareDialog"
      :spare="spare"
      @save="saveSpare($event)"
      @cancel="closeSpare"></spare-dialog>

  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import SpareDialog from '@/components/SpareDialog'

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
    SpareDialog
  },
  data () {
    return {
      spareDialog: false,
      spare: {},
      search: '',
      paginationSpare: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'refName',
        descending: true
      },
      headerSpare: [
        { text: 'RQF', left: true, value: 'rqf', width: '12%' },
        { text: 'REF', left: true, value: 'refNumber', width: '12%' },
        { text: 'DESCRIPTION', left: true, value: 'description', width: '15%' },
        { text: 'P/N', left: true, value: 'pn', width: '10%' },
        { text: 'QTY', left: true, value: 'quantity', width: '5%' },
        { text: 'PRI', left: true, value: 'priority', width: '8%' },
        { text: 'STATUS', left: true, value: 'status', width: '8%' },
        { text: 'EST DATE', left: true, value: 'estDate', width: '10%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'QUICK UPDATE', sortable: false, value: '', width: '5%' }
      ],
      priorities: this.appConst.priorities,
      status: this.appConst.spareStatus,
      selectedPriority: [],
      selectedStatus: [],
      sparesByFilter: []
    }
  },
  watch: {
    spares (value) {
      this.showSpares()
    },
    selectedPriority (value) {
      value === null && (this.selectedPriority = [])
      this.showSpares()
    },
    selectedStatus (value) {
      value === null && (this.selectedStatus = [])
      this.showSpares()
    }
  },
  computed: {
    ...mapState(['spares', 'checkId']),
    ref () {
      return {
        spare: 'spares/' + this.checkId
      }
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    editSpare (spare) {
      this.spare = Object.assign({}, spare)
      this.spareDialog = true
    },
    closeSpare () {
      this.spareDialog = false
      setTimeout(() => {
        this.spare = {}
      }, 200)
    },
    saveSpare (spare) {
      this.setLoading(true)
      if (spare.id === '') {
        spare.id = firebase.database().ref(this.ref.spare).push().key
      }
      firebase.database().ref(this.ref.spare + '/' + spare.id).update(spare).then(
        (data) => {
          this.closeSpare()
          this.setLoading(false)
        },
        (error) => {
          console.log('ERROR - tasks - saveSpare -' + error.message)
          this.closeSpare()
          this.setLoading(false)
        }
      )
    },
    updateStatus (spare, status) {
      let updatedSpare = Object.assign(spare, { status: status })
      this.saveSpare(updatedSpare)
    },
    updateEstDate (spare) {
      this.saveSpare(spare)
    },
    showLog () {},
    showSpares () {
      const filterAll = compose(this.filterbyPriority, this.filterByStatus)
      this.sparesByFilter = filterAll(Object.assign([], this.spares))
    },
    filterByStatus (spares) {
      const byStatus = (arr) => {
        return arr.filter(item =>
          this.selectedStatus.some(el => el === item.status)
        )
      }
      const getSpareByStatus = filterBy(byStatus)
      return this.selectedStatus.length === 0 ? spares : getSpareByStatus(spares)
    },
    filterbyPriority (spares) {
      const byPriority = (arr) => {
        return arr.filter(item =>
          this.selectedPriority.some(el => el === item.priority)
        )
      }
      const getSparesbyPriority = filterBy(byPriority)
      return this.selectedPriority.length === 0 ? spares : getSparesbyPriority(spares)
    },
    statusColor (status) {
      if (status === 'notYet') return 'grey lighten-2'
      if (status === 'avail') return 'blue white--text'
      if (status === 'issued') return 'green white--text'
      if (status === 'cancel') return 'brown lighten-1 white--text'
    }
  },
  mounted () {
    this.showSpares()
  }
}
</script>
