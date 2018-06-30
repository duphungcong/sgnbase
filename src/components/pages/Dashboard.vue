<template>
  <v-card class="elevation-0 pl-2">
    <v-layout row wrap>
      <v-flex xs6>
        <doughnut ref="taskChart" :data="taskDataChart"></doughnut>
      </v-flex>
      <v-flex xs6>
        <p><strong>TASK OVERVIEW</strong></p>
        <p>Total: <strong>{{ taskData.total }}</strong></p>
        <p>Done: <strong>{{ taskData.done }}</strong></p>
        <p>InProgress: <strong>{{ taskData.inProgress }}</strong></p>
        <p>Take Out: <strong>{{ taskData.out }}</strong></p>
        <p>Not Yet: <strong>{{ taskData.notYet }}</strong></p>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-layout row wrap>
        <v-flex xs6>
          <doughnut ref="nrcChart" :data="nrcDataChart"></doughnut>
        </v-flex>
        <v-flex xs6>
          <p><strong>NRC OVERVIEW</strong></p>
          <p>Total: <strong>{{ nrcData.total }}</strong></p>
          <p>Done: <strong>{{ nrcData.done }}</strong></p>
          <p>Ready: <strong>{{ nrcData.ready }}</strong></p>
          <p>InProgress: <strong>{{ nrcData.inProgress }}</strong></p>
          <p>Take Out: <strong>{{ nrcData.out }}</strong></p>
          <p>Not Yet: <strong>{{ nrcData.notYet }}</strong></p>
          <p>Cancel: <strong>{{ nrcData.cancel }}</strong></p>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>

import { mapState } from 'vuex'
import Doughnut from '@/components/charts/Doughnut'

export default {
  components: {
    Doughnut
  },
  data () {
    return {
      taskData: {},
      nrcData: {},
      taskDataChart: {
        labels: ['Done', 'InProgress', 'NotYet', 'Takeout'],
        datasets: [
          {
            backgroundColor: [
              '#4CAF50',
              '#F9A825',
              '#BDBDBD',
              '#607D8B'
            ],
            data: []
          }
        ]
      },
      nrcDataChart: {
        labels: ['Done', 'Ready', 'InProgress', 'NotYet', 'Takeout', 'Cancel'],
        datasets: [
          {
            backgroundColor: [
              '#4CAF50',
              '#2196F3',
              '#F9A825',
              '#BDBDBD',
              '#607D8B',
              '#8D6E63'
            ],
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['workpack', 'nrcs'])
  },
  watch: {
    workpack (value) {
      this.taskCount()
    },
    nrcs (value) {
      this.nrcCount()
    }
  },
  methods: {
    taskCount () {
      this.taskReset()
      this.workpack.forEach(item => {
        if (item.status === 'notYet') {
          this.taskData.notYet++
          return
        }
        if (item.status === 'inProgress') {
          this.taskData.inProgress++
          return
        }
        if (item.status === 'done') {
          this.taskData.done++
          return
        }
        if (item.status === 'out') {
          this.taskData.out++
        }
      })
      this.taskDataChart.datasets[0].data = Object.values(this.taskData)
      this.$refs.taskChart.update()
      this.taskData.total = this.workpack.length
    },
    taskReset () {
      this.taskData = {
        done: 0,
        inProgress: 0,
        notYet: 0,
        out: 0
      }
    },
    nrcCount () {
      this.nrcReset()
      this.nrcs.forEach(item => {
        if (item.status === 'notYet') {
          this.nrcData.notYet++
          return
        }
        if (item.status === 'inProgress') {
          this.nrcData.inProgress++
          return
        }
        if (item.status === 'done') {
          this.nrcData.done++
          return
        }
        if (item.status === 'ready') {
          this.nrcData.ready++
          return
        }
        if (item.status === 'out') {
          this.nrcData.out++
          return
        }
        if (item.status === 'cancel') {
          this.nrcData.cancel++
        }
      })
      this.nrcDataChart.datasets[0].data = Object.values(this.nrcData)
      this.$refs.nrcChart.update()
      this.nrcData.total = this.nrcs.length
    },
    nrcReset () {
      this.nrcData = {
        done: 0,
        ready: 0,
        inProgress: 0,
        notYet: 0,
        out: 0,
        cancel: 0
      }
    }
  },
  mounted () {
    this.taskCount()
    this.nrcCount()
  }
}
</script>
