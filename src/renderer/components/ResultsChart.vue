<script>
  import { mapGetters } from 'vuex'
  import { Line } from 'vue-chartjs'

  export default {
    name: 'ResultsChart',
    extends: Line,
    data () {
      return {
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: {
            xAxes: [ { display: false } ],
            yAxes: [{
              ticks: { callback: (value) => {
                return `${value / 1000}s`
              }}
            }]
          }
        }
      }
    },
    computed: mapGetters(['testTimesChart']),
    watch: {
      testTimesChart () {
        this.renderChart(this.testTimesChart, this.chartOptions)
      }
    },
    // show chart from last run on app reload
    mounted () {
      this.renderChart(this.testTimesChart, this.chartOptions)
    }
  }
</script>