import { createClient } from '../apollo/apollo-functions'
import clients from './clients.json'

const plugin = {
  install (Vue, options) {
    console.log('Installing MaverickApi plugin')

    Vue.mixin({
      data () {
        return {
        }
      },

      computed: {
        apis () {
          return this.$store.state.apis
        },
        activeApi () {
          return this.$store.state.activeApi
        }
      },

      mounted () {
        // Only execute this if root component, otherwise skip it.
        // Theoretically, this should execute once after the main Vue component is loaded,
        //  and the apollo plugin and provider has loaded.
        if (!this.$parent) {
          // Process each defined Maverick-API instance and create a client and base heartbeat subscription for each api
          for (const client in clients) {
            this.createClient(client, clients[client])
          }
        }
      },

      methods: {
        createClient (api, clientdata) {
          // Add an apollo client
          this.$set(this.$apollo.provider.clients, api, createClient({
            httpEndpoint: clientdata.httpEndpoint,
            wsEndpoint: clientdata.wsEndpoint,
            websocketsOnly: clientdata.websocketsOnly
          }))
          // Add a vuex apis entry
          this.$store.commit('addApi', {
            title: api,
            value: { ...clientdata, ...{ state: false } }
          })
        },

        createQuery (message, gql, api, container, callback = null, errorCallback = null) {
          const queryKey = [message, '_', api].join('')
          if (!this.$apollo.queries[queryKey] && this.$apollo.provider.clients[api]) {
            console.log(`api: ${api}, message: ${message}, queryKey: ${queryKey}, callback: ${callback}`)
            // If a callback function has been passed use it as the result processor, otherwise use a default function
            const resultFunction = (callback instanceof Function) ? callback : function (data, key) {
              api = key.replace([message, '_'].join(''), '')
              if (data.data && message in data.data) {
                // Store the message data and set the api state to active
                // Note: Must use this.$set to add object property, to keep new property reactive
                this.$set(this[container], api, data.data[message])
                this.$store.commit('setApiState', { api: api, value: true })
              }
            }
            this.$apollo.addSmartQuery(queryKey, {
              client: api,
              query: gql,
              manual: true,
              result: resultFunction,
              error: errorCallback
            })
          } else {
            console.log(`query ${queryKey} already exists`)
          }
        },

        createSubscription (message, gql, api, container, callback = null, errorCallback = null) {
          const subKey = [message, '_', api].join('')
          if (!this.$apollo.subscriptions[subKey] && this.$apollo.provider.clients[api]) {
            console.log(`subscription :: api: ${api}, message: ${message}, subKey: ${subKey}`)
            // If a callback function has been passed use it as the result processor, otherwise use a default function
            const resultFunction = (callback instanceof Function) ? callback : function (data, key) {
              api = key.replace([message, '_'].join(''), '')
              if (data.data && message in data.data && this[container][api] !== data.data[message]) {
                // Store the message data and set the api state to active
                this[container][api] = data.data[message]
                if (!this.$store.state.apis[api].state && message in data.data) {
                  this.$store.commit('setApiState', { api: api, value: true })
                }
              }
            }
            this.$apollo.addSmartSubscription(subKey, {
              client: api,
              query: gql,
              manual: true,
              result: resultFunction,
              error: errorCallback
            })
          } else {
            console.log(`subscription ${subKey} already exists`)
          }
        }
      }
    })
  }
}

export const MaverickApi = plugin
