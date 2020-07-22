<template>
  <div
    class="container"
    v-show="test.results.distribution">

    <h1
      class="is-size-5 has-text-primary">
      Latency Distribution</h1>
    <ul>
      <li
        class="distribution has-text-grey"
        v-for="(milliseconds, percentile) in test.results.distribution"
        :key="percentile">
        {{ percentile }}% in {{ milliseconds | formatToSeconds }} sec</li></ul>

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
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TestResults',
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
  .distribution .status-codes
    padding-top: .1rem
    font-size: 1.1rem

  .status-codes-title
    margin-top: 2rem
</style>