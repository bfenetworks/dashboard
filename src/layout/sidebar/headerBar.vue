<!-- eslint-disable -->
<template>
    <ul :class="[ishandleTitleWidth ? 'bfe-header-isshow' : '', 'bfe-header']">
        <li>
            <Dropdown class="header_box header_name" @on-click="onLangChange">
                <img class="img" src="@/assets/img/language.png"/>
                {{ lang === 'zh' ? '简体中文' : 'English' }}
                <DropdownMenu slot="list">
                    <DropdownItem
                        v-for="(tips, key) in langSet" :key="key"
                        :name="key"
                    > {{ tips }} </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
        <li :class="{handleSidebarWidth: true}" @click="handleTitleWidth" class="bfe-header-icon">
            <i class="noahv-icon noahv-icon-fold-left noahv-icon-title"></i>
        </li>
        <li>
            <Dropdown @on-click="userDropdown" class="header_name">
                <Icon type="md-person" />
                {{ user ? user.name : '' }}
                <DropdownMenu slot="list">
                    <DropdownItem name="logout">{{ $t('com.cancellation') }}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
        <li>
             <Dropdown class="header_box header_name" @on-click="roleChange">
                <Icon type="md-apps" />
                {{ currentView }}
                <DropdownMenu slot="list">
                    <DropdownItem
                        v-for="role in roles"
                        :key="role.id"
                        :name="role.id"
                    > {{ role.role }} </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
    </ul>
</template>
<script>
import {setLang, langSet, getLang} from '@/utils/i18n';
export default {
    name: 'headerBar',
    computed: {
        role() {
            return this.$store.getCurRole();
        },
        roles() {
            return this.$store.getUserRoles();
        },
        user() {
            return this.$store.getUser();
        },
        currentView() {
            return this.$store.isProductManager() ? this.$t('com.productView') :
            this.$t('com.sysAdminView');
        }
    },
    mounted() {
        this.curRole = this.role;
        this.lang = getLang();
    },
    data() {
        return {
            curRole: -1,
            ishandleTitleWidth: false,
            langSet,
            lang: 'zh',
            view: null
        };
    },
    methods: {
        onLangChange(lang) {
            if (this.lang !== lang) {
                location.reload();
                this.$Spin.show();
                this.lang = lang;
                setLang(lang);
                setTimeout(() => {
                    this.$Spin.hide();
                }, 2000);
            }
        },
        handleTitleWidth() {
            this.$emit('headerBar', !this.ishandleTitleWidth);
            this.ishandleTitleWidth = !this.ishandleTitleWidth;
        },
        roleChange(roleId) {
            if (this.view !== roleId) {
                this.view = roleId;
                if (roleId === -1) {
                    return;
                }
                this.$store.setCurRole(roleId);
                this.$store.removeProduct();
                switch (roleId) {
                    // System View
                    case 1:
                        this.$router.push({
                            name: 'product.home',
                            params: {name: 'BFE'},
                            query: {role: this.$AdminRole}
                        });
                        break;
                    // Tenant View
                    case 0:
                        this.$router.push({name: 'product.list', query: {role: this.$ProductRole}});
                        break;
                }
            }
        },
        userDropdown(name) {
            if (name === 'logout') {
                this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('login.tipConfirmLogout'),
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('auth/session-keys/{session_key}', {
                            session_key: this.user.sessionKey
                        }),
                        method: 'delete'
                    }).then(res => {
                        if (res.status === 200) {
                            this.$store.removeUserData();
                            this.$router.push({
                                name: this.$store.getLoginRoute()
                            });
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info({
                        content: this.$t('com.tipCancel')
                    });
                },
            });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.role_select {
    width: 120px;
    background: none !important;
    color: black;
}
/deep/ .ivu-select-selection .ivu-icon-ios-arrow-down:before {
    content: '\F110';
    left: 5px;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value,
.ivu-select-multiple .ivu-select-selection .ivu-select-selected-value {
    padding-left: 35px;
}
/deep/ .ivu-select-arrow {
    left: 10px;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-arrow, .ivu-select-multiple
.ivu-select-selection .ivu-select-arrow {
    right: unset;
}
.bfe-header {
    left: 240px;
    transition: margin-left 0.35s ease-in-out, left 0.35s ease-in-out,
        margin-right 0.35s ease-in-out, right 0.35s ease-in-out;
}
.bfe-header-isshow {
    left: 0px;
    .bfe-header-icon {
        transform: rotateY(180deg);
        transition: transform 0.35s;
    }
}
.bfe-header-icon {
    float: left;
}
.noahv-icon-title {
    color: #000000;
    font-size: 24px;
}
.header_name {
    color: #000000;
}
.header_box {
    position: relative;
    padding-left: 20px;
    .img {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: -20px;
        transform: translateY(-50%)
    }
}
</style>
