import Vue from 'vue';
import { Icon, Pagination } from 'element-ui';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale';
import { getLang } from '@/utils/i18n';

Vue.use(VueI18n);
Vue.use(Icon);
Vue.use(Pagination);

const messages = {
    en: {
        ...enLocale
    },
    zh: {
        ...zhLocale
    }
};
const i18n = new VueI18n({
    locale: getLang(),
    messages
});
ElementLocale.i18n((key, value) => i18n.t(key, value));
