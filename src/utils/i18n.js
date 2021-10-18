import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '../i18n/en';
import zh from '../i18n/zh';

import iView from 'iview';
import iview_en from 'iview/dist/locale/en-US';
import iview_zh from 'iview/dist/locale/zh-CN';

Vue.use(VueI18n);
Vue.locale = () => {};
const messages = {
    en: Object.assign(en, iview_en),
    zh: Object.assign(zh, iview_zh)
};

export const i18n = new VueI18n({
    locale: getLang(),
    fallbackLocale: 'en',
    messages
});

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});

export function setLang(lang) {
    i18n.locale = lang;
    localStorage.setItem('lang', lang);
}

export function getLang() {
    return localStorage.getItem('lang') || 'en';
}

export const langSet = {
    zh: '中文',
    en: 'English'
};
const loadedLanguages = ['en'];
export function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
        if (!loadedLanguages.includes(lang)) {
            return import(`../i18n/${lang}.js`).then(msgs => {
                i18n.setLocaleMessage(lang, msgs.default[lang]);
                loadedLanguages.push(lang);
                return setLang(lang);
            });
        }
        return Promise.resolve(setLang(lang));
    }
    return Promise.resolve(lang);
}
