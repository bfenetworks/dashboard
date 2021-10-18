<!-- eslint-disable -->
<template>
    <div>
        <ProductUpsert v-if="isProductManager"/>
        <AdminList v-else/>
    </div>
</template>
<script>
import AdminList from './components/AdminList.vue';
import ProductUpsert from './components/ProductUpsert.vue';
    export default {
        components: {
            AdminList,
            ProductUpsert
        },
        computed: {
            isProductManager() {
                return this.$store.isProductManager();
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
