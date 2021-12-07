<!-- eslint-disable -->
<template>
    <div>
        <Tabs
            v-model="nameValue"
        >
            <TabPane
                name="User"
                :label="$t('user.ordinaryUser')"
            >
                <User v-if="nameValue === 'User'"/>
            </TabPane>
            <TabPane
                name="Token"
                :label="$t('user.innerUser')"
            >
                <Token v-if="nameValue === 'Token'"/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import User from './components/User.vue';
import Token from './components/Token.vue';
export default {
    name: 'instancePools',
    components: {
       User,
       Token
    },

    data() {
        return {
            nameValue: 'User'
        };
    }
};
</script>

