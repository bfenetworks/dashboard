import Vue from 'vue';
import noahv from 'noahv-core';
import request from 'noahv-request';
import { v4 as uuidv4 } from 'uuid';
import { i18n, getLang } from '@/utils/i18n';
import store from '@/utils/store';
request.hooks.showGlobalLoading = data => {
    data.showLoading = false;
};
request.hooks.beforeRequest = config => {
    config.transformRequest = [
        data => {
            data = JSON.stringify(data);
            return data;
        }
    ];
    config.headers['Content-Type'] = 'application/json;';
    config.headers['X-Fe-Request-Id'] = uuidv4();
    config.headers['Accept-Language'] = getLang() || 'en';
    let user = store.getUser();
    if (user && !config.withoutAuth) {
        config.headers.Authorization = `Session ${user.sessionKey}`;
    }
    config.url = `${window.location.protocol}//${window.location.host}/open-api/v1/${config.url}`;
    return config;
};
request.hooks.beforeSuccess = response => {
    if (response.data === 'null') {
        response.data = '{}';
    }
    return response;
};
request.hooks.beforeFailure = error => {
    if (error.response) {
        const errorMsg = JSON.parse(error.response.data);
        if (!errorMsg) {
            Vue.prototype.$Notice.error({
                title: i18n.t('com.tipError'),
                render: h => {
                    return h('div', [i18n.t('com.tipNetworkFail')]);
                }
            });
        }
        error.response.data = errorMsg.Data;
        if (error.response.config.unneedTips) {
            error.response.isSilent = true;
            return error.response;
        }
        if (
            (error.response.status === 401 || error.response.status === 402) && noahv._router.currentRoute
                .name !== store.getLoginRoute()
        ) {
            if (error.response.status === 401) {
                store.removeUserData();
            }
            Vue.prototype.$Modal.error({
                title: 'Error',
                content: errorMsg.ErrMsg,
                onOk: () => {
                    noahv._router.push({
                        name: store.getLoginRoute()
                    });
                }
            });
            return;
        }
        let splitIndex = errorMsg.ErrMsg.indexOf(':') + 1;
        const title = errorMsg.ErrMsg.slice(0, splitIndex - 1);
        const content = errorMsg.ErrMsg.slice(splitIndex);
        Vue.prototype.$Notice.error({
            title,
            render: h => {
                return h('div', [
                    h('span', content),
                    ' '
                ]);
            },
            duration: 5
        });
        error.response.isSilent = true;
    }
    return error.response;
};