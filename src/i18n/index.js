import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// 加载所有本地化文件
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

// 从localStorage获取用户设置的语言，如果没有则使用默认值
const savedLanguage = localStorage.getItem('language');
const defaultLocale = savedLanguage || 'zh';

const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
});

export default i18n;