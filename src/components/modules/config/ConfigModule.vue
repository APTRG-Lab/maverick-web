<template lang='pug'>
div
  config-drawer
  v-content
    router-view(:key="activeApi")
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import ConfigDrawer from './ConfigDrawer'

export default {
  name: 'ConfigModule',
  components: {
    ConfigDrawer
  },
  data () {
    return {
      drawer: true
    }
  },
  computed: {
    activeApi () {
      return this.$store.state.activeApi
    }
  },
  mounted () {
    this.$vuetify.theme.primary = colors.lightGreen.base // Reset theme colours for this component
  }
}
</script>
