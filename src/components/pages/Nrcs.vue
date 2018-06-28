<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="addNrc">Add NRC</v-btn>
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
              :items="zones"
              v-model="selectedZone"
              clearable
              label="Zone"></v-select>
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
      :headers="headerNrc"
      :items="nrcsByFilter"
      :pagination.sync="paginationNrc"
      :search="search"
      item-key="id">
      <template slot="items" slot-scope="props">
        <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" small label>{{ props.item.number }}</v-chip></td>
        <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
        <td class="body-0">
          <v-btn v-if="props.item.spareStatus !== ''" icon class="mx-0" @click.native="showSpares(props.item)">
            <v-tooltip bottom>
              <v-icon color="blue" slot="activator" v-if="props.item.spareStatus === 'ready'">local_grocery_store</v-icon>
              <v-icon color="grey" slot="activator" v-else>local_grocery_store</v-icon><span>spare</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-if="props.item.tarStatus !== ''" icon class="mx-0" @click.native="showTars(props.item)">
            <v-tooltip bottom>
              <v-icon color="blue" slot="activator" v-if="props.item.tarStatus === 'replied'">help_outline</v-icon>
              <v-icon color="grey" slot="activator" v-else>help_outline</v-icon><span>tar</span>
            </v-tooltip>
          </v-btn>
        </td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.notes }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.content }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.ref }}</td>
        <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.zoneDivision }}</td>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat color="blue lighten-5" class="elevation-0">
          <v-card-actions>
            <v-btn icon class="mx-0" @click="editNrc(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="addSpare(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">shopping_cart</v-icon><span>order</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="makeTar(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">help_outline</v-icon><span>tar</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="showLogs(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">assignment</v-icon><span>log</span>
              </v-tooltip>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <p>WO: <strong>{{ props.item.wo }}</strong></p>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>

    <nrc-dialog
      :dialog="nrcDialog"
      :nrcs="nrcs"
      :nrc="nrc"
      @save="saveNrc($event)"
      @cancel="closeNrc"></nrc-dialog>

    <spare-dialog
      :dialog="spareDialog"
      :spare="spare"
      @save="saveSpare($event)"
      @cancel="closeSpare"></spare-dialog>

    <tar-dialog
      :dialog="tarDialog"
      :tar="tar"
      @save="saveTar($event)"
      @cancel="closeTar"></tar-dialog>

    <spares-dialog
      :dialog="sparesDialog"
      :spares="sparesByNrc"
      :allReady="nrc.spareStatus === 'ready'"
      @save="saveSpares($event)"
      @cancel="closeSpares"></spares-dialog>

    <tars-dialog
      :dialog="tarsDialog"
      :tars="tarsByNrc"
      :allReplied="nrc.tarStatus === 'replied'"
      @save="saveTars($event)"
      @cancel="closeTars"></tars-dialog>

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
import { Nrc } from '@/models/Nrc'
import { Spare } from '@/models/Spare'
import { Tar } from '@/models/Tar'
import NrcDialog from '@/components/NrcDialog'
import SpareDialog from '@/components/SpareDialog'
import SparesDialog from '@/components/SparesDialog'
import TarDialog from '@/components/TarDialog'
import TarsDialog from '@/components/TarsDialog'
import LogsDialog from '@/components/LogsDialog'

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
    NrcDialog,
    SpareDialog,
    TarDialog,
    SparesDialog,
    TarsDialog,
    LogsDialog
  },
  data () {
    return {
      nrcDialog: false,
      spareDialog: false,
      tarDialog: false,
      sparesDialog: false,
      tarsDialog: false,
      logsDialog: false,
      nrc: {},
      spare: {},
      tar: {},
      logs: [],
      sparesByNrc: [],
      tarsByNrc: [],
      search: '',
      headerNrc: [
        { text: 'NRC', left: true, value: 'number', width: '5%' },
        { text: 'PRI', left: true, value: 'priority', width: '5%' },
        { text: 'SPARE - TAR', left: true, value: '', width: '5%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'CONTENT', left: true, value: 'content', width: '50%' },
        { text: 'REF', left: true, value: 'ref', width: '10%' },
        { text: 'ZONE', left: true, value: 'zoneDivision', width: '10%' }
      ],
      paginationNrc: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 25,
        sortBy: 'number',
        descending: true
      },
      zones: this.appConst.zoneSelection,
      status: this.appConst.nrcStatus,
      selectedZone: [],
      selectedStatus: [],
      nrcsByFilter: []
    }
  },
  watch: {
    nrcs (value) {
      this.showNrcs()
    },
    selectedZone (value) {
      value === null && (this.selectedZone = [])
      this.showNrcs()
    },
    selectedStatus (value) {
      value === null && (this.selectedStatus = [])
      this.showNrcs()
    }
  },
  computed: {
    ...mapState(['nrcs', 'checkId', 'spares', 'tars']),
    ref () {
      return {
        nrc: 'nrcs/' + this.checkId,
        spare: 'spares/' + this.checkId,
        tar: 'tars/' + this.checkId,
        log: 'nrcLogs/' + this.checkId
      }
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    addNrc () {
      this.nrc = new Nrc()
      this.nrc.number = this.nrcs.length + 1
      this.nrcDialog = true
    },
    editNrc (nrc) {
      this.nrc = Object.assign({}, nrc)
      this.nrcDialog = true
    },
    closeNrc () {
      this.nrcDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.nrc = {}
      }, 200)
    },
    saveNrc (nrc) {
      this.setLoading(true)
      if (nrc.id === '') {
        nrc.id = firebase.database().ref(this.ref.nrc).push().key
      }
      firebase.database().ref(this.ref.nrc + '/' + nrc.id).update(nrc).then(
        (data) => {
          this.closeNrc()
        },
        (error) => {
          console.log('ERROR - nrcs - saveNrc -' + error.message)
          this.closeNrc()
        }
      )
    },
    addSpare (nrc) {
      this.spare = new Spare(nrc)
      this.nrc = Object.assign({}, nrc)
      this.spareDialog = true
    },
    closeSpare () {
      this.spareDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.spare = {}
        this.nrc = {}
      }, 200)
    },
    saveSpare (spare) {
      this.setLoading(true)
      if (spare.id === '') {
        spare.id = firebase.database().ref(this.ref.spare).push().key
      }
      let updates = {}
      let spareRef = this.ref.spare + '/' + spare.id
      let spareStatusRef = this.ref.nrc + '/' + this.nrc.id + '/spareStatus'
      updates[spareRef] = spare
      updates[spareStatusRef] = 'order'
      firebase.database().ref().update(updates).then(
        (data) => {
          this.closeSpare()
        },
        (error) => {
          console.log('ERROR - nrcs - saveSpare -' + error.message)
          this.closeSpare()
        }
      )
    },
    showSpares (nrc) {
      this.sparesByNrc = this.spares.filter(item => item.refId === nrc.id)
      this.nrc = Object.assign({}, nrc)
      this.sparesDialog = true
    },
    closeSpares () {
      this.sparesDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.sparesByNrc = []
        this.nrc = {}
      }, 200)
    },
    saveSpares (data) {
      this.setLoading(true)
      let updates = {}
      data.spares.forEach(item => {
        updates[this.ref.spare + '/' + item.id] = item
      })
      updates[this.ref.nrc + '/' + this.nrc.id + '/spareStatus'] = data.ready ? 'ready' : 'order'
      firebase.database().ref().update(updates).then(
        (data) => {
          this.closeSpares()
        }, (error) => {
          console.log('ERROR - nrcs - saveSpares -' + error.message)
          this.closeSpares()
        }
      )
    },
    makeTar (nrc) {
      this.tar = new Tar(nrc)
      this.nrc = Object.assign({}, nrc)
      this.tarDialog = true
    },
    closeTar () {
      this.tarDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.tar = {}
        this.nrc = {}
      }, 200)
    },
    saveTar (tar) {
      this.setLoading(true)
      if (tar.id === '') {
        tar.id = firebase.database().ref(this.ref.tar).push().key
      }
      let updates = {}
      let tarRef = this.ref.tar + '/' + tar.id
      let tarStatusRef = this.ref.nrc + '/' + this.nrc.id + '/tarStatus'
      updates[tarRef] = tar
      updates[tarStatusRef] = 'sent'
      firebase.database().ref().update(updates).then(
        (data) => {
          this.closeTar()
        },
        (error) => {
          console.log('ERROR - nrcs - saveTar -' + error.message)
          this.closeTar()
        }
      )
    },
    showTars (nrc) {
      this.tarsByNrc = this.tars.filter(item => item.refId === nrc.id)
      this.nrc = Object.assign({}, nrc)
      this.tarsDialog = true
    },
    closeTars () {
      this.tarsDialog = false
      this.setLoading(false)
      setTimeout(() => {
        this.tarsByNrc = []
        this.nrc = {}
      }, 200)
    },
    saveTars (data) {
      this.setLoading(true)
      let updates = {}
      data.tars.forEach(item => {
        updates[this.ref.tar + '/' + item.id] = item
      })
      updates[this.ref.nrc + '/' + this.nrc.id + '/tarStatus'] = data.replied ? 'replied' : 'sent'
      firebase.database().ref().update(updates).then(
        (data) => {
          this.closeTars()
        }, (error) => {
          console.log('ERROR - nrcs - saveTars -' + error.message)
          this.closeTars()
        }
      )
    },
    showLogs (nrc) {
      this.nrc = Object.assign({}, nrc)

      this.setLoading(true)

      firebase.database().ref(this.ref.log).orderByChild('refId').equalTo(this.nrc.id).once('value').then(
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
        this.nrc = {}
      }, 200)
    },
    showNrcs () {
      const filterAll = compose(this.filterByZone, this.filterByStatus)
      this.nrcsByFilter = filterAll(Object.assign([], this.nrcs))
    },
    filterByStatus (nrcs) {
      const byStatus = (arr) => {
        return arr.filter(item =>
          this.selectedStatus.some(el => el === item.status)
        )
      }
      const getNrcsByStatus = filterBy(byStatus)
      return this.selectedStatus.length === 0 ? nrcs : getNrcsByStatus(nrcs)
    },
    filterByZone (nrcs) {
      const byZone = (arr) => {
        return arr.filter(item =>
          this.selectedZone.some(el => el === item.zoneDivision)
        )
      }
      const getNrcsByZone = filterBy(byZone)
      return this.selectedZone.length === 0 ? nrcs : getNrcsByZone(nrcs)
    },
    statusColor (status) {
      if (status === 'inProgress') return 'yellow darken-3 white--text'
      if (status === 'out') return 'blue-grey white--text'
      if (status === 'notYet') return 'grey lighten-2'
      if (status === 'ready') return 'blue white--text'
      if (status === 'done') return 'green white--text'
      if (status === 'cancel') return 'brown lighten-1 white--text'
    },
    priorityColor (priority) {
      if (priority === 'AOG') return 'red--text body-1'
    }
  },
  mounted () {
    this.showNrcs()
  }
}
</script>
