// Load Vue
import Vue from 'vue'
import App from './App.vue'

// Load router and store
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

// Load extra plugins
import './plugins/vuetify'
import './plugins/vuelayers'
import './plugins/vuecesium'
import './plugins/vuetimers'
import './plugins/registerServiceWorker'
import { createProvider } from './plugins/apollo/vue-apollo'

// Load maverick plugins
import './plugins/maverick'

// Sync the vuex store with router
sync(store, router)

// Create app
Vue.config.productionTip = false
window.app = new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
console.log('%c ** Welcome to Maverick Web GCS ** ', 'background: blue; color: white; display: block; padding: 2px 4px; border-radius: 3px; font-weight: bold;')
