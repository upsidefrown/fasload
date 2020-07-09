<template>
  <div id="app">
    <Request @request="runTest"></Request>
    <div>
      {{ response }}
    </div>
  </div>
</template>

<script>
  import Request from './components/Request'

  export default {
    name: 'fasload',
    components: {
      Request
    },
    data () {
      return {
        response: ''
      }
    },
    methods: {
      runTest (request) {
        this.response = request
      }
    }
  }
</script>

<style lang="sass">
  @import "./globals.scss";

  #app
    padding: 2rem
  
</style>
