// eslint-disable
import Vue from 'vue';
import { roleUndefined, roleProduct, roleAdmin, systemProduct } from './const';
import store from './store';

let excludeRoute = {
    'product.home': true,
    'product.list': true
};

function handleRole(userData, role) {
    if (role === Vue.prototype.$AdminRole && userData.isAdmin) {
        return roleAdmin;
    }
    if (role === Vue.prototype.$ProductRole) {
        return roleProduct;
    }
    return roleUndefined;
}
function IcoCreate(icoUrl) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = icoUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
}
export default async to => {
    let meta = store.getMeta();
    if (!meta) {
        let navRsp = await Vue.prototype.$request({
            url: 'meta',
            method: 'get',
            unneedTips: true,
            withoutAuth: true
        });
        if (navRsp.data.Data.icon) {
            IcoCreate(navRsp.data.Data.icon);
        }
        store.setMeta(navRsp.data.Data);
        meta = navRsp.data.Data;
    }
    if (to.name === 'LoginPassword') {
        return true;
    }

    let loginRoute = store.getLoginRoute();
    const userData = store.getUser();
    if (!userData) {
        return loginRoute;
    }
    const curRole = handleRole(userData, to.query.role);
    if (curRole === roleUndefined) {
        return 'illegalAccess';
    }
    let product = store.getProduct();
    let role = store.getCurRole();
    if (!product) {
        let productName = to.params.name;
        if (productName && productName !== 'BFE') {
            let rsp = await Vue.prototype.$request({
                url: `products/${productName}`,
                method: 'get'
            });
            product = {
                name: rsp.data.Data.name
            };
        } else {
            product = {
                name: 'BFE'
            };
        }
        if (!product && role === roleUndefined && userData.isAdmin) {
            product = systemProduct;
        }
        if (product) {
            store.setProduct(product);
        }
    }
    if (role === roleUndefined) {
        if (!product) {
            store.setCurRole(roleProduct);
            if (to.name === 'product.list') {
                return true;
            }

            return 'product.list';
        }
        store.setCurRole(curRole);
    }

    if (excludeRoute[to.name]) {
        return true;
    }
    let curNav = store.findNav(to.name);
    if (!curNav) {
        return loginRoute;
    }
    return true;
};