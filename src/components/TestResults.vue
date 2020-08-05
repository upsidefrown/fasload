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
              {{ percentile }}% in {{ milliseconds | formatToSeconds }} sec</li></ul></div>

        <div id="status-codes">
          <h1
            class="is-size-5 has-text-primary">
            Status Codes & Errors</h1>
          <ul>
            <li
            class="status-codes has-text-grey"
            v-for="(amount, code) in test.results.statusCodes"
            :key="code">
            {{ code }} : {{ amount }} responses</li></ul></div>

      </div>

      <div
        class="chart-box column is-9">
        <div class="summary-box is-flex">
          <div class="summary is-flex">
            <h1 class="is-size-5 has-text-primary">Fastest</h1>
            <p class="has-text-grey">{{ test.results.times[0] | formatToSeconds }} s</p></div>
          <div class="summary is-flex">
            <h1 class="is-size-5 has-text-primary">Average</h1>
            <p class="has-text-grey">{{ test.results.distribution['50'] | formatToSeconds }} s</p></div>
          <div class="summary is-flex">
            <h1 class="is-size-5 has-text-primary">Slowest</h1>
            <p class="has-text-grey">{{ test.results.distribution['100'] | formatToSeconds }} s</p></div>
        </div>

        <ResultsChart
          id=chart
          v-if="test.results.times"></ResultsChart>
      </div>
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

  .distribution .status-codes
    padding-top: .1rem
    font-size: 1.1rem

  #latency-dist, #status-codes
    margin-top: 2rem

  .chart-box
    margin-top: -7rem

  .summary-box
    justify-content: space-between
    padding-left: 4.6rem
    padding-right: 1rem
    margin-bottom: 1.6rem

  .summary
    flex-direction: column
    align-items: center

  #chart
    flex-grow: 3

</style>