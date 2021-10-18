<!-- eslint-disable -->
<template>
    <div v-if="role === 1">
        <h3>{{ $t('com.sysAdmin') }} {{ user.name }}，{{ $t('product.welcome') }}!</h3>
        <p class="home-title">{{ $t('product.promptLanguage') }}</p>
    </div>
    <div v-else>
        <h3>{{ $t('product.productLineManager') }} {{ user.name }}，{{ $t('product.welcome') }}!</h3>
        <p class="home-title">{{ $t('product.productTips') }}{{ this.$route.params.name }}</p>
    </div>
</template>

<script>
export default {
    name: 'home',
    computed: {
        user() {
            return this.$store.getUser();
        },
        role() {
            return this.$store.getCurRole();
        }
    },
    methods: {
        lookManaual() {
           window.open('/v1/files/manaual.html');
        }
    }
};
</script>
<style>
.home-title {
    line-height: 24px;
}
.home-title-span {
    color: #409eff;
    cursor: pointer;
}
</style>
