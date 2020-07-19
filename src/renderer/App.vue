<template>
  <div id="app">
    <RequestForm></RequestForm>
    <TestResults
      id="test-results"></TestResults>
  </div>
</template>

<script>
  import RequestForm from '@/components/RequestForm'
  import TestResults from '@/components/TestResults.vue'

  export default {
    name: 'fasload',
    components: {
      RequestForm,
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
