
export default [
    {
        component: r => require.ensure([], () => r(require('../modules/Login/loginPassword.vue')), 'login_password'),
        path: '/login',
        name: 'LoginPassword'
    },
    {
        component: r => require.ensure([], () =>
            r(require('../modules/Product/components/ProductList')), 'products_list'),
        path: '/productList',
        name: 'product.list'
    },
    {
        component: r => require.ensure([], () => r(require('../layout/BaseView.vue')), 'products'),
        path: '/products/:name',
        name: 'base-view',
        redirect: {
            name: 'gslb.list'
        },
        children: [
            {
                component: r => require.ensure([], () => r(require('../modules/GslbConfigs')), 'gslb'),
                path: 'gslb',
                name: 'gslb.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Login/Home')), 'home'),
                path: '',
                name: 'product.home'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/InstancePool')), 'instance-pool'),
                path: 'instance-pool',
                name: 'instance_pool.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/InstancePool')), 'instance-pool'),
                path: 'agent-instance-pool',
                name: 'agent-instance-pool.list'
            },
            {
                component: r =>
                    require.ensure(
                        [],
                        () => r(require('../modules/BfeInstancePool')),
                        'instance-pool'
                    ),
                path: 'instance-pool-bfe',
                name: 'bfe.instance_pool.admin.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/InstancePool')), 'instance-pool'),
                path: 'instance-pool-nlb',
                name: 'nlb.instance_pool.admin.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Domains')), 'domain'),
                path: 'domain',
                name: 'domain.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Cert')), 'cert'),
                path: 'cert',
                name: 'cert.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Product')), 'product'),
                path: 'product-upsert',
                name: 'product.upsert'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/User')), 'user'),
                path: 'user',
                name: 'user.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/ProductUser')), 'user'),
                path: 'product_user',
                name: 'product_user.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Clusters')), 'cluster.list'),
                path: 'cluster',
                name: 'cluster.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/SubClusters')), 'subcluster.list'),
                path: 'subcluster',
                name: 'subcluster.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Routes')), 'router.list'),
                path: 'router',
                name: 'router.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/BfeClusters')), 'cluster.admin.list'),
                path: 'bfe-clusters',
                name: 'cluster.admin.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/Product')), 'product.admin.list'),
                path: 'admin-product',
                name: 'product.admin.list'
            },
        ]
    },
    {
        component: r => require.ensure([], () => r(require('src/layout/404')), '404'),
        path: '*'
    }
];
