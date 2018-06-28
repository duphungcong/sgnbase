<template>
  <v-dialog v-model="dialog" max-width="1000" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">Logs</h4>
      </v-card-title>

      <v-data-table
        :items="model"
        :headers="header"
        :pagination.sync="pagination"
        hide-actions>
        <template slot="items" slot-scope="props">
          <td class="boyd-0">{{ props.item.person }}</td>
          <td class="boyd-0">{{ props.item.action }}</td>
          <td class="boyd-0">{{ props.item.status }}</td>
          <td class="boyd-0">{{ props.item.time }}</td>
          <td class="boyd-0">{{ props.item.notes || 'NIL' }}</td>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" small flat @click.native="cancel()">Cancel</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
    logs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      model: [],
      header: [
        { text: 'PERSON', left: true, value: 'person', width: '15%' },
        { text: 'ACTION', left: true, value: 'action', width: '15%' },
        { text: 'STATUS', left: true, value: 'status', width: '15%' },
        { text: 'TIME', left: true, value: 'time', width: '20%' },
        { text: 'NOTES', left: true, value: 'notes', width: '35%' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'time',
        descending: true
      }
    }
  },
  watch: {
    logs (value) {
      this.model = Object.assign([], value)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
