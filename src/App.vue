<template>
  <div id="app" :class="{ 'high-contrast-mode': highContrastMode }">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import Header from './views/Layout/Header.vue'
  import { mapGetters } from 'vuex';

  export default {
    components: {
      Header,
    },

    provide() {
      return {
        reload: this.reload
      }
    },

    data() {
      return {
        isRouterAlive: true
      }
    },

    computed: {
      ...mapGetters(['highContrastMode'])
    },

    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
/* 全局样式可以放在这里 */
</style>