<template>
  <section class="container request">
    <div class="request-row1">
      <div class="select">
        <select v-model="method" class="method">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </div>
      <input v-model="url" @keyup.enter="runTest" type="text" class="input url" placeholder="URL"/>
      <button @click="runTest" type="submit" class="button is-primary test-btn">TEST</button>
    </div>
    <div class="request-row2">
      <b-tabs type="is-boxed" id="request-add">
        <b-tab-item label="Params"></b-tab-item>
        <b-tab-item label="Headers"></b-tab-item>
        <b-tab-item label="Body"></b-tab-item>
      </b-tabs>
      <div class="timer">
        00:00
      </div>
    </div>
    <div class="request-row3">

    </div>
  </section>
</template>

<script>
export default {
  name: 'Request',
  data () {
    return {
      method: 'get',
      url: ''
    }
  },
  methods: {
    runTest () {
      this.$emit('request', {
        method: this.method,
        url: this.url
      })
    }
  }
}
</script>

<style scoped lang="sass">

.request-row1
  display: flex
  justify-content: space-between
  letter-spacing: 1px

.request-row2
  display: flex
  justify-content: space-between
  margin-top: 40px

.request-row3
  background-color: white
  margin-top: -57px
  border: 1px solid #DBDBDB
  height: 200px

.url
  margin-right: 80px

.test-btn
  padding: 0 30px
  font-weight: bold
  letter-spacing: 1px
  font-weight: bold

.timer
  margin-right: 5px
  font-weight: bold
  letter-spacing: 2px

</style>