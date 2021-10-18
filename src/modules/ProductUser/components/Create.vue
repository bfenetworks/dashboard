<!-- eslint-disable -->
<template>
    <div>
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            label-position="top"
        >
            <FormItem :label="$t('com.userName')" prop="user_name">
                <Select
                    v-model="formData.user_name"
                    style="width:200px"
                    :placeholder="$t('com.tipSelectX', {obj: $t('user.name')})"
                >
                    <Option
                        v-for="item in associatedUseList"
                        :key="item.user_name"
                        :value="item.user_name"
                    >{{ item.user_name }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div class="drawer-footer">
            <Button
                size="small"
                type="primary"
                @click="submitProductUser('formData')"
            >
                {{ $t('user.relationX', {obj: ''}) }}
            </Button>
            <Button
                size="small"
                class="com-create-btn"
                @click="handleReset('formData')"
            >
                {{ $t('com.reset') }}
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'instancePools',
    props: {
        userNameList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            associatedUseList: [],
            formData: {
                user_name: '',
            },
            ruleValidate: {
                user_name: [
                    { required: true, message: this.$t('com.tipEnterX', {obj: this.$t('com.userName')}),
                    trigger: 'change' }
                ]
            }
        };
    },
    mounted() {
        this.getProductAssociatedUserList();
    },
    methods: {
        getProductAssociatedUserList() {
            this.$request({
                url: this.$urlFormat('auth/users'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.associatedUseList = data.data.Data;
                    if (this.userNameList && this.userNameList.length > 0) {
                        this.associatedUseList = data.data.Data.filter(item => !this.userNameList.
                        includes(item.user_name));
                    }
                }
            });
        },
        submitProductUser(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.formData);
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>
