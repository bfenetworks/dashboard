<!-- eslint-disable -->
<template>
    <div>
         <Form
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            label-position="top"
        >
            <FormItem :label="$t('com.nameX', {obj: $t('subCluster.name')})" prop="name">
                <Input v-model="formData.name" :placeholder="$t('com.tipEnterX', {obj: $t('com.nameX',
                {obj: $t('subCluster.name')})})"/>
            </FormItem>
            <FormItem :label="$t('com.desc')" prop="description">
                <Input v-model="formData.description" :placeholder="$t('com.tipEnterX', {obj: $t('com.desc')})"/>
            </FormItem>
            <FormItem :label="$t('instancePool.name')" prop="instance_pool">
                <Select
                    v-model="formData.instance_pool"
                    :placeholder="$t('com.tipSelectX', {obj: $t('instancePool.name')})"
                    style="width: 100%;"
                    filterable
                >
                    <Option
                        v-for="item in instancePoolList"
                        :key="item"
                        :value="item"
                        :label="item"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem class="drawer-footer">
                <Button
                    type="primary"
                    @click="handleSubmit('formData')"
                >{{ $t('com.submit') }}</Button>
                <Button
                    class="reset-btn"
                    @click="handleReset('formData')"
                >{{ $t('com.reset') }}</Button>
            </FormItem>
            <Spin
                v-if="loading"
                size="large"
                fix
            ></Spin>
        </Form>
    </div>
</template>

<script>
import {ClustersNameRegCheck, DescriptionRegCheck} from '@/utils/const';
    export default {
        data() {
            const validateDescription = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('com.desc')})));
                    return;
                }
                if (!DescriptionRegCheck(value)) {
                    callback(new Error(this.$t('com.tipLengthX', {len: 2})));
                    return;
                }
                callback();
            };
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('com.tipEnterX', {obj: this.
                    $t('com.nameX', {obj: this.$t('subCluster.name')})})));
                    return;
                }
                if (this.subClustersNames.indexOf(value) !== -1) {
                    callback(new Error(this.$t('com.tipAlreadyExistsX', {obj: this.$t('subCluster.name')})));
                    return;
                }
                if (!ClustersNameRegCheck(value)) {
                    callback(
                        new Error(this.$t('subCluster.tipNameRule'))
                    );
                    return;
                }
                callback();
            };
            return {
                formData: {
                    name: '',
                    instance_pool: '',
                    description: ''
                },
                ruleValidate: {
                    name: [
                        {
                            required: true,
                            validator: validateName,
                            trigger: 'change'
                        }
                    ],
                    instance_pool: [{required: true, message: this.
                    $t('com.tipSelectX', {obj: this.$t('instancePool.name')}), trigger: 'change'}],
                    description: [{required: true, validator: validateDescription, trigger: 'change'}]
                },
                loading: false,
                subClustersNames: [],
                instancePoolList: []
            };
        },
        props: {
            tableData: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        watch: {
            tableData: {
                handler(v) {
                    if (v) {
                        this.subClustersNames = v.map(item => {
                            return item.name;
                        });
                    }
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
           this.getInstancePool();
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.$emit('submit', this.formData);
                    }
                    else {
                        this.$Message.error({
                            content: this.$t('com.tipValidateError')
                        });
                    }
                });
            },
            getInstancePool() {
                this.loading = true;
                this.$request({
                    url: this.$urlFormat('products/{product_name}/instance_pools'),
                    method: 'get'
                }).then((data) => {
                    this.loading = false;
                    if (data.status === 200) {
                        this.instancePoolList = data.data.Data ? data.data.Data : [];
                    }
                });
            },
            handleReset() {
                this.formData = {
                    description: '',
                    instance_pool: '',
                    name: ''
                };
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>