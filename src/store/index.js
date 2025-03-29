import Vue from 'vue'
import Vuex from 'vuex'
import loginModule from './modules/loginModule'
import themeModule from './modules/themeModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    loginModule,
    themeModule
  },
})
