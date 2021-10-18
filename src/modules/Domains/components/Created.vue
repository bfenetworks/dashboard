<!-- eslint-disable -->
<template>
    <div>
        <Form
            ref="domainsForm"
            :model="domainsForm"
            :rules="ruleValidate"
            label-position="top"
        >
            <FormItem :label="$t('domain.name')" prop="name">
                <Input
                    v-model="domainsForm.name"
                    type="text"
                    :placeholder="$t('com.tipRequiredX', {obj: $t('domain.name')})"
                    class="com-create-input"
                />
            </FormItem>
        </Form>
        <div class="drawer-footer">
            <Button
                size="small"
                type="primary"
                @click="submitForm('domainsForm')"
            >
                {{ $t('com.submit') }}
            </Button>
            <Button
                size="small"
                class="com-create-btn"
                @click="handleReset('domainsForm')"
            >
                {{ $t('com.reset') }}
            </Button>
        </div>
    </div>
</template>

<script>
import {DominNameRegCheck} from '@/utils/const';
export default {
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipRequiredX', {obj: this.$t('domain.name')})));
                return;
            }
            if (this.domainNames.indexOf(value) !== -1) {
                callback(new Error(this.$t('com.tipAlreadyExistsX', {obj: this.$t('domain.name')})));
                return;
            }
            if (!DominNameRegCheck(value)) {
                callback(new Error(this.$t('com.tipNameRule')));
                return;
            }
            if (value.length < 2) {
                callback(new Error(this.$t('com.tipLengthX', {len: 1})));
                return;
            }
            callback();
        };
        return {
            domainsForm: {
                name: ''
            },
            ruleValidate: {
                name: [
                    { required: true, validator: validateName, trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        domainNames: {
            type: Array,
            required: true
        }
    },
    methods: {
        submitForm(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit('submitForm', this.domainsForm);
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
    }
};
</script>