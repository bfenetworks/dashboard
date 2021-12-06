<!-- eslint-disable -->
<template>
    <div>
        <div>
            <Form
                ref="formItem"
                :model="formItem"
                :rules="ruleValidate"
                label-position="top"
            >
                <FormItem :label="$t('com.userName')" prop="user_name">
                    <Input
                        v-model="formItem.user_name"
                        type="text"
                        :placeholder="$t('com.tipEnterX', {obj: $t('com.userName')})"
                        class="com-create-input"
                    />
                </FormItem>
                <FormItem :label="$t('com.password')" prop="password">
                    <Input
                        v-model="formItem.password"
                        type="password"
                        autocomplete="new-password"
                        :placeholder="$t('com.tipEnterX', {obj: $t('com.password')})"
                        class="com-create-input"
                    />
                </FormItem>
                <FormItem :label="$t('user.confirmPassword')" prop="confirmPass">
                    <Input
                        v-model="formItem.confirmPass"
                        type="password"
                        :placeholder="$t('user.tipConfirmPasswordRule')"
                        class="com-create-input"
                    />
                </FormItem>
                <FormItem :label="$t('user.role')" prop="is_admin">
                    <Checkbox v-model="formItem.is_admin">{{ $t('com.sysAdmin') }}</Checkbox>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button
                    size="small"
                    type="primary"
                    @click="submitAdminUser('formItem')"
                >{{ $t('com.create') }}</Button>
                <Button
                    size="small"
                    class="com-create-btn"
                    @click="handleReset('formItem')"
                >{{ $t('com.reset') }}</Button>
            </div>
        </div>
    </div>
</template>

<script>
import {UserNameRegCheck, PasswordRegCheck} from '@/utils/const';
export default {
    name: 'instancePools',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('com.password')})));
                return;
            }
            if (!PasswordRegCheck(value)) {
                callback(new Error(this.$t('user.tipPasswordRule')));
                return;
            }
            if (this.formItem.confirmPass !== '') {
                this.$refs.formItem.validateField('confirmPass');
            }
            callback();
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('user.tipConfirmPasswordRule')));
                return;
            }
            if (value !== this.formItem.password) {
                callback(new Error(this.$t('user.tipConfirmError')));
                return;
            }
            callback();
        };
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('com.userName')})));
                return;
            }
            if (!UserNameRegCheck(value)) {
                callback(new Error(this.$t('user.tipNameRule')));
                return;
            }
            callback();
        };
        return {
            formItem: {
                user_name: '',
                password: '',
                confirmPass: '',
                is_admin: false
            },
            ruleValidate: {
                    user_name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    confirmPass: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ]
                },
        };
    },
    methods: {
        submitAdminUser(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.formItem);
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>
