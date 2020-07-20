<template>
  <section 
    class="test-settings container is-flex">

    <div
      class="test-option is-flex">
      <div
        id="load"
        class="option-title is-flex has-background-grey-light has-text-white has-text-weight-semibold">Load</div>
      <input 
        class="input has-text-grey"
        placeholder="100"
        min="1"
        type="number"
        v-model="test.load" /></div>

    <div
      class="test-option is-flex">
      <div
        id="workers"
        class="option-title is-flex has-background-grey-light has-text-white has-text-weight-semibold">Workers</div>
      <input 
        class="input has-text-grey"
        placeholder="8"
        min="1"
        type="number"
        v-model="test.workers" /></div>

  </section>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TestSettings',
    computed: mapState(['test'])
  }
</script>

<style lang="sass" scoped>
  .test-settings
    flex-direction: column

  .test-option
    .input
      width: 8rem

  .option-title
    width: 6rem
    align-items: center
    padding-left: 1rem

  #load
    border-bottom: 2px solid white

  .input
    border-radius: 0
    box-shadow: none

    &:hover
      border-color: #dbdbdb
      
    &:focus
      border-color: #dbdbdb
      box-shadow: none
    
</style>