import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeTab: 'params',
    request: {
      method: 'get',
      url: '',
      params: {
        form: []
      },
      headers: {
        form: []
      },
      body: {
        text: '',
        form: []
      }
    },
    test: {
      awaitingResponse: false
    }
  },
  mutations: {
    addRow: (state, tab) => {
      state.request[tab].form.push(['', ''])
    },
    removeRow: (state, { activeTab, idx }) => {
      state.request[activeTab].form.splice(idx, 1)
    },
    runTest: state => {
      state.test.awaitingResponse = true
    }
  }
})
