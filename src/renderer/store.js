import Vue from 'vue'
import Vuex from 'vuex'

import { ipcRenderer } from 'electron'

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
        active: 'none',
        text: '',
        form: []
      }
    },
    test: {
      active: false,
      timer: {
        name: null,
        time: 0
      },
      results: ''
    }
  },
  mutations: {
    addRow: (state, tab) => {
      state.request[tab].form.push(['', ''])
    },
    removeRow: (state, { activeTab, idx }) => {
      state.request[activeTab].form.splice(idx, 1)
    },
    toggleTest (state) {
      state.test.active = !state.test.active
    },
    updateTestResults (state, results) {
      state.test.results = results
    },
    resetTestResults (state) {
      state.test.results = ''
    },
    startTimer: (state) => {
      state.test.timer.name = setInterval(() => { state.test.timer.time++ }, 1000)
    },
    stopTimer: (state) => {
      clearInterval(state.test.timer.name)
    },
    resetTimer (state) {
      state.test.timer.name = null
      state.test.timer.time = 0
    }
  },
  actions: {
    runTest ({commit, state}) {
      commit('resetTimer')
      commit('resetTestResults')
      ipcRenderer.send('run-test', state.request)
      commit('startTimer')
      commit('toggleTest')

      // `once` disposes listener (new listener on each test run)
      ipcRenderer.once('test-results', (e, results) => {
        commit('stopTimer')
        commit('toggleTest')
        commit('updateTestResults', results)
      })
    }
  }
})
