<template>
  <div id="app">
    <Request></Request>
    <TestResults
      id="test-results"></TestResults>
  </div>
</template>

<script>
  import Request from '@/components/Request'
  import TestResults from '@/components/TestResults.vue'

  export default {
    name: 'fasload',
    components: {
      Request,
      TestResults
    }
  }
</script>

<style lang="sass">
  @import "./globals.scss";

  #app
    padding: 2rem

  #test-results
    margin-top: 5rem
  
</style>
