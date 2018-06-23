<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="addNrc">Add NRC</v-btn>
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
      :headers="headerNRC"
      :items="nrcsByFilter"
      :pagination.sync="paginationNrc"
      :search="search"
      item-key="id">
      <template slot="items" slot-scope="props" class="body-0">
        <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" label>{{ props.item.number }}</v-chip></td>
        <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
        <td class="body-0">
          <v-btn v-if="props.item.spareStatus !== undefined && props.item.spareStatus !== ''" icon class="mx-0" @click.native="showSpare(props.item)">
            <v-tooltip bottom>
              <v-icon color="blue" slot="activator" v-if="props.item.spareStatus === 'ready'">local_grocery_store</v-icon>
              <v-icon color="grey darken-2" slot="activator" v-else>local_grocery_store</v-icon><span>spares</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-if="props.item.tars !== undefined && props.item.tars.length !== ''" icon class="mx-0" @click.native="showTar(props.item)">
            <v-tooltip bottom>
              <v-icon color="grey darken-2" slot="activator">help</v-icon><span>TAR</span>
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
            <v-btn icon class="mx-0" @click.native="showLog(props.item)">
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
  </v-flex>
</template>

<script>

import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import { Nrc } from '@/models/Nrc'
import NrcDialog from '@/components/NrcDialog'
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
    NrcDialog,
    SpareDialog
  },
  data () {
    return {
      nrcDialog: false,
      spareDialog: false,
      nrc: {},
      spare: {},
      search: '',
      headerNRC: [
        { text: 'NRC', left: true, value: 'number', width: '5%' },
        { text: 'PRI', left: true, value: 'priority', width: '5%' },
        { text: 'SPARE-TAR', left: true, value: '', width: '5%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'CONTENT', left: true, value: 'content', width: '50%' },
        { text: 'REF', left: true, value: 'ref', width: '10%' },
        { text: 'ZONE', left: true, value: 'zoneDivision', width: '10%' }
      ],
      paginationNrc: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
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
    ...mapState(['nrcs', 'checkId'])
  },
  methods: {
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
      setTimeout(() => {
        this.nrc = {}
      }, 200)
    },
    saveNrc (nrc) {
      if (nrc.id === '') {
        nrc.id = firebase.database().ref('nrcs/' + this.checkId).push().key
      }
      firebase.database().ref('nrcs/' + this.checkId + '/' + nrc.id).update(nrc).then(
        (data) => {
          this.closeNrc()
        },
        (error) => {
          console.log('ERROR - nrcs - saveNrc -' + error.message)
          this.closeNrc()
        }
      )
    },
    addSpare () {
      this.spare = {}
      this.spareDialog = true
    },
    closeSpare () {
      this.spareDialog = false
      setTimeout(() => {
        this.spare = {}
      }, 200)
    },
    saveSpare (spare) {
      console.log(spare)
      this.closeSpare()
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
