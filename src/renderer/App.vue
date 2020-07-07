<template>
  <div id="app">
    <div class="request">
      <div class="select is-primary request-method">
        <select class="request-method" id="request">
          <option value="get" selected>GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </div>
      <input type="text" class="input request-url" placeholder="URL"/>
      <button type="submit" class="button is-primary is-loading request-test">TEST</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fasload'
  }
</script>

<style lang="sass">

  @import "./globals.scss";

  body
    padding: 40px

  .request
    display: flex
    align-items: stretch

  .request-method 
    font-weight: bold
    letter-spacing: 1px

  .request-url
    margin-right: 40px

  .request-test
    font-weight: bold
    letter-spacing: 1px
  
</style>
