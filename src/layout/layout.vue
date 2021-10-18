<!-- eslint-disable -->
<template>
    <div
        class="noahv-layout"
        v-if="$route.name != 'LoginPassword'"
        :class="showSidebar ? 'sidebarWidth' : ''"
    >
        <sidebar></sidebar>
        <div class="bfe-right-content">
            <headerBar @headerBar="getshowSidebar" />
            <div class="bfe-content">
                <breadCrumb />
                <div class="bfe-content-view">
                    <router-view class="routerView"></router-view>
                </div>
            </div>
        </div>
    </div>
    <div class="noahv-layout" v-else>
        <router-view></router-view>
    </div>
</template>
<script>
import breadCrumb from './sidebar/breadCrumb';
import sidebar from './sidebar/sidebar';
import headerBar from './sidebar/headerBar';
export default {
    name: 'NvHeader',

    components: {
        sidebar,
        headerBar,
        breadCrumb,
    },
    data() {
        return {
            showSidebar: false,
        };
    },

    methods: {
        getshowSidebar(data) {
            this.showSidebar = data;
        },
    },
};
</script>