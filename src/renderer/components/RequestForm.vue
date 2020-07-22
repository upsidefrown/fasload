<template>
  <section class="request container">
    <div class="request-base is-flex">

      <div class="select">
        <select v-model="request.method" class="has-text-grey">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="put">PATCH</option>
          <option value="delete">DELETE</option></select></div>

      <input 
        class="input url has-text-grey"
        type="text"
        placeholder="URL"
        v-model="request.url"/>

      <button
        class="button is-primary test-btn" 
        type="submit"
        :class="{'is-loading': test.active}"
        @click="runTest">TEST</button>
    </div>

    <TestTimer />

    <div class="request-plus">
        <div 
          id="tabs" 
          class="tabs is-toggle">
          <ul>
            <li 
              :class="{'is-active': activeTab === 'params'}"
              @click="activate('params')">
                <a 
                  id="tab-param">
                    <span>Params</span></a></li>
            <li 
              :class="{'is-active': activeTab === 'headers'}" 
              @click="activate('headers')">
                <a id="tab-header">
                  <span>Headers</span></a></li>
            <li 
              :class="{'is-active': activeTab === 'body'}" 
              @click="activate('body')">
                <a id="tab-body">
                  <span>Body</span></a></li></ul>
        </div>

        <div 
          id="req-params"
          v-show="activeTab === 'params'">
          <KeyVal
            :activeTab="activeTab"></KeyVal>
        </div>

        <div 
          id="req-headers"
          v-show="activeTab === 'headers'">
          <KeyVal
            :activeTab="activeTab"></KeyVal>
        </div>

        <div 
          id="req-body" 
          class="columns is-mobile is-gapless is-multiline" 
          v-show="activeTab === 'body'">

          <div 
            id="body-type"
            class="column is-flex is-full has-background-white has-text-grey-light">
            <b-radio 
              class="radio" 
              name="none"
              native-value="none"
              v-model="radio">none</b-radio>
            <b-radio 
              class="radio"
              name="text"
              native-value="text"
              v-model="radio">text</b-radio>
            <b-radio 
              class="radio"
              name="form"
              native-value="form"
              v-model="radio">form</b-radio>
          </div>

          <div 
            id="text-box"
            class="column is-full"
            v-show="radio === 'text'">
            <textarea 
              class="textarea" 
              placeholder="Something crazy..."
              v-model="request.body.text"></textarea>
          </div>

          <KeyVal
            class="column is-full"
            :activeTab="activeTab"
            v-show="radio === 'form'"></KeyVal>
        </div>

        <TestSettings
          id="test-settings"></TestSettings>
    </div>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  
  import KeyVal from './KeyVal.vue'
  import TestTimer from './TestTimer.vue'
  import TestSettings from './TestSettings'

  export default {
    name: 'RequestForm',
    components: {
      KeyVal,
      TestTimer,
      TestSettings
    },
    data () {
      return {
        activeTab: 'params',
        radio: 'none'
      }
    },
    computed: {
      ...mapState(['request', 'test'])
    },
    methods: {
      ...mapActions(['runTest']),
      activate (tab) {
        this.activeTab = tab
      }
    }
  }
</script>

<style lang="sass">

.request-base
  letter-spacing: .1rem
  .url
    margin-right: 5rem
  .test-btn
    padding: 0 1.6rem
    letter-spacing: .1rem
    font-weight: bold

#tabs
  margin-bottom: 0

#tab-param, #tab-header, #tab-body
  border-bottom-right-radius: 0
  border-bottom-left-radius: 0

#body-type
  height: 1.9rem
  width: 100%
  border: 1px solid #dbdbdb
  margin-top: -1px
  margin-bottom: 0

  .radio
    padding-left: 1.8rem
    font-size: .84rem
  
#text-box
  margin-top: -1px

  .textarea
    border-top-left-radius: 0
    border-top-right-radius: 0
    box-shadow: none
    font-size: .94rem

#test-settings
  margin-top: 2rem

</style>