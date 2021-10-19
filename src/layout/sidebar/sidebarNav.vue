<!-- eslint-disable -->
<template>
    <div>
        <Menu
            theme="dark"
            width="auto"
            class="menu_list"
            :active-name="activeName"
            @on-select="onSelect"
            v-if="navs && role2name[role]"
            :open-names="openNames"
            ref="Menu"
        >
            <navItem
                v-for="node in navs[role2name[role]].children"
                :node="node"
                :key="node.id"
                :name="node.id"
            ></navItem>
        </Menu>
    </div>
</template>

<script>
import {role2name} from '@/utils/const';
import navItem from './navItem';

export default {
    name: 'sidebarNav',
    components: {
        navItem
    },
    computed: {
        product() {
            return this.$store.getProduct();
        },
        navs() {
            return this.$store.getNav();
        },
        activeName() {
            return this.$route.name;
        },
        role() {
            return this.$store.getCurRole();
        }
    },
    data() {
        return {
            role2name: role2name,
            openNames: []
        };
    },
    mounted() {
        this.openDefauleMenu();
    },
    watch: {
        role() {
            this.openDefauleMenu();
        }
    },

    methods: {
        onSelect: function (name) {
            if (this.$route.name !== name) {
                this.$router.push({
                    name: name,
                    query: {
                        role: this.$route.query.role
                    }
                });
            }
        },
        openDefauleMenu() {
            this.openNames = [];
            if (this.navs) {
                this.navs[this.role2name[this.role]].children.forEach(item => {
                    this.openNames.push(item.id);
                });
                this.$nextTick(() => {
                    this.$refs.Menu.updateOpened();
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    border-right: none;
    color: #fff;
    background: linear-gradient(
        90deg,
        rgba(59, 125, 221, 0.2),
        rgba(59, 125, 221, 0.0875) 60%,
        transparent
    ) !important;
    border-left: 3px solid #515a6e;
    border-left-color: #a0cfff !important;
}
</style>
