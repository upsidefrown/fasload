import Vue from 'vue'
import App from './App'

import store from './store'

import Buefy from 'buefy'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

new Vue({
  store,
  components: { App },
  render: h => h(App)
}).$mount('#app')
