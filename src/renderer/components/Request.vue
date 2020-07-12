<template>
  <section class="request container">
    
    <div class="request-base is-flex">
      <div class="select">
        <select v-model="method">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </div>

      <input v-model="url" @keyup.enter="runTest" type="text" class="input url" placeholder="URL"/>

      <button @click="runTest" :class="{'is-loading': awaitingResponse}"  type="submit" class="button is-primary test-btn">TEST</button>
    </div>

    <div class="timer is-flex">00:00</div>

    <div class="request-more">
        <div id="tabs" class="tabs is-toggle">
          <ul>
            <li :class="{'is-active': activeTab === 0}" @click="activate(0)"><a id="tab-param"><span>Params</span></a></li>
            <li :class="{'is-active': activeTab === 1}" @click="activate(1)"><a id="tab-header"><span>Headers</span></a></li>
            <li :class="{'is-active': activeTab === 2}" @click="activate(2)"><a id="tab-body"><span>Body</span></a></li>
          </ul>
        </div>

        <div class="params-headers" v-show="activeTab === 0 || activeTab === 1">

          <div id="key-val-title" class="columns is-mobile is-gapless">
              <div id="remove-title" class="column is-narrow"></div>
              <div id="key-title" class="column has-text-grey-light">
                <span id="title">key</span>
              </div>
              <div id="value-title" class="column has-text-grey-light">
                <span id="title">value</span>
              </div>
          </div>

          <div id="key-val-row" class="params columns is-mobile is-gapless" v-show="activeTab === 0" v-for="(row,idx) of params" :key="'param'+idx">
            <div id="remove-box" class="column is-narrow is-flex">
              <a class="delete is-medium"></a>
            </div>
            <div id="key-field" class="column">
              <input id="key" type="text" class="input has-text-grey" v-model="params[idx][0]" @keyup.enter="newRow('params')">
            </div>
            <div id="value-field" class="column">
              <input id="value" type="text" class="input has-text-grey" v-model="params[idx][1]" @keyup.enter="newRow('params')">
            </div>
          </div>

          <div id="key-val-row" class="headers columns is-mobile is-gapless" v-show="activeTab === 1" v-for="(row,idx) of headers" :key="'header'+idx">
            <div id="remove-box" class="column is-narrow is-flex">
              <a class="delete is-medium"></a>
            </div>
            <div id="key-field" class="column">
              <input id="key" type="text" class="input has-text-grey" v-model="headers[idx][0]" @keyup.enter="newRow('headers')">
            </div>
            <div id="value-field" class="column">
              <input id="value" type="text" class="input has-text-grey" v-model="headers[idx][1]" @keyup.enter="newRow('headers')">
            </div>
          </div>
        </div>

        <div class="body">

        </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Request',
  data () {
    return {
      method: 'get',
      url: '',
      awaitingResponse: false,
      params: [ ['', ''] ],
      headers: [ ['', ''] ],
      activeTab: 0
    }
  },
  methods: {
    runTest () {
      this.$emit('request', {
        method: this.method,
        url: this.url,
        params: this.params,
        headers: this.headers
      })
      this.awaitingResponse = true
    },
    activate (tab) {
      this.activeTab = tab
    },
    newRow (tab) {
      this[tab].push(['', ''])
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

.timer
  justify-content: flex-end
  margin-top: 1rem
  margin-right: .25rem
  font-weight: bold
  letter-spacing: .2px

#tabs
  margin-bottom: 0

#tab-param, #tab-header, #tab-body
  border-bottom-right-radius: 0
  border-bottom-left-radius: 0

// key-val title

#key-val-title
  margin-top: -1px
  margin-bottom: 0

#remove-title, #key-title, #value-title
  border: 1px solid #dbdbdb
  background-color: white
  height: 1.8rem

#remove-title
  width: 2rem

#key-title, #value-title
  margin-left: -1px
  display: flex
  align-items: center

#title
  padding-left: .6rem

// key-val rows

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
  text-justify: center

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

</style>