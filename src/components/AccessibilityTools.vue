<template>
    <div class="accessibility-tools">
      <el-tooltip :content="$t('accessibility.highContrastTooltip')" placement="bottom">
        <el-button 
          class="contrast-toggle-btn" 
          :class="{ 'active': highContrastMode }"
          @click="toggleHighContrast"
          icon="el-icon-view"
          size="small">
          {{ $t('accessibility.highContrast') }}
        </el-button>
      </el-tooltip>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'AccessibilityTools',
    computed: {
      ...mapGetters(['highContrastMode'])
    },
    methods: {
      toggleHighContrast() {
        this.$store.commit('toggleHighContrastMode');
      }
    }
  }
  </script>
  
  <style scoped>
  .accessibility-tools {
    display: inline-flex;
    align-items: center;
    margin: 0 10px;
  }
  
  .contrast-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .contrast-toggle-btn.active {
    background-color: #409eff;
    color: white;
    border-color: #409eff;
  }
  </style>