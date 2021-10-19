<!-- eslint-disable -->
<template>
    <div class="health-check">
        <Form ref="formData" label-position="top" :model="formData" :rules="ruleValidate">
            <FormItem :label="$t('cluster.healthCheckFailnum')" prop="failnum">
                <InputNumber
                    v-model="formData['failnum']"
                    class="from-item-inp"
                ></InputNumber>
            </FormItem>
            <FormItem :label="$t('cluster.healthCheckInterval')" prop="interval">
                <InputNumber
                    v-model="formData['interval']"
                    class="from-item-inp"
                ></InputNumber>
            </FormItem>
            <FormItem :label="$t('cluster.healthCheckHost')" prop="host">
                <Input
                    v-model="formData['host']"
                    placeholder="example.com"
                />
            </FormItem>
            <FormItem :label="$t('cluster.healthCheckUri')" prop="uri">
                <Input
                    v-model="formData['uri']"
                    placeholder="/example"
                />
            </FormItem>
            <FormItem :label="$t('cluster.healthCheckStatuscode')" prop="statuscode">
                <InputNumber
                    v-model="formData['statuscode']"
                    class="from-item-inp"
                ></InputNumber>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
import {HealthRegCheck, NumRegCheck} from '@/utils/const';
export default {
    name: 'passiveHealthCheck',

    props: {
        passiveHealthData: {
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
        passiveHealthData: {
            handler(data) {
                if (!this.isAdd) {
                    this.formData = cloneDeep(data);
                }
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
        const validateNumber = label => {
            return (rule, value, callback) => {
                if (value === null) {
                    callback(new Error(`${label}` + this.$t('com.tipNotEmpty')));
                }
                else {
                    if (!NumRegCheck(value) || value < 0) {
                        callback(new Error(`${label}` + this.$t('cluster.tipValueNonnegativeInteger')));
                    }
                    else if (value > 99999999) {
                        callback(new Error(`${label}` + this.$t('cluster.tipsValueMax')));
                    }
                    callback();
                }
            };
        };
        const validateHealthcheckHost = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('cluster.healthCheckHost')})));
            }
            else {
                if (!HealthRegCheck(value)) {
                    callback(new Error(this.$t('com.tipFormatError')));
                }
                callback();
            }
        };
        const validateHealthcheckUri = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('cluster.healthCheckUri')})));
            }
            else {
                if (!/^\//.test(value)) {
                    callback(new Error(this.$t('com.tipMustStartWithX', {obj: this.$t('cluster.reqUri')})));
                }
                callback();
            }
        };
        return {
            formData: {
                interval: 1000,
                failnum: 10,
                host: '',
                uri: '',
                statuscode: 0
            },
            ruleValidate: {
                interval: [
                    {required: true, validator: validateNumber(this.$t('cluster.healthCheckInterval')),
                    trigger: 'change'}
                ],
                failnum: [
                    {
                        required: true,
                        validator: validateNumber(this.$t('cluster.healthCheckFailnum')),
                        trigger: 'change'
                    }
                ],
                host: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: validateHealthcheckHost
                    }
                ],
                uri: [
                    {
                        required: true,
                        validator: validateHealthcheckUri,
                        trigger: 'change'
                    }
                ],
                statuscode: [
                    {
                        required: true,
                        validator: validateNumber(this.$t('cluster.healthCheckStatuscode')),
                        trigger: 'change'
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
                    topic: 'passiveHealthData',
                    data: this.formData
                });
            });
        }
    }
};
</script>
<style lang="less" scoped>
.health-check {
    .from-item-inp {
        width: 100%;
    }
    .health-check-box {
        margin: 20px 0;
        .select-monitorsAlive {
            width: 100px;
        }
        .span-monitors-alive {
            color: #409eff;
        }
    }
    .message{
        padding-top: 30px;
    }
}
</style>