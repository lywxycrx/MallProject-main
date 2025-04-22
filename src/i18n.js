import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

// Import translation files directly from the correct path
import enMessages from './i18n/locales/en.json'
import zhMessages from './i18n/locales/zh.json'

Vue.use(VueI18n)

// Merge translations
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

// Get the user's language setting from localStorage. If not, use the environment variable or default value.
const savedLanguage = localStorage.getItem('language')
const defaultLocale = process.env.VUE_APP_I18N_LOCALE || 'zh'
const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en'

const i18n = new VueI18n({
  locale: savedLanguage || defaultLocale,
  fallbackLocale: fallbackLocale,
  messages,
  silentTranslationWarn: process.env.NODE_ENV === 'production'
})

// Add a helper method to switch languages
i18n.setLanguage = function(lang) {
  i18n.locale = lang
  localStorage.setItem('language', lang)
  
  // Trigger custom events to notify other components that need to respond to language changes
  Vue.prototype.$bus && Vue.prototype.$bus.$emit('languageChanged', lang)
  return lang
}

export default i18n