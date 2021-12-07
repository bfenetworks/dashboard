import Vue from 'vue';
import { i18n } from '@/utils/i18n';
import { roleUndefined, role2name, roleProduct, roleAdmin } from '@/utils/const';

export default {
    state: Vue.observable({
        user: null,
        product: null,
        meta: null,
        curRole: roleUndefined
    }),
    getProduct() {
        if (this.state.product) {
            return this.state.product;
        }
        let product = localStorage.getItem('product');
        if (product) {
            return JSON.parse(product);
        }
        return null;
    },
    getUser() {
        if (this.state.user) {
            return this.state.user;
        }
        let ls = localStorage.getItem('user');
        if (ls) {
            return JSON.parse(ls);
        }
        return null;
    },
    getUserRoles() {
        let user = this.getUser();
        if (!user) {
            return [];
        }
        let roles = [{ id: roleProduct, role: i18n.t('com.productView') }];
        if (user.is_admin) {
            roles.push({ id: roleAdmin, role: i18n.t('com.sysAdminView') });
        }
        return roles;
    },
    getLoginRoute() {
        return 'LoginPassword';
    },
    getCurRole() {
        return this.state.curRole;
    },
    getMeta() {
        return this.state.meta;
    },
    getNav() {
        return this.state.meta ? this.state.meta.nav : null;
    },
    isProductManager() {
        return this.state.curRole === 0;
    },
    findNav(routeName) {
        if (!this.state.meta || !this.state.meta.nav) {
            return null;
        }

        let role2nav = this.state.meta.nav[role2name[this.state.curRole]];
        if (!role2nav) {
            return null;
        }
        return findNav(role2nav, routeName);
    },
    setProduct(newVal) {
        this.state.product = newVal;
        localStorage.setItem('product', JSON.stringify(this.state.product));
    },
    setCurRole(newVal) {
        this.state.curRole = newVal;
    },
    setMeta(newVal) {
        this.state.meta = newVal;
    },
    setUserData(newVal) {
        this.state.user = {
            name: newVal.user_name,
            sessionKey: newVal.session_key,
            is_admin: newVal.is_admin
        };
        localStorage.setItem('user', JSON.stringify(this.state.user));
        this.state.curRole = this.state.user.is_admin ? roleAdmin : roleProduct;
    },
    removeUserData() {
        this.state.user = null;
        localStorage.removeItem('user');
    },
    removeProduct() {
        this.state.product = null;
        localStorage.removeItem('product');
    }
};

function findNav(root, id) {
    if (!root) {
        return null;
    }

    if (root.id === id) {
        return root;
    }

    let length = root.children ? root.children.length : 0;
    for (let index = 0; index < length; index++) {
        let node = findNav(root.children[index], id);
        if (node) {
            return node;
        }
    }
    return null;
}
