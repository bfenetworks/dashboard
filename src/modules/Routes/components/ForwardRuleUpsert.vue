<!-- eslint-disable -->
<template>
    <div class="NewForwardingRules">
        <Form v-show="tabValue === 'basicRules'" ref="basicForm" :model="basicForm"
        :rules="basicFormValidate" label-position="top">
            <p style="line-height:40px;color:#515a6e"><span style="color:red">* </span>
                {{ $t('route.expression') }}
            </p>
            <FormItem :label="$t('route.hostName')" class="inline" prop="host_names">
                <Input
                    v-model="basicForm.host_names"
                    type="textarea" :autosize="{minRows: 2,maxRows: 3}"
                    :placeholder="$t('route.tipHostNameRule')"
                />
            </FormItem>
            <FormItem :label="$t('route.path')" class="inline" prop="paths">
                <Input
                    v-model="basicForm.paths"
                    type="textarea" :autosize="{minRows: 2,maxRows: 3}"
                    :placeholder="$t('route.tipPathRule')"
                />
            </FormItem>
            <FormItem :label="$t('com.desc')" prop="description">
                <Input
                    v-model="basicForm.description"
                    type="text"
                    :placeholder="$t('com.tipEnterX', {obj: $t('com.desc')})"
                />
            </FormItem>
            <FormItem :label="$t('route.targetCluster')" prop="cluster_name">
                <RadioGroup v-model="destinationCluster" @on-change="changeCluster">
                    <Radio label="1">{{ $t('route.tipTargetCluster') }}
                        <Tooltip placement="top" :content="$t('route.tipHitRule')">
                            <Icon type="ios-alert-outline" />
                        </Tooltip>
                    </Radio>
                    <Radio label="2">{{ $t('route.tipAdvanceMate') }}
                         <Tooltip placement="top" :content="$t('route.tipAdvanceMate')">
                             <Icon type="ios-alert-outline" />
                        </Tooltip>
                    </Radio>
                </RadioGroup>
                <Select
                    v-if="clustersData && destinationCluster === '1'"
                    v-model="basicForm.cluster_name"
                    placeholder="Select a Cluster"
                    class="cluster_id_title"
                >
                    <Option
                        v-for="item in clustersData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem class="com-btn-box drawer-footer">
                <Button
                    type="primary"
                    size="small"
                    @click="handleBasicSubmit('basicForm')"
                >{{ $t('com.localSave') }}</Button>
                <Button
                    size="small"
                    class="reset-btn"
                    @click="handleReset('basicForm')"
                >{{ $t('com.reset') }}</Button>
            </FormItem>
        </Form>
        <Form v-show="tabValue === 'advancedRules'" ref="formData"
            :model="formData" :rules="ruleValidate" label-position="top">
            <FormItem
                v-if="formData.name !== 'default'"
                :label="$t('route.expression')"
                prop="expression"
            >
                <Expression
                    :expression="formData.expression"
                    @expressionChanged="onExpressionChanged"
                />
            </FormItem>
            <FormItem :label="$t('route.targetCluster')" prop="cluster_name">
                <Select
                    v-if="clustersData"
                    v-model="formData.cluster_name"
                    placeholder="Select a Cluster"
                    class="cluster_id_title"
                >
                    <Option
                        v-for="item in clustersData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('com.desc')" prop="description">
                <Input
                    v-model="formData.description"
                    :disabled="
                        formData.name == 'default'
                    "
                />
            </FormItem>
            <FormItem class="com-btn-box drawer-footer">
                <Button
                    type="primary"
                    size="small"
                    @click="handleSubmit('formData')"
                >{{ $t('com.localSave') }}</Button>
                <Button
                    size="small"
                    class="reset-btn"
                    @click="handleReset('formData')"
                >{{ $t('com.reset') }}</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import Expression from '@/components/Expression';
