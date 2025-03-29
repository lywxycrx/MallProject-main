import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index'

// i18n导入移到更前面，确保在element.js之前加载
import i18n from './i18n'

// element UI初始化
import './plugins/element.js'
import './utils/localStorage' // 持久化

// 导入高对比度样式表
import './assets/high-contrast.css'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);

// 导出excel表
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.prototype.$api = api

Vue.config.productionTip = false

// 初始化高对比度模式
if (store.dispatch && typeof store.dispatch === 'function') {
  store.dispatch('initHighContrastMode');
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')