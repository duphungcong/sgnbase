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
      :items="nrcs"
      :pagination.sync="paginationNrc"
      :search="search"
      item-key="id">
      <template slot="items" slot-scope="props" class="body-0">
        <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" label>{{ props.item.number }}</v-chip></td>
        <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
        <td class="body-0">
          <v-btn v-if="props.item.spareStatus !== undefined && props.item.spareStatus !== ''" icon class="mx-0" @click.native="showNRCSpares(props.item)">
            <v-tooltip bottom>
              <v-icon color="blue" slot="activator" v-if="props.item.spareStatus === 'ready'">local_grocery_store</v-icon>
              <v-icon color="grey darken-2" slot="activator" v-else>local_grocery_store</v-icon><span>spares</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-if="props.item.tars !== undefined && props.item.tars.length !== ''" icon class="mx-0" @click.native="showTAR(props.item)">
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
            <v-btn icon class="mx-0" @click="editNRC(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="orderSpare(props.item)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">add_shopping_cart</v-icon><span>order</span>
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
  </v-flex>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      search: '',
      headerNRC: [
        { text: 'NRC', left: true, value: 'number' },
        { text: 'PRI', left: true, value: 'priority' },
        { text: 'SPARE-TAR', left: true, value: '' },
        { text: 'NOTES', left: true, value: 'notes' },
        { text: 'CONTENT', left: true, value: 'content' },
        { text: 'REF', left: true, value: 'ref' },
        { text: 'ZONE', left: true, value: 'zone' }
      ],
      paginationNrc: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'number',
        descending: true
      },
      zones: this.appConst.zoneSelection,
      status: this.appConst.status,
      selectedZone: [],
      selectedStatus: []
    }
  },
  watch: {
    selectedZone (value) {
      value === null && (this.selectedZone = [])
    },
    selectedStatus (value) {
      value === null && (this.selectedStatus = [])
    }
  },
  computed: {
    ...mapState(['nrcs'])
  },
  methods: {
    statusColor (status) {
      if (status === 'inProgress') return 'yellow darken-3 white--text'
      if (status === 'out') return 'blue-grey white--text'
      if (status === 'notYet') return 'grey lighten-2'
      if (status === 'ready') return 'blue white--text'
      if (status === 'done') return 'green white--text'
      if (status === 'cancel') return 'line-bg white--text'
    },
    priorityColor (priority) {
      if (priority === 'AOG') return 'red--text body-1'
    }
  }
}
</script>
