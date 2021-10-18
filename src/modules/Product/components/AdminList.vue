<!-- eslint-disable -->
<template>
    <div>
        <Button type="primary" size="small" @click="onAdd">
            {{ $t('com.createX', { obj: $t('product.productLine') }) }}
        </Button>
        <PageTable
            :tableData="tableData"
            :columns="columns"
            :loading="tableLoading"
            ref="PageTable"
        />
        <Drawer
            v-model="isHiden"
            :readOnly="
                readOnly
                    ? $t('com.seeX', { obj: $t('product.productLine') })
                    : $t('com.createX', { obj: $t('product.productLine') })
            "
            width="50"
            :mask-closable="false"
        >
            <AdminUpsert
                v-if="isHiden"
                :productName="productName"
                :readOnly="readOnly"
                :productNameList="productNameList"
                @submitForm="submitForm"
                @cancel="isHiden = false"
            />
        </Drawer>
    </div>
</template>
<script>
import PageTable from '@/components/table/pageTable';
import AdminUpsert from './AdminUpsert';
export default {
    name: 'admin-product',
    components: {
        PageTable,
        AdminUpsert
    },
    data() {
        const that = this;
        return {
            productNameList: [],
            productName: '',
            readOnly: false,
            isHiden: false,
            tableLoading: false,
            tableData: [],
            columns: [
                {
                    key: 'name',
                    title: this.$t('com.name'),
                    searchable: true,
                    sortable: 'custom'
                },
                {
                    key: 'description',
                    title: this.$t('product.introduction'),
                    searchable: true,
                    sortable: 'custom'
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    render(h, params) {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            that.onView(params);
                                        }
                                    }
                                },
                                that.$t('com.see')
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            that.onDel(params);
                                        }
                                    }
                                },
                                that.$t('com.del')
                            )
                        ]);
                    }
                }
            ]
        };
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        submitForm(v) {
            this.$request({
                url: 'products',
                method: 'post',
                data: v
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipAddSucc')
                    });
                    this.getProducts();
                }
            });
        },
        getProducts() {
            this.tableLoading = true;
            this.isHiden = false;
            this.$request({
                url: 'products',
                method: 'get'
            })
                .then(data => {
                    if (data.status === 200) {
                        this.queryListData(data.data.Data);
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        queryListData(v) {
            if (v) {
                this.tableData = v;
                this.tableData.forEach(item => {
                    item.name = item.name;
                });
                this.productNameList = this.tableData.map(item => {
                    return item.name;
                });
            }
        },
        onDel(params) {
            this.productName = params.row.name;
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('product.delMessage'),
                onOk: () => {
                    this.tableLoading = true;
                    this.$request({
                        url: this.$urlFormat('products/{product_name}', {
                            product_name: this.productName
                        }),
                        method: 'delete'
                    })
                        .then(data => {
                            if (data.status === 200) {
                                this.$Message.success({
                                    content: this.$t('com.tipDelSucc')
                                });
                                this.tableData = this.tableData.filter(
                                    item => item.name !== params.row.name
                                );
                            }
                        })
                        .finally(() => {
                            this.tableLoading = false;
                        });
                },
                onCancel: () => {
                    this.$Message.info({
                        content: this.$t('com.tipCancelDel')
                    });
                }
            });
        },
        onView(params) {
            this.isHiden = true;
            this.productName = params.row.name;
            this.readOnly = true;
        },
        onAdd() {
            this.isHiden = true;
            this.readOnly = false;
        }
    }
};
</script>
