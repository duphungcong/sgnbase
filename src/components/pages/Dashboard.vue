<template>
  <v-card class="elevation-0 pl-2">
    <v-flex xs12>
      <p><strong>TASK OVERVIEW</strong></p>
      <p>Total: <strong>{{ taskStatus.total }}</strong></p>
      <p>Done: <strong>{{ taskStatus.done }}</strong></p>
      <p>InProgress: <strong>{{ taskStatus.inProgress }}</strong></p>
      <p>Take Out: <strong>{{ taskStatus.out }}</strong></p>
      <p>Not Yet: <strong>{{ taskStatus.notYet }}</strong></p>
    </v-flex>
    <v-flex xs12>
      <p><strong>NRC OVERVIEW</strong></p>
      <p>Total: <strong>{{ nrcStatus.total }}</strong></p>
      <p>Done: <strong>{{ nrcStatus.done }}</strong></p>
      <p>Ready: <strong>{{ nrcStatus.ready }}</strong></p>
      <p>Cancel: <strong>{{ nrcStatus.cancel }}</strong></p>
      <p>InProgress: <strong>{{ nrcStatus.inProgress }}</strong></p>
      <p>Take Out: <strong>{{ taskStatus.out }}</strong></p>
      <p>Not Yet: <strong>{{ taskStatus.notYet }}</strong></p>
    </v-flex>
  </v-card>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      taskStatus: {
        total: 0,
        done: 0,
        inProgress: 0,
        notYet: 0,
        out: 0
      },
      nrcStatus: {
        total: 0,
        done: 0,
        inProgress: 0,
        notYet: 0,
        out: 0
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
      this.taskStatus.total = this.workpack.length
      this.workpack.forEach(item => {
        if (item.status === 'notYet') {
          this.taskStatus.notYet++
          return
        }
        if (item.status === 'inProgress') {
          this.taskStatus.inProgress++
          return
        }
        if (item.status === 'done') {
          this.taskStatus.done++
          return
        }
        if (item.status === 'out') {
          this.taskStatus.out++
        }
      })
    },
    taskReset () {
      this.taskStatus = {
        total: 0,
        done: 0,
        inProgress: 0,
        notYet: 0,
        out: 0
      }
    },
    nrcCount () {
      this.nrcReset()
      this.nrcStatus.total = this.nrcs.length
      this.nrcs.forEach(item => {
        if (item.status === 'notYet') {
          this.nrcStatus.notYet++
          return
        }
        if (item.status === 'inProgress') {
          this.nrcStatus.inProgress++
          return
        }
        if (item.status === 'done') {
          this.nrcStatus.done++
          return
        }
        if (item.status === 'out') {
          this.nrcStatus.out++
        }
      })
    },
    nrcReset () {
      this.nrcStatus = {
        total: 0,
        done: 0,
        inProgress: 0,
        notYet: 0,
        out: 0
      }
    }
  },
  mounted () {
    this.taskCount()
    this.nrcCount()
  }
}
</script>
