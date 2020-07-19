<template>
  <div 
    class="timer is-flex has-text-grey-light">
    {{ test.timer.time | formatTime }}</div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TestTimer',
    computed: {
      ...mapState(['test'])
    },
    filters: {
      formatTime (seconds) {
        let minutes = Math.floor(seconds / 60)
        seconds = seconds - (minutes * 60)

        if (minutes < 10) minutes = '0' + minutes
        if (seconds < 10) seconds = '0' + seconds
        return minutes + ':' + seconds
      }
    }
  }
</script>

<style lang="sass">

  .timer
    justify-content: flex-end
    margin-top: 1rem
    margin-right: .25rem
    margin-bottom: -1rem
    font-weight: bold
    font-size: 1.2rem
    letter-spacing: .2px

</style>