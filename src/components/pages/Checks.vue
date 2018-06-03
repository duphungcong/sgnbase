<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn fab small dark class="red" @click.native="addCheck">
          <v-icon>add</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
        &nbsp;
      </v-card-title>

      <v-data-table :headers="headers" :items="checks" :search="search" :pagination.sync="pagination">
        <template slot="items" slot-scope="props" class="body-2">
          <td class="body-2">{{ props.item.aircraft.name }}</td>
          <td class="body-2">{{ props.item.name }}</td>
          <td class="body-2">{{ formatDate(props.item.startDate) }}</td>
          <td class="body-2">{{ formatDate(props.item.finishDate) }}</td>
          <td class="body-2">{{ remainDay(props.item.startDate, props.item.finishDate) }}</td>
          <td class="text-xs-right">
            <v-btn icon class="mx-0" @click.native="followCheck(props.item.id)">
              <v-tooltip bottom>
                <v-icon color="blue" slot="activator">touch_app</v-icon><span>follow</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="editCheck(props.item.id)">
              <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
              </v-tooltip>
            </v-btn>
            <v-btn icon class="mx-0" @click.native="deleteCheck(props.item.id)">
              <v-tooltip bottom>
                  <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
              </v-tooltip>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <confirm-dialog
      :dialog="dialog"
      :title="dialogTitle"
      @onConfirm="onConfirm"
      @onCancel="onCancel"></confirm-dialog>
  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  components: {
    ConfirmDialog
  },
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      search: '',
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'startDate',
        descending: true
      },
      headers: [
        { text: 'Aircraft', left: true, value: 'aircraft.name' },
        { text: 'Name', left: true, value: 'name' },
        { text: 'From', left: true, value: 'startDate' },
        { text: 'To', left: true, value: 'finishDate' },
        { text: 'Status', left: true, value: '' },
        { text: '', sortable: false, value: '' }
      ]
    }
  },
  computed: {
    ...mapState(['checks'])
  },
  methods: {
    ...mapMutations('confirmdialog', ['showDialog', 'closeDialog']),
    addCheck () {
      this.$router.push({ name: 'Check' })
    },
    editCheck (checkId) {
      this.$router.push({ name: 'Check', params: { id: checkId } })
    },
    deleteCheck (checkId) {
      this.dialogTitle = 'Do you want to delete this check?'
      this.dialog = true
    },
    onCancel () {
      this.dialog = false
      this.dialogTitle = ''
    },
    onConfirm () {
      this.onCancel()
    },
    followCheck (checkId) {
      this.$store.dispatch('followCheck', checkId)
    },
    formatDate (dateStr) {
      let date = new Date(dateStr)
      return date.toDateString()
    },
    remainDay (startDate, finishDate) {
      let start = new Date(startDate)
      let finish = new Date(finishDate)
      let today = Date.now(7)
      let diff1 = new Date(start - today)
      let diff2 = new Date(finish - today)
      if (diff1 > 0) {
        let remain1 = diff1.getUTCDate() - 1
        return remain1 + ' days to start'
      }
      if (diff2 > 0) {
        let remain2 = diff2.getUTCDate()
        return remain2 + ' days to finish'
      }
      return 'completed'
    }
  },
  created () {
    this.$store.dispatch('getChecks')
  }
}
</script>