import { cloneDeep } from 'lodash';
export default {
    name: 'ForwardRuleUpsert',
    mounted() {
        if (this.formData.name === 'default') {
            let obj = {};
            for (let key in this.ruleValidate) {
                if (key !== 'expression') {
                    obj[key] = this.ruleValidate[key];
                }
            }
            this.ruleValidate = obj;
        }
    },
    components: { Expression },
    props: {
        isAdd: {
            type: Boolean,
            default: true,
        },
        rulesData: {
            type: Object,
            required: true
        },
        rulesValue: {
            type: String,
            default: ''
        },
        clustersData: {
            type: Array,
            required: true
        }
    },

    watch: {
        rulesData: {
            handler(data) {
                if (!this.isAdd) {
                    if (this.rulesValue === 'basicRules') {
                        this.basicForm = cloneDeep(data);
                        this.basicForm.paths = data.paths.join(',');
                        this.basicForm.host_names = data.host_names.join(',');
                        if (this.basicForm.cluster_name === 'GO_TO_ADVANCED_RULES') {
                            this.destinationCluster = '2';
                        }
                        else {
                            this.destinationCluster = '1';
                        }
                    }
                    else if (this.rulesValue === 'advancedRules') {
                        this.formData = cloneDeep(data);
                    }
                    else {
                        this.defaultForm = cloneDeep(data);
                    }
                }
            },
            deep: true,
            immediate: true
        },
        rulesValue: {
            handler(data) {
                this.tabValue = data;
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        const validateExpression = async (rule, value, callback) => {
            if (this.formData.errmsg) {
                callback(new Error(this.formData.errmsg));
                return;
            }
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('route.expression')})));
                return;
            }
        };
        const validateClusterName = (rule, value, callback) => {
            if (this.destinationCluster === '2') {
                callback();
                return;
            }
            else if (!value) {
                callback(new Error(this.$t('com.tipNotEmptyX', {obj: this.$t('route.targetCluster')})));
                return;
            }
            callback();
        };
        return {
            vars: [],
            tabValue: '',
            currentCluster: {},
            formData: {
                name: '',
                description: '',
                cluster_name: '',
                expression: '',
                errmsg: ''
            },
            ruleValidate: {
                cluster_name: [
                    {
                        required: true,
                        message: this.$t('com.tipNotEmptyX', {obj: this.$t('route.targetCluster')}),
                        trigger: 'change'
                    }
                ],
                expression: [
                    {
                        required: true,
                        validator: validateExpression,
                        trigger: 'change'
                    }
                ],
            },
            basicFormValidate: {
                cluster_name: [
                    {
                        required: true,
                        validator: validateClusterName,
                        trigger: 'change'
                    }
                ]
            },
            basicForm: {
                host_names: '',
                paths: '',
                cluster_name: '',
                description: ''
            },
            destinationCluster: -1
        };
    },
    methods: {
        onExpressionChanged(expressionData) {
            this.formData.expression = expressionData.expression;
            this.formData.errmsg = expressionData.errmsg;
            this.$refs.formData.validate();
        },
        changeCluster(v) {
            if (v === '2') {
                this.basicForm.cluster_name = 'GO_TO_ADVANCED_RULES';
            }
            else {
                this.basicForm.cluster_name = '';
            }
        },
        handleDefaultSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submit', this.defaultForm);
                }
                else {
                    this.$Message.error({content: this.$t('com.tipValidateError')});
                }
            });
        },
        handleBasicSubmit(name) {
            if (name === 'basicForm') {
                if (this.basicForm.host_names === '' && this.basicForm.paths === '') {
                    this.$Message.error(this.$t('route.tipBasicRule'));
                    return;
                }
            }
             this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.destinationCluster === '2') {
                        this.basicForm.cluster_name = 'GO_TO_ADVANCED_RULES';
                    }
                    this.$emit('submit', this.basicForm);
                }
                else {
                    this.$Message.error({content: this.$t('com.tipValidateError')});
                }
            });
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submit', this.formData);
                }
                else {
                    this.$Message.error({content: this.$t('com.tipValidateError')});
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
    },
};
</script>
<style lang="less" scoped>
.inline{
    margin-left: 20px;
}
</style>
