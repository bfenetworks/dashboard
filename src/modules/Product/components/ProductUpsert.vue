<!-- eslint-disable -->
<template>
    <div class="newProduct">
        <Button
            class="add-button"
            type="primary"
            @click="changeProductInfo()"
            size="small"
        >{{ $t('com.edit') }}</Button>
        <div class="newProductForm">
            <Form
                ref="productInfo"
                :model="productInfo"
                :rules="ruleValidate"
                label-position="top"
            >
                <FormItem :label="$t('product.name')" prop="name">
                    <Input
                        v-model="productInfo.name"
                        disabled
                        :placeholder="$t('product.tipNameRule')"
                    />
                </FormItem>
                <FormItem :label="$t('product.introduction')" prop="description">
                    <Input
                        v-model="productInfo.description"
                        :disabled="statu"
                        :placeholder="$t('product.tipsIntroductionRule')"
                    />
                </FormItem>
                <FormItem :label="$t('product.contactPersonEmail')" prop="contact_person_list">
                    <Input
                        v-model="productInfo.contact_person_list"
                        :disabled="statu"
                        :placeholder="$t('product.tipsPersonRule')"
                    />
                </FormItem>
                <FormItem :label="$t('product.teamMailGroup')" prop="mail_list">
                    <Input
                        v-model="productInfo.mail_list"
                        :disabled="statu"
                        :placeholder="$t('product.tipMailNotEmpty')"
                    />
                </FormItem>
                <FormItem :label="$t('product.dutyTelephone')" prop="phone_list">
                    <Input
                        v-model="productInfo.phone_list"
                        :disabled="statu"
                        :placeholder="$t('product.tipPhoneNotEmpty')"
                    />
                </FormItem>
                <FormItem class="btn-box" v-if="!statu">
                    <Button @click="onReset('productInfo')" class="del_btn">{{ $t('com.cancel') }}</Button>
                    <Button type="primary" @click="submitForm('productInfo')">{{ $t('com.save') }}</Button>
                </FormItem>
            </Form>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
import { ProductNameRegCheck } from '@/utils/const';
export default {
    mounted() {
        if (this.$route.query.role === this.$ProductRole) {
            this.getProductInfo();
        }
    },
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipRequiredX', {obj: this.$t('product.name')})));
            } else if (!ProductNameRegCheck(value)) {
                callback(new Error(this.$t('product.tipNameRule')));
            } else {
                callback();
            }
        };
        return {
            spinShow: false,
            productInfo: {},
            statu: true,
            ruleValidate: {
                name: [
                    {
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        getProductInfo() {
            this.spinShow = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    let obj = data.data.Data;
                    this.productInfo = {
                        name: obj.name,
                        description: obj.description,
                        contact_person_list: obj.contact_person_list.join(';'),
                        mail_list: obj.mail_list.join(';'),
                        phone_list: obj.phone_list.join(';')
                    };
                }
            }).finally(() => {
                this.spinShow = false;
            });
        },
        changeProductInfo() {
            this.statu = !this.statu;
        },
        submitForm(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let obj = {
                        name: this.productInfo.name,
                        description: this.productInfo.description,
                        contact_person_list: this.productInfo.contact_person_list.split(';'),
                        mail_list: this.productInfo.contact_person_list.split(';'),
                        phone_list: this.productInfo.phone_list.split(';')
                    };
                    this.spinShow = true;
                    this.$request({
                        url: this.$urlFormat('products/{product_name}'),
                        method: 'patch',
                        data: obj
                    }).then(data => {
                        if (data.status === 200) {
                            this.getProductInfo();
                            this.$Message.success({
                                content: this.$t('com.tipEditSuccX', {obj: this.$t('product.productLine')})
                            });
                            this.statu = !this.statu;
                        }
                    }).finally(() => {
                        this.spinShow = false;
                    });
                }
           });
        },
        onReset(name) {
            this.$refs.productInfo.resetFields();
            this.getProductInfo();
            this.statu = !this.statu;
        }
    }
};
</script>

<style lang="less" scoped>
.newProduct {
    .newProductTitle {
        border-bottom: 1px solid #f4f4f4;
        height: 40px;
        line-height: 40px;
    }
    .newProductForm {
        padding: 10px;
    }
    .btn-box {
        button {
            float: right;
        }
        .del_btn {
            margin-left: 8px;
        }
    }
}
</style>
