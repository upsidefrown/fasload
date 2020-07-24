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
        v-model="urlPlusParams"/>

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
              v-model="request.body.active">none</b-radio>
            <b-radio 
              class="radio"
              name="text"
              native-value="text"
              v-model="request.body.active">text</b-radio>
            <b-radio 
              class="radio"
              name="json"
              native-value="json"
              v-model="request.body.active">json</b-radio>
            <b-radio 
              class="radio"
              name="form"
              native-value="form"
              v-model="request.body.active">form</b-radio>
          </div>

          <div 
            class="text-box column is-full"
            v-show="request.body.active === 'text'">
            <textarea 
              class="textarea" 
              placeholder="Something crazy..."
              v-model="request.body.text"></textarea></div>

          <div 
            class="text-box column is-full"
            v-show="request.body.active === 'json'">
            <textarea 
              class="textarea" 
              placeholder="Some JSON ..."
              v-model="request.body.json"></textarea></div>

          <KeyVal
            class="column is-full"
            :activeTab="activeTab"
            v-show="request.body.active === 'form'"></KeyVal>
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
        activeTab: 'params'
      }
    },
    computed: {
      ...mapState(['request', 'test']),
      urlPlusParams () {
        let formattedURL = this.request.url
        let firstEntry

        for (let entry of this.request.params.form) {
          if (!entry[0] && !entry[1]) continue

          if (!firstEntry) {
            firstEntry = true
            formattedURL += `?${entry[0]}=${entry[1]}`
          } else {
            formattedURL += `&${entry[0]}=${entry[1]}`
          }
        }

        return formattedURL
      }
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
  
.text-box
  margin-top: -1px

  .textarea
    border-top-left-radius: 0
    border-top-right-radius: 0
    box-shadow: none
    font-size: .94rem

#test-settings
  margin-top: 2rem

</style>