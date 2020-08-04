<template>
  <div
    if="test-results"
    class="container"
    v-show="test.results.distribution">

    <div class="columns">
      <div id="stats" class="column is-3">
        <div id="latency-dist">
          <h1 class="is-size-5 has-text-primary">Latency Distribution</h1>
          <ul>
            <li
              class="distribution has-text-grey"
              v-for="(milliseconds, percentile) in test.results.distribution"
              :key="percentile">
              {{ percentile }}% in {{ milliseconds | formatToSeconds }} sec</li></ul>
        </div>

        <div id="status-codes">
          <h1
            class="status-codes-title is-size-5 has-text-primary">
            Status Codes & Errors</h1>
          <ul>
            <li
            class="status-codes has-text-grey"
            v-for="(amount, code) in test.results.statusCodes"
            :key="code">
            {{ code }} : {{ amount }} responses</li></ul>
        </div>

      </div>

      <ResultsChart
        id=chart
        class="column is-9"
        v-if="test.results.times"></ResultsChart>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ResultsChart from './ResultsChart'

  export default {
    name: 'TestResults',
    components: { ResultsChart },
    computed: {
      ...mapState(['test'])
    },
    filters: {
      formatToSeconds (milliseconds) {
        return (milliseconds / 1000).toFixed(3).toString()
      }
    }
  }
</script>

<style lang="sass">
  #test-results
    justify-content: stretch

  #stats
    flex-basis: content
    flex-grow: 1

  #chart
    flex-grow: 3

  .distribution .status-codes
    padding-top: .1rem
    font-size: 1.1rem

  .status-codes-title
    margin-top: 2rem
</style>