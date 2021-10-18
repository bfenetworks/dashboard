<!-- eslint-disable -->
<template>
    <div class="common-404">
        <Nv404 :title="title" :tips="tips" :href="href" />
    </div>
</template>
<script>
export default {
    name: 'common-404',
    data() {
        return {
            title: '404',
            tips: this.$t('login.tip404'),
            href: '/'
        };
    }
};
</script>