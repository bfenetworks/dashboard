<!-- eslint-disable -->
<template>
    <div class="bfe-sidebar">
        <div class="header" @click="backDomain">
            <img
                :src="logo"
                class="logo"
            />
        </div>

        <div class="Menu">
            <sidebar-nav></sidebar-nav>
        </div>
    </div>
</template>
<script>
import sidebarNav from './sidebarNav';
export default {
    name: 'sidebar',

    components: {
        'sidebar-nav': sidebarNav
    },
    mounted() {
        let meta = this.$store.getMeta();
        if (meta && meta.logo) {
            this.logo = meta.logo;
        }
    },
    data() {
        return {
            openNames: [],
            logo: require('@/assets/img/logo.png')
        };
    },
    methods: {
        backDomain() {
            let name = 'product.list';
            let role = this.$ProductRole;
            if (this.$route.params.name === 'BFE') {
                name = 'product.home';
                role = this.$AdminRole;
            }
            if (this.$route.name !== name) {
                this.$router.push({name, query: {role}});
            }
        }
    }
};
</script>
<style lang="less" scoped>
.logo{
    display: block;
    width: 100%;
    height: 100%;
}
</style>
