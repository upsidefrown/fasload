<template>
  <section class="request container">
    <div class="request-base">
      <div class="select">
        <select v-model="method" class="method">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </div>
      <input v-model="url" @keyup.enter="runTest" type="text" class="input url" placeholder="URL"/>
      <button @click="runTest" :class="{'is-loading': awaitingResponse}"  type="submit" class="button is-primary run-test">TEST</button>
    </div>
    <div class="timer">00:00</div>
    <div class="request-additional">
      <b-tabs @change="changeTabView" type="is-boxed">
        <b-tab-item label="Params"></b-tab-item>
        <b-tab-item label="Headers"></b-tab-item>
        <b-tab-item label="Body"></b-tab-item>
        <div class="fields" v-show="view === 0 || view === 1">
          <ul>
            <li class="title">
              <div class="key field">key</div>
              <div class="value field">value</div>
            </li>
          </ul>
          <ul v-show="view === 0" class="params key-val">
            <li v-for="(row,idx) of params" :key="'param'+idx" class="key-val-row">
              <b-checkbox type="is-light"></b-checkbox>
              <input v-model="params[idx][0]" @keyup.enter="newRow('params')" type="text" class="input grid key-field" id="grid">
              <input v-model="params[idx][1]" @keyup.enter="newRow('params')" type="text"  class="input grid value-field" id="grid">
            </li>
          </ul>
          <ul v-show="view === 1" class="headers key-val">
            <li v-for="(row,idx) of headers" :key="'header'+idx" class="key-val-row">
              <b-checkbox type="is-light"></b-checkbox>
              <input v-model="headers[idx][0]" @keyup.enter="newRow('headers')" type="text" class="input key-field" id="grid">
              <input v-model="headers[idx][1]" @keyup.enter="newRow('headers')" type="text"  class="input grid value-field" id="grid">
            </li>
          </ul>
        </div>
        <div class="body">

        </div>
      </b-tabs>
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
      view: 0,
      animated: false
    }
  },
  methods: {
    runTest () {
      this.$emit('request', {
        method: this.method,
        url: this.url,
        headers: this.headers

      })
      this.awaitingResponse = true
    },
    changeTabView (tab) {
      this.view = tab
    },
    newRow (tab) {
      this[tab].push(['', ''])
    }
  }
}
</script>

<style lang="sass">

.request-base
  display: flex
  justify-content: space-between
  letter-spacing: 1px

.request-additional
  margin-top: -20px

.url
  margin-right: 80px

.run-test
  padding: 0 30px
  font-weight: bold
  letter-spacing: 1px
  font-weight: bold

.timer
  display: flex
  justify-content: flex-end
  margin-top: 1rem
  margin-right: 5px
  font-weight: bold
  letter-spacing: 2px

.title
  display: flex
  justify-content: space-evenly
  background-color: white
  border: 1px solid #dbdbdb
  margin-top: -1px
  width: 100%
  height: 28px
  .field
    display: flex
    align-items: center
    width: 100%
    height: 100%
    font-size: .8rem
    color: #bdbdbd
    border-left: 1px solid #dbdbdb
    padding-left: .4rem
  .key
    margin-left: 33px

.key-val-row
  display: flex
  justify-content: space-evenly
  align-items: center
  margin-top: -1px

.key-field
  margin-left: -18px
  margin-right: -1px

#grid
  border-radius: 0
  box-shadow: none
  
#grid:focus
  border-color: #dbdbdb
  box-shadow: none

#grid:hover
  border-color: #dbdbdb

.request-additional
  .b-tabs
    .tab-content
      padding: 0px

</style>