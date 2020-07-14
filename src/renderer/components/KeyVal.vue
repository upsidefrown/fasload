<template>
  <div id="request-key-val">

    <div 
      id="key-val-title" 
      class="columns is-mobile is-gapless">
      <div 
        id="remove-title" 
        class="column is-narrow has-background-grey-lighter"></div>
      <div 
        id="key-title" 
        class="column has-text-white has-text-weight-semibold has-background-grey-lighter">
        <span id="title">key</span></div>
      <div 
        id="value-title" 
        class="column has-text-white has-text-weight-semibold has-background-grey-lighter">
        <span id="title">value</span></div>
    </div>

    <div 
      id="key-val-row" 
      class="body-form columns is-mobile is-gapless"
      v-for="(row,idx) of request[activeTab].form" 
      :key="activeTab + idx">
      <div 
        id="remove-box" 
        class="column is-narrow is-flex">
        <a 
          class="delete is-medium" 
          @click="removeRow({activeTab, idx})"></a></div>
      <div 
        id="key-field" 
        class="column">
        <input 
          id="key" 
          type="text" 
          class="input has-text-grey" 
          v-model="request[activeTab].form[idx][0]" 
          @keyup.enter="addRow(activeTab)" /></div>
      <div 
        id="value-field" 
        class="column">
        <input 
          id="value" 
          type="text" 
          class="input has-text-grey" 
          v-model="request[activeTab].form[idx][1]" 
          @keyup.enter="addRow(activeTab)"></div>
    </div>

    <div 
      id="key-val-add" 
      class="is-flex" 
      @click="addRow(activeTab)">
      <span><i class="fas fa-plus"></i></span>
    </div>
    
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'KeyVal',
    props: [ 'activeTab' ],
    methods: {
      ...mapMutations(['addRow', 'removeRow'])
    },
    computed: {
      ...mapState(['request'])
    }
  }
</script>

<style lang="sass">

  // title

  #key-val-title
    margin-top: -1px
    margin-bottom: 0

  #remove-title, #key-title, #value-title
    height: 1.8rem

  #remove-title
    width: 2rem

  #key-title, #value-title
    margin-left: -1px
    display: flex
    align-items: center
    border-left: 2px solid white

  #title
    padding-left: .6rem

  // row

  #key-val-row
    margin-bottom: 0

  #remove-box, #key-field, #value-field
    border: 1px solid #dbdbdb
    background-color: white
    height: 2rem
    margin-top: -1px

  #remove-box
    width: 2rem
    align-items: center
    justify-content: center
    
  #key-field, #value-field
    margin-left: -1px

  #key, #value
    height: 100%
    width: 100%
    border-radius: 0
    box-shadow: none
    border-width: 0

    &:hover
      border-color: #dbdbdb
    &:focus
      border-color: #dbdbdb
      box-shadow: none

  // add

  #key-val-add
    height: 1.8rem
    width: 2rem
    align-items: center
    justify-content: center
    font-size: 1.6rem
    color: #FA7C91

    &:hover
      cursor: pointer

</style>