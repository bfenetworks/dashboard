<!-- eslint-disable -->
<template>
    <div>
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            label-position="top"
        >
            <FormItem :label="$t('com.nameX', {obj: $t('instancePool.name')})" prop="name">
                <Input
                    v-model="formData.name"
                    :disabled="!isAdd"
                    :placeholder="$t('com.tipRequiredX', {obj: $t('com.nameX', {obj: $t('instancePool.name')})})"
                    class="nameInput"
                >
                    <span v-if="!isProductManager" slot="prepend">BFE.</span>
                </Input>
            </FormItem>
            <FormItem
                :label="$t('instancePool.list')"
                style="width: 100%"
                prop="instances"
            >
                <div class="formBox">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <th>{{ $t('instancePool.machineName') }}</th>
                            <th>ip</th>
                            <th>{{ $t('instancePool.port') }}</th>
                            <th v-show="isProductManager">{{ $t('instancePool.weight') }}</th>
                            <th>{{ $t('com.operation') }}</th>
                        </tr>
                        <tr v-for="(item, ind) in formData.instances" :key="ind">
                            <td>
                                <Input
                                    v-model="item.hostname"
                                    type="text"
                                    :placeholder="$t('com.tipEnterX', {obj: $t('instancePool.machineName')})"
                                />
                            </td>
                            <td>
                                <Input
                                    v-model="item.ip"
                                    type="text"
                                    :placeholder="$t('com.tipEnterX', {obj: 'ip'})"
                                />
                            </td>
                            <td>
                                <div v-for="(info, index) in item.ports" :key="index">
                                    <Input
                                        v-model="index"
                                        class="poolInput"
                                        type="text"
                                        :placeholder="$t('instancePool.portName')"
                                        style="width: 80px"
                                        disabled
                                    />：
                                    <InputNumber
                                        v-model="item.ports.Default"
                                        :max="65535"
                                        :min="1"
                                        class="poolInput"
                                        :placeholder="$t('instancePool.portValue')"
                                        style="width: 80px"
                                        @on-change="handleNumber(item.ports, 'Default')"
                                    ></InputNumber>
                                </div>
                            </td>
                            <td v-show="isProductManager">
                                <InputNumber
                                    v-model="item.weight"
                                    class="InputNumber"
                                    :max="100"
                                    :min="1"
                                    :placeholder="$t('com.tipEnterX', {obj: $t('instancePool.weight')})"
                                    style="width: 80px"
                                    @on-change="handleNumber(item, 'weight')"
                                ></InputNumber>
                            </td>
                            <td>
                                <Button
                                    size="small"
                                    type="error"
                                    :disabled="!deleteAble"
                                    @click="handleRemove(ind)"
                                >{{ $t('com.del') }}</Button>
                            </td>
                        </tr>
                    </table>
                </div>
                <Button
                    plain
                    size="small"
                    type="primary"
                    @click="handleAdd"
                >+ {{ $t('com.create') }}</Button>
            </FormItem>
        </Form>
        <div class="drawer-footer">
            <Button
                size="small"
                type="primary"
                @click="handleSubmit('formData')"
            >{{ $t('com.submit') }}</Button>
            <Button
                size="small"
                class="com-create-btn"
                type="error"
                @click="closeSubmit"
            >{{ $t('com.cancel') }}</Button>
        </div>
        <Spin
            v-if="spinShow"
            size="large"
            fix
        ></Spin>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
    props: {
        isAdd: {
            type: Boolean,
            required: true
        },
        currentData: {
            type: Object,
            default() {
                return {};
            }
        },
        instancesPoolNames: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    watch: {
        currentData: {
            handler(v) {
                if (!this.isAdd) {
                    this.formData = cloneDeep(v);
                    this.formData.name = v.name.split('.')[1];
                    if (this.formData.instances && this.formData.instances.length > 1) {
                        this.deleteAble = true;
                    }
                }
                else {
                    this.formData = {
                        name: '',
                        instances: [
                            {
                                hostname: '',
                                ports: {
                                    Default: 80
                                },
                                tags: {key: 'value'},
                                ip: '',
                                weight: 1
                            }
                        ]
                    };
                }
            },
            immediate: true
        }
    },
    computed: {
        isProductManager() {
            return this.$store.isProductManager();
        }
    },
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipRequiredX', {obj: this.$t('com.nameX',
                {obj: this.$t('instancePool.name')})})));
                return;
            }
            if (this.isAdd && this.instancesPoolNames.indexOf('BFE.' + value) !== -1) {
                callback(new Error(this.$t('com.tipAlreadyExistsX', {obj: this.$t('com.nameX',
                {obj: this.$t('instancePool.name')})})));
                return;
            }
            callback();
        };
        const validateInstances = (rule, value, callback) => {
            if (value.length < 1) {
                callback(
                    new Error(this.$t('cluster.tipAtLeastoneInstance'))
                );
            }
            else {
                callback();
            }
        };
        return {
            spinShow: false,
            deleteAble: false,
            formData: {
                name: '',
                type: '',
                instances: [
                    {
                        hostname: '',
                        ports: {
                            Default: 80
                        },
                        tags: {key: 'value'},
                        ip: '',
                        weight: 1
                    }
                ]
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }
                ],
                instances: [
                    {
                        required: true,
                        validator: validateInstances,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    methods: {
        closeSubmit() {
            this.$emit('cancle', false);
        },
        handleRemove(index) {
            if (this.formData.instances.length === 2) {
                this.deleteAble = false;
            }
            this.formData.instances.splice(index, 1);
        },
        handleAdd() {
            if (this.formData.instances && this.formData.instances.length > 0) {
                this.deleteAble = true;
            }
            else {
                this.formData.instances = [];
            }
            this.formData.instances.push({
                hostname: '',
                ports: {
                    Default: 80
                },
                tags: {key: 'value'},
                ip: '',
                weight: 1
            });
        },
        handleNumber(item, key) {
            this.$nextTick(() => {
                if (item[key] !== null) {
                    this.$set(item, key, parseInt(item[key], 10));
                }
            });
        },
        handleSubmit(name) {
            let tmpData = cloneDeep(this.formData);
            let flag = true;
            if (!tmpData.instances || tmpData.instances.length < 1) {
                this.$Message.warning({
                    content: this.$t('cluster.tipAtLeastoneInstance')
                });
                return;
            }
            tmpData.instances.forEach(ele => {
                if (!ele.hostname) {
                    this.$Message.warning({
                        content: this.$t('com.tipEnterX', {obj: this.$t('instancePool.machineName')})
                    });
                    flag = false;
                }

                if (!ele.ip) {
                    this.$Message.warning({
                        content: this.$t('com.tipEnterX', {obj: 'ip'})
                    });
                    flag = false;
                }

                if (this.isProductManager) {
                    if (ele.weight < 1 || ele.weight > 100) {
                        this.$Modal.error({
                            title: this.$t('com.informationTips'),
                            content: `<p>${this.$t('instancePool.tipWeightRang')}</p>`
                        });
                        flag = false;
                    }
                }
                else {
                    this.$delete(ele, 'weight');
                }

                if (ele.ports.Default < 1 || ele.ports.Default > 65535) {
                    this.$Modal.error({
                        title: this.$t('com.informationTips'),
                        content: `<p>${this.$t('instancePool.tipPortRang')}</p>`
                    });
                    flag = false;
                }
            });
            if (!flag) {
                return;
            }
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submit', tmpData);
                }
                else {
                    this.$Message.error({content: this.$t('com.tipValidateError')});
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.nameInput {
    width: 300px;
}
.formBox {
    display: inline-block;
    width: 100%;
    table {
        margin: 10px 0;
        width: 100%;
        border-right: 1px solid #d9dbe3;
        border-bottom: 1px solid #d9dbe3;
        th {
            border-left: 1px solid #d9dbe3;
            border-top: 1px solid #d9dbe3;
        }
        td {
            padding: 5px 10px;
            border-left: 1px solid #d9dbe3;
            border-top: 1px solid #d9dbe3;
        }
    }
    .poolInput {
        width: 100px;
        display: inline-block;
    }
    .InputNumber {
        width: 100px;
    }
}
</style>
