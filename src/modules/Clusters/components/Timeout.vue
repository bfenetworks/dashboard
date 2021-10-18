<!-- eslint-disable -->
<template>
    <Form
        ref="formData"
        label-position="top"
        :model="formData"
        :rules="ruleValidate"
    >
        <FormItem
            v-if="formData.timeouts"
            :label="$t('cluster.timeoutReadClientAgain')"
            rop="timeouts.timeout_read_client_again"
        >
            <InputNumber v-model="formData.timeouts['timeout_read_client_again']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.timeouts"
            :label="$t('cluster.timeoutReadbodyClient')"
            prop="timeouts.timeout_readbody_client"
        >
            <InputNumber v-model="formData.timeouts['timeout_readbody_client']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.timeouts"
            :label="$t('cluster.timeoutConnServ')"
            prop="timeouts.timeout_conn_serv"
        >
            <InputNumber v-model="formData.timeouts['timeout_conn_serv']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.timeouts"
            :label="$t('cluster.timeoutResHeader')"
            prop="timeouts.timeout_response_header"
        >
            <InputNumber v-model="formData.timeouts['timeout_response_header']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.timeouts"
            :label="$t('cluster.timeoutWriteClient')"
            prop="timeouts.timeout_write_client"
        >
            <InputNumber v-model="formData.timeouts['timeout_write_client']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.retries"
            :label="$t('cluster.maxRetryInSubcluster')"
            prop="retries.max_retry_in_subcluster"
        >
            <InputNumber v-model="formData.retries['max_retry_in_subcluster']" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.retries"
            :label="$t('cluster.maxRetryCrossSubcluster')"
            prop="retries.max_retry_cross_subcluster"
        >
            <InputNumber v-model="formData.retries['max_retry_cross_subcluster']" style="width: 100%;"></InputNumber>
        </FormItem>
    </Form>
</template>
<script>
import {cloneDeep} from 'lodash';
import {NumRegCheck} from '@/utils/const';
export default {
    name: 'Timeout',

    props: {
        baseConfigData: {
            type: Object,
            default() {
                return {};
            }
        },
        isAdd: {
            type: Boolean,
            default: false
        },
        reportFlag: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        baseConfigData: {
            handler(data) {
                this.formData = cloneDeep(data);
            },
            immediate: true,
            deep: true
        },
        reportFlag: {
            handler(v) {
                this.handleSubmit('formData');
            }
        }
    },

    data() {
        const timeoutValidate = (rule, value, callback) => {
            if (value === null) {
                callback(new Error(this.$t('com.tipNotEmpty')));
                return;
            }
            if (!NumRegCheck(value) || value < 0) {
                callback(new Error(this.$t('cluster.tipValueNonnegativeInteger')));
                return;
            }
            if (value > 99999999) {
                callback(new Error(this.$t('cluster.tipsValueMax')));
                return;
            }
            callback();
        };
        return {
            formData: {},
            ruleValidate: {
                'timeouts.timeout_read_client_again': [
                    {
                        required: true,
                        trigger: '',
                        validator: timeoutValidate
                    }
                ],
                'timeouts.timeout_readbody_client': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ],
                'timeouts.timeout_conn_serv': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ],
                'timeouts.timeout_response_header': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ],
                'timeouts.timeout_write_client': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ],
                'retries.max_retry_in_subcluster': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ],
                'retries.max_retry_cross_subcluster': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: timeoutValidate
                    }
                ]
            }
        };
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (!valid) {
                   this.$Message.error(this.$t('com.tipValidateError'));
                   return;
                }
                this.$emit('submitData', {
                    topic: 'baseConfigData',
                    data: this.formData
                });
            });
        }
    }
};
</script>
