<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title>
        <v-btn depressed small dark color="primary" @click.native="addCheck">New Check</v-btn>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
        &nbsp;
      </v-card-title>

      <v-data-table :headers="headers" :items="checks" :search="search" :pagination.sync="pagination">
        <template slot="items" slot-scope="props" class="body-2">
          <td class="body-2">{{ props.item.aircraft.name }}</td>
          <td class="body-2">{{ props.item.name }}</td>
          <td class="body-2">{{ appFunction.formatDate(props.item.startDate) }}</td>
          <td class="body-2">{{ appFunction.formatDate(props.item.finishDate) }}</td>
          <td class="text-xs-right">
            <v-btn flat outline small color="success" @click.native="followCheck(props.item.id)">Follow</v-btn>
            <v-btn flat outline small color="primary" @click.native="editCheck(props.item.id)">Edit</v-btn>
            <v-btn flat outline  small color="error" @click.native="confirmDelete(props.item.id)">Delete</v-btn>
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
      @confirm="submitDelete"
      @cancel="closeDelete"></confirm-dialog>
  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  components: {
    ConfirmDialog
  },
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      deletedCheckId: null,
      search: '',
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'startDate',
        descending: true
      },
      headers: [
        { text: 'Aircraft', left: true, value: 'aircraft.name', width: '15%' },
        { text: 'Name', left: true, value: 'name', width: '25%' },
        { text: 'From', left: true, value: 'startDate', width: '10%' },
        { text: 'To', left: true, value: 'finishDate', width: '10%' },
        { text: '', sortable: false, value: '', width: '40%' }
      ]
    }
  },
  computed: {
    ...mapState(['checks'])
  },
  methods: {
    ...mapMutations(['setLoading']),
    ...mapMutations('confirmdialog', ['showDialog', 'closeDialog']),
    addCheck () {
      this.$router.push({ name: 'Check' })
    },
    editCheck (id) {
      this.$router.push({ name: 'Check', params: { id: id } })
    },
    deleteCheck () {
      this.setLoading(true)
      let removes = {}
      removes['/checks/' + this.deletedCheckId] = null
      removes['/workpacks/' + this.deletedCheckId] = null
      removes['/nrcs/' + this.deletedCheckId] = null
      removes['/tars/' + this.deletedCheckId] = null
      removes['/spares/' + this.deletedCheckId] = null
      firebase.database().ref().update(removes).then(
        (data) => {
          this.closeDelete()
          this.setLoading(false)
        },
        (error) => {
          console.log(error)
          this.closeDelete()
          this.setLoading(false)
        }
      )
    },
    confirmDelete (checkId) {
      this.dialogTitle = 'Do you want to delete this check?'
      this.deletedCheckId = checkId
      console.log(this.deletedCheckId)
      this.dialog = true
    },
    closeDelete () {
      this.dialog = false
      this.dialogTitle = ''
      this.deletedCheckId = null
    },
    submitDelete () {
      this.deleteCheck()
    },
    followCheck (checkId) {
      this.$store.dispatch('followCheck', checkId)
    }
  },
  created () {
    this.$store.dispatch('getChecks')
  }
}
</script>
