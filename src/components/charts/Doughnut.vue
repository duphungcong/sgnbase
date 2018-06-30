<script>

import 'chart.js'
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: [
    'data'
  ],
  methods: {
    update () {
      this.renderChart(this.data, {responsive: true, maintainAspectRatio: false})
    }
  },
  mounted () {}
}
</script>
