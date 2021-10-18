<!-- eslint-disable -->
<template>
    <Form
        label-position="top"
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
    >
        <FormItem :label="$t('com.nameX', {obj: $t('cluster.name')})" prop="name">
            <Input v-model="formData.name" :disabled="!isAdd" />
        </FormItem>
        <FormItem :label="$t('cluster.clusterDescription')" prop="description">
            <Input v-model="formData.description" />
        </FormItem>
        <FormItem
            v-if="formData.connection"
            :label="$t('cluster.maxIdleConnPerRs')"
            prop="connection.max_idle_conn_per_rs"
        >
            <InputNumber
                v-model="formData.connection.max_idle_conn_per_rs"
                class="from-item-inp"
            ></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.sticky_sessions"
            :label="$t('cluster.hashStrategy')"
            prop="sticky_sessions.hash_strategy"
        >
            <Select
                v-model="formData.sticky_sessions.hash_strategy"
                size="small"
                class="from-item-inp"
                @change="selectHashStrategy"
            >
                <Option
                    v-for="item in hashStrategyOptions"
                    :value="item.name"
                    :key="item.name"
                >{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem
            v-if="formData.sticky_sessions && formData.sticky_sessions.hash_strategy !== 'CLIENT_IP_ONLY'"
            :label="$t('cluster.hashHeader')"
            prop="sticky_sessions.hash_header">
            <Input v-model="formData.sticky_sessions.hash_header" />
        </FormItem>
        <FormItem
            v-if="formData.sticky_sessions"
            :label="$t('cluster.stickySessions')"
            prop="sticky_sessions.session_sticky_type"
        >
            <Select
                v-model="formData.sticky_sessions.session_sticky_type"
                size="small"
                class="from-item-inp"
            >
                <Option
                    v-for="item in sessionStickyOptions"
                    :value="item.value"
                    :key="item.value"
                >{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem
            v-if="formData.buffers"
            :label="$t('cluster.reqWriteBufferSize')"
            prop="connection.req_write_buffer_size"
        >
            <InputNumber
                v-model="formData.buffers.req_write_buffer_size"
                class="from-item-inp"
            ></InputNumber>
        </FormItem>
        <FormItem
            v-if="formData.connection"
            :label="$t('cluster.cancelOnClientClose')"
            prop="connection.cancel_on_client_close"
        >
            <Select
                v-model="formData.connection.cancel_on_client_close"
                size="small"
                class="from-item-inp"
            >
                <Option
                    v-for="item in boolOptions"
                    :value="item.value"
                    :key="item.value"
                >{{ item.name }}</Option>
            </Select>
        </FormItem>
    </Form>
</template>
<script>
import {BaseClustersNameRegCheck, NumRegCheck} from '@/utils/const';
import {cloneDeep} from 'lodash';
export default {
    name: 'BaseConfig',

    props: {
        baseConfigData: {
            type: Object,
            required: true,
            defalut() {
                return {};
            }
        },
        isAdd: {
            type: Boolean,
            defalut: false
        },
        reportFlag: {
            type: Boolean,
            defalut: false
        },
        clusterNames: {
            type: Array,
            required: true,
            defalut() {
                return [];
            }
        }
    },

    watch: {
        baseConfigData: {
            handler(data) {
                if (!this.isAdd) {
                    if (data) {
                        this.formData = cloneDeep(data);
                        if (data.connection) {
                            this.formData.connection.cancel_on_client_close = data.connection.
                            cancel_on_client_close + '';
                        }
                    }
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
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX',
                {obj: this.$t('com.nameX', {obj: this.$t('cluster.name')})})));
                return;
            }
            if (this.isAdd && this.clusterNames.indexOf(value) !== -1) {
                callback(new Error(this.$t('com.tipAlreadyExistsX',
                {obj: this.$t('com.nameX', {obj: this.$t('cluster.name')})})));
                return;
            }
            if (!BaseClustersNameRegCheck(value)) {
                callback(
                    new Error(this.$t('cluster.tipClusterNameRule'))
                );
                return;
            }
            callback();
        };
        const validateMaxIdleConnPerHost = (rule, value, callback) => {
            if (value === null) {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('cluster.maxIdleConnPerRs')})));
            } else {
                if (!NumRegCheck(value)) {
                    callback(new Error(this.$t('cluster.tipValueNonnegativeInteger')));
                } else if (value > 99999999) {
                    callback(new Error(this.$t('cluster.tipsValueMax')));
                }
                callback();
            }
        };
        const validateReqWriteBufferSize = (rule, value, callback) => {
            if (value === null) {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('cluster.reqWriteBuffer')})));
            } else {
                callback();
            }
        };
        return {
            ruleValidate: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateName
                    }
                ],
                'connection.max_idle_conn_per_rs': [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateMaxIdleConnPerHost
                    }
                ],
                'sticky_sessions.hash_strategy': [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('com.tipSelectX', {obj: this.$t('cluster.hashStrategy')})
                    }
                ],
                'sticky_sessions.hash_header': [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('com.tipSelectX', {obj: this.$t('cluster.hashHeader')})
                    }
                ],
                'sticky_sessions.session_sticky_type': [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('com.tipSelectX', {obj: this.$t('cluster.stickySessions')})
                    }
                ],
                'connection.req_write_buffer_size': [
                    {
                        required: true,
                        trigger: 'change',
                        validator: validateReqWriteBufferSize
                    }
                ],
                'connection.cancel_on_client_close': [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('com.tipSelectX', {obj: this.$t('cluster.cancelOnClientClose')})
                    }
                ]
            },
            formData: {
                name: '',
                description: '',
                connection: {
                    max_idle_conn_per_rs: 0,
                    cancel_on_client_close: 'false'
                },
                buffers: {
                    req_write_buffer_size: 512
                },
                sticky_sessions: {
                    session_sticky_type: 'INSTANCE',
                    hash_strategy: 'CLIENT_ID_ONLY',
                    hash_header: 'Cookie:USERID'
                },
                timeouts: {
                    timeout_conn_serv: 2,
                    timeout_response_header: 60,
                    timeout_readbody_client: 30000,
                    timeout_read_client_again: 30000,
                    timeout_write_client: 60000
                },
                retries: {
                    max_retry_in_subcluster: 2,
                    max_retry_cross_subcluster: 0
                }
            },
            hashStrategyOptions: [
                {
                    name: 'CLIENT_ID_ONLY'
                },
                {
                    name: 'CLIENT_IP_ONLY'
                },
                {
                    name: 'CLIENT_ID_PREFERED'
                }
            ],
            sessionStickyOptions: [
                {
                    name: this.$t('cluster.instanceSessionPersistence'),
                    value: 'INSTANCE'
                },
                {
                    name: this.$t('cluster.subClusterSessionPersistence'),
                    value: 'SUB_CLUSTER'
                }
            ],
            boolOptions: [
                {
                    name: this.$t('com.enable'),
                    value: 'true'
                },
                {
                    name: this.$t('com.deactivate'),
                    value: 'false'
                }
            ]
        };
    },
    methods: {
        selectHashStrategy() {
            if (!this.formData.sticky_sessions.hash_header) {
                this.$set(this.formData.sticky_sessions, 'hash_header', 'Cookie:USERID');
                this.$set(this.ruleValidate, 'hash_header', {
                    required: true,
                    trigger: 'change',
                    message: this.$t('com.tipEnterX', {obj: this.$t('cluster.hashHeader')})
                });
            }
        },
        handleSubmit(name) {
            if (this.formData.sticky_sessions.hash_strategy === 'CLIENT_IP_ONLY') {
                this.$delete(this.formData.sticky_sessions, 'hash_header');
                this.$delete(this.ruleValidate, 'sticky_sessions.hash_header');
            }
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
