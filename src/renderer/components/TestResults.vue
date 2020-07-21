<template>
  <div
    class="container"
    v-show="test.results">
    <h1
      class="is-size-5 has-text-primary">
      Latency Distribution</h1>
    <ul>
      <li
        class="distribution has-text-grey"
        v-for="(milliseconds, percentile) in test.results"
        :key="percentile">
        {{ percentile }}% in {{ milliseconds | formatToSeconds }} sec</li>
    </ul>

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
  .distribution
    padding-top: .1rem
    font-size: 1.1rem
</style>