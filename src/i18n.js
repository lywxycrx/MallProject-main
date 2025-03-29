import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

// 直接从正确的路径导入翻译文件
import enMessages from './i18n/locales/en.json'
import zhMessages from './i18n/locales/zh.json'

Vue.use(VueI18n)

// 合并翻译
const messages = {
  en: {
    ...enMessages,
    el: enLocale.el
  },
  zh: {
    ...zhMessages,
    el: zhLocale.el
  }
}

// 从localStorage获取用户设置的语言，如果没有则使用环境变量或默认值
const savedLanguage = localStorage.getItem('language')
const defaultLocale = process.env.VUE_APP_I18N_LOCALE || 'zh'
const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en'

const i18n = new VueI18n({
  locale: savedLanguage || defaultLocale,
  fallbackLocale: fallbackLocale,
  messages,
  silentTranslationWarn: process.env.NODE_ENV === 'production'
})

// 添加一个辅助方法来切换语言
i18n.setLanguage = function(lang) {
  i18n.locale = lang
  localStorage.setItem('language', lang)
  
  // 触发自定义事件，通知其他需要响应语言变化的组件
  Vue.prototype.$bus && Vue.prototype.$bus.$emit('languageChanged', lang)
  
  return lang
}

export default i18n