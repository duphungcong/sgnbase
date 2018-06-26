<template>
  <v-dialog v-model="dialog" max-width="1100" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">List Spares</h4>
      </v-card-title>

      <v-data-table
        :items="model"
        item-key="pn"
        :headers="header"
        :pagination.sync="pagination"
        hide-actions>
        <template slot="items" slot-scope="props">
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.rqf }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.description }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.pn }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.quantity }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded" :class="appFunction.priorityColor(props.item.priority)">{{ props.item.priority }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.status }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.estDate || 'NIL' }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL'}}</td>
          <td class="body-0">
            <v-menu bottom right>
              <v-btn icon class="mx-0" slot="activator">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>status</span>
                </v-tooltip>
              </v-btn>
              <v-list>
                <v-list-tile v-for="sta in status" :key="sta" @click="props.item.status = sta">
                  <v-list-tile-title v-text="sta"></v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-menu
              lazy
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              :nudge-right="40"
              min-width="290px">
              <v-btn icon class="mx-0" slot="activator">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">today</v-icon><span>est date</span>
                </v-tooltip>
              </v-btn>
              <v-date-picker v-model="props.item.estDate"></v-date-picker>
            </v-menu>
          </td>
        </template>
        <template slot="expand" slot-scope="props">
            <v-card flat color="blue lighten-5" class="elevation-0">
              <v-card-text>
                <p>Req Date: <strong>{{ props.item.reqDate }}</strong></p>
                <p>Due Date: <strong>{{ props.item.dueDate }}</strong></p>
              </v-card-text>
            </v-card>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" small flat @click.native="cancel()">Cancel</v-btn>
        <v-btn color="blue" small depressed dark @click.native="save()">Save</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
    spares: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      model: [],
      header: [
        { text: 'RQF', left: true, value: 'rqf', width: '15%' },
        { text: 'DESCRIPTION', left: true, value: 'description', width: '15%' },
        { text: 'P/N', left: true, value: 'pn', width: '10%' },
        { text: 'QTY', left: true, value: 'quantity', width: '10%' },
        { text: 'PRI', left: true, value: 'priority', width: '10%' },
        { text: 'STATUS', left: true, value: 'status', width: '10%' },
        { text: 'EST DATE', left: true, value: 'estDate', width: '10%' },
        { text: 'NOTES', left: true, value: 'notes', width: '15%' },
        { text: 'QUICK UPDATE', sortable: false, value: '', width: '5%' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'reqDate',
        descending: true
      },
      status: this.appConst.spareStatus
    }
  },
  watch: {
    spares (value) {
      this.model = JSON.parse(JSON.stringify(value))
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.model)
    }
  }
}
</script>
