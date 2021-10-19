<!-- eslint-disable -->
<template>
    <div>
        <Tabs
            v-model="nameValue"
        >
            <TabPane
                name="ordinaryUser"
                :label="$t('user.ordinaryUser')"
            >
                <OrdinaryUser v-if="nameValue === 'ordinaryUser'"/>
            </TabPane>
            <TabPane
                name="innerUser"
                :label="$t('user.innerUser')"
            >
                <InnerUser v-if="nameValue === 'innerUser'"/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import OrdinaryUser from './components/OrdinaryUser.vue';
import InnerUser from './components/InnerUser.vue';
export default {
    name: 'instancePools',
    components: {
       OrdinaryUser,
       InnerUser
    },

    data() {
        return {
            nameValue: 'ordinaryUser'
        };
    }
};
</script>

