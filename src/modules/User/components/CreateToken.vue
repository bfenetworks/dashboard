<template>
    <div>
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            label-position="top"
        >
            <FormItem :label="$t('com.name')" prop="name">
                <Input
                    v-model="formData.name"
                    type="text"
                    :placeholder="$t('com.tipEnterX', {obj: $t('com.name')})"
                    class="com-create-input"
                />
            </FormItem>
            <FormItem :label="$t('user.role')" prop="scope">
                <RadioGroup v-model="formData.scope">
                    <Radio label="System">System</Radio>
                    <Radio label="Product">Product</Radio>
                    <Radio label="Support">Support</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem
                v-if="formData.scope === 'Product'"
                :label="$t('product.name')"
                prop="product_name"
            >
                <Select v-model="formData.product_name">
                    <Option
                        v-for="item in productList"
                        :value="item.name"
                        :key="item.name"
                    >
                    {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem class="drawer-footer">
                <Button
                    size="small"
                    type="primary"
                    @click="onSubmit('formData')"
                >
                    {{ $t('com.submit') }}
                </Button>
                <Button
                    size="small"
                    @click="handleReset('formData')"
                >
                    {{ $t('com.reset') }}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        props: {
            productList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('com.userName')})));
                    return;
                }
                callback();
            };
            return {
                formData: {
                    name: '',
                    scope: '',
                    product_name: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    scope: [
                        {
                            required: true,
                            message: this.$t('com.tipSelectX', {obj: this.$t('user.role')}),
                            trigger: 'change'
                        }
                    ],
                    product_name: [
                        { required: true, message: this.$t('com.tipSelectX', {obj: this.$t('product.name')}),
                        trigger: 'change' }
                    ]
                },
            };
        },
        methods: {
            onSubmit(name) {
                if (this.formData.scope !== 'Product') {
                    this.$delete(this.formData, 'product_name');
                    this.$delete(this.ruleValidate, 'product_name');
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('submitData', this.formData);
                    }
                });
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>