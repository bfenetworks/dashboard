import store from './store';

export function urlFormat(url, data) {
    if (!data) {
        data = {};
    }
    if (!data.product_name) {
        let product = store.getProduct();
        if (product) {
            data.product_name = product.name;
        }
    }
    return url.replaceAll(/{\w+}/g, key => {
        return data[key.substr(1, key.length - 2)];
    });
}

export function timeFormatFunc(s) {
    if (s < 0) {
        return '';
    }
    let hour = Math.floor(s / 3600);
    let min = Math.floor(s / 60) % 60;
    let sec = s % 60;
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    return hour + ':' + min + ':' + sec;
};

export function fields(obj, keys) {
    for (let i = 0; i < keys.length; i++) {
        if (!obj) {
            return undefined;
        }
        obj = obj[keys[i]];
    }
    return obj;
}