<template>
  <div>
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import datashow_admin from './admin'
import datashow_editor from './editor'

export default {
  name: 'DataShow',
  components: { datashow_admin, datashow_editor },
  data() {
    return {
      currentRole: 'datashow_admin'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('IFCZT')) {
      this.currentRole = 'datashow_editor'
    }
  }
}
</script>
