<template>
  <div>
    <p 
      v-show="test.results">{{ test.results }}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TestResults',
    computed: {
      ...mapState(['test'])
    }
  }
</script>

<style lang="sass">

</style>