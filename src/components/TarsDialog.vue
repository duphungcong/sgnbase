<template>
  <v-dialog v-model="dialog" max-width="1100" persistent>
    <v-card>
      <v-card-title class="blue">
        <h4 class="white--text">List TARs</h4>
      </v-card-title>

      <v-card-text>
        <v-switch label="All Replied" v-model="replied" color="primary"></v-switch>
      </v-card-text>

      <v-data-table
        :items="model"
        item-key="number"
        :headers="header"
        :pagination.sync="pagination"
        hide-actions>
        <template slot="items" slot-scope="props">
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.number }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.question }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.answer }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.status }}</td>
          <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL' }}</td>
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
                  <v-icon color="blue" slot="activator">today</v-icon><span>reply date</span>
                </v-tooltip>
              </v-btn>
              <v-date-picker v-model="props.item.replyDate"></v-date-picker>
            </v-menu>
          </td>
        </template>
        <template slot="expand" slot-scope="props">
            <v-card flat color="blue lighten-5" class="elevation-0">
              <v-card-text>
                <p>Send Date: <strong>{{ appFunction.formatDate(props.item.sendDate) }}</strong></p>
                <p>Reply Date: <strong>{{ appFunction.formatDate(props.item.replyDate) || 'NIL' }}</strong></p>
                <p>Zone: <strong>{{ props.item.zoneDivision }}</strong></p>
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
    tars: {
      type: Array,
      default: () => []
    },
    allReplied: false
  },
  data () {
    return {
      model: [],
      replied: false,
      header: [
        { text: 'NUMBER', left: true, value: 'number', width: '10%' },
        { text: 'QUESTION', left: true, value: 'question', width: '30%' },
        { text: 'ANSWER', left: true, value: 'answer', width: '30%' },
        { text: 'STATUS', left: true, value: 'status', width: '5%' },
        { text: 'NOTES', left: true, value: 'notes', width: '20%' },
        { text: 'QUICK UPDATE', sortable: false, value: '', width: '5%' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'reqDate',
        descending: true
      },
      status: this.appConst.tarStatus
    }
  },
  watch: {
    tars (value) {
      this.model = JSON.parse(JSON.stringify(value))
      this.replied = this.allReplied
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', { tars: this.model, replied: this.replied })
    }
  }
}
</script>
