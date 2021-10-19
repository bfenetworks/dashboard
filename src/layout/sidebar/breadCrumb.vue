<!-- eslint-disable -->
<template>
    <Breadcrumb class="bfe-breadcrumb">
        <BreadcrumbItem :to="{name: 'product.list', query: {role: $ProductRole}}" v-if="role == 0">
            <Icon type="ios-repeat" />{{ $t('product.list') }}
        </BreadcrumbItem>
        <BreadcrumbItem
            v-if="product && $route.name !== 'product.list'"
            :to="{name: 'product.home', query: {role: $ProductRole}}"
            >{{ product.name }}</BreadcrumbItem
        >
        <BreadcrumbItem v-if="nav">{{ $t(`nav.${nav.text}`) }}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
    name: 'breadCrumb',

    computed: {
        product() {
            return this.$store.getProduct();
        },
        user() {
            return this.$store.getUser();
        },
        role() {
            return this.$store.getCurRole();
        },
        nav() {
            return this.$store.findNav(this.$route.name);
        }
    }
};
</script>
