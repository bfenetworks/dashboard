<!-- eslint-disable -->
<template>
    <div v-if="!node.children" class="navItem">
        <MenuItem :name="node.id" :disabled="navItemDidabled" @click.native="handlerNavItem"
            ><Icon :custom="navIcon[node.id]" />{{ $t(`nav.${node.text}`) }}</MenuItem
        >
    </div>
    <div v-else>
        <Submenu :name="node.id" :disabled="navItemDidabled" @click.native="handlerNavItem">
            <template slot="title"
                ><Icon :custom="navIcon[node.id]" />{{ $t(`nav.${node.text}`) }}</template
            >
            <navItem v-for="t in node.children" :key="t.id" :name="t.id" :node="t"></navItem>
        </Submenu>
    </div>
</template>

<script>
export default {
    name: 'navItem',
    data() {
        return {
            navIcon: {
                'common.subnav': 'iconfont icon-common',
                'bfe.instance_pool.admin.list': 'iconfont icon-instancePool',

                'cluster.admin.list': 'iconfont icon-cluster',
                'cert.list': 'iconfont icon-cert',

                'basic.subnav': 'iconfont icon-subnav',
                'product.admin.list': 'iconfont icon-product',

                'sys.subnav': 'iconfont icon-user',
                'user.list': 'iconfont icon-user',
                'product_user.list': 'iconfont icon-user',

                'instance_pool.list': 'iconfont icon-instancePool',
                'domain.list': 'iconfont icon-common',
                'subcluster.list': 'iconfont icon-cluster',
                'subcluster.admin.list': 'iconfont icon-cluster',
                'cluster.list': 'iconfont icon-cluster',
                'router.list': 'iconfont icon-route',
                'gslb.list': 'iconfont icon-gslb',
                'product.upsert': 'iconfont icon-product'
            }
        };
    },
    computed: {
        product() {
            return this.$store.getProduct();
        },
        navItemDidabled() {
            return this.product === null && this.$route.params.name !== 'BFE';
        }
    },
    props: {
        node: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    methods: {
        handlerNavItem() {
            if (this.navItemDidabled) {
                this.$Message.warning({
                    content: this.$t('login.tipSelectProductLine')
                });
            }
        }
    }
};
</script>