<!-- eslint-disable -->
<template>
    <div class="newProduct">
        <div class="newProductForm">
            <Form
                ref="formData"
                :model="formData"
                :rules="ruleValidate"
                label-position="top"
            >
                <FormItem :label="$t('com.name')" prop="name">
                    <Input
                        v-model="formData.name"
                        :placeholder="$t('product.tipNameRule')"
                        :disabled="readOnly"
                    />
                </FormItem>
                <FormItem :label="$t('product.introduction')" prop="description">
                    <Input
                        v-model="formData.description"
                        :placeholder="$t('product.tipsIntroductionRule')"
                        :disabled="readOnly"
                    />
                </FormItem>
                <FormItem :label="$t('product.contactPersonEmail')" prop="contact_person_list">
                    <Input
                        v-model="formData.contact_person_list"
                        :placeholder="$t('product.tipsPersonRule')"
                        :disabled="readOnly"
                    />
                </FormItem>
                <FormItem :label="$t('product.teamMailGroup')" prop="mail_list">
                    <Input
                        v-model="formData.mail_list"
                        :placeholder="$t('product.tipMailNotEmpty')"
                        :disabled="readOnly"
                    />
                </FormItem>
                <FormItem :label="$t('product.dutyTelephone')" prop="phone_list">
                    <Input
                        v-model="formData.phone_list"
                        :placeholder="$t('product.tipPhoneNotEmpty')"
                        :disabled="readOnly"
                    />
                </FormItem>
                <FormItem class="btn-box drawer-footer" v-if="!readOnly">
                    <Button @click="$emit('cancel')" class="btn-box-del">
                        {{ $t('com.cancel') }}
                    </Button>
                    <Button type="primary" @click="handleSubmit('formData')">
                        {{ $t('com.create') }}
                    </Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
import {ProductNameRegCheck} from '@/utils/const';
export default {
    props: {
        productName: {
           type: String,
           default: ''
        },
        readOnly: {
           type: Boolean,
           default: false
        },
        productNameList: {
            type: Array,
            required: true
        }
    },
    data() {
        const maxExpiredDate = new Date();
        maxExpiredDate.setMonth(maxExpiredDate.getMonth() + 3);
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipRequiredX', {obj: this.$t('product.name')})));
                return;
            }
            if (this.productNameList.indexOf(value) !== -1) {
                callback(new Error(this.$t('com.tipAlreadyExistsX', {obj: this.$t('product.name')})));
                return;
            }
            if (!ProductNameRegCheck(value)) {
                callback(new Error(this.$t('product.tipNameRule')));
                return;
            }
            callback();
        };
        return {
            formData: {
                name: '',
                description: '',
                contact_person_list: '',
                mail_list: '',
                phone_list: ''
            },
            ruleValidate: {
                name: [
                    {
                        disabled: true,
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    watch: {
        readOnly: {
            handler(v) {
                if (!v) {
                    this.formData = {
                        name: '',
                        description: '',
                        contact_person_list: '',
                        mail_list: '',
                        phone_list: ''
                    };
                }
            },
            deep: true,
            immdate: true,
        }
    },
    mounted() {
        if (this.readOnly) {
            this.getProductInfo(this.productName);
        }
    },
    methods: {
        getProductInfo(v) {
            this.$request({
                url: this.$urlFormat('products/{product_name}', {product_name: v}),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    let obj = data.data.Data;
                    this.formData = {
                        name: obj.name,
                        description: obj.description,
                        contact_person_list: obj.contact_person_list.join(';'),
                        mail_list: obj.mail_list.join(';'),
                        phone_list: obj.phone_list.join(';')
                    };
                }
            });
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let obj = {
                        name: this.formData.name,
                        description: this.formData.description,
                        contact_person_list: this.formData.contact_person_list.split(';'),
                        mail_list: this.formData.contact_person_list.split(';'),
                        phone_list: this.formData.phone_list.split(';')
                    };
                    this.$emit('submitForm', obj);
                }
            });
        },
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
        .btn-box-del {
            margin-left: 8px;
        }
    }
}
</style>
