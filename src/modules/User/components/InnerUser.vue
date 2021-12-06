<!-- eslint-disable -->
<template>
    <div>
        <Button class="add-button" type="primary" size="small" @click="onAdd">{{
            $t('com.establish')
        }}</Button>

        <Alert show-icon>{{ $t('user.tipInnerUserDel') }}</Alert>

        <Drawer
            v-model="hidden"
            width="30"
            :mask-closable="false"
        >
            <CreateToken
                v-if="hidden"
                :productList="productList"
                @submitData="submitData"
            />
        </Drawer>
        
        <Drawer
            v-model="detailsDrawerVisible"
            width="40"
            :title="$t('com.detail')"
            placement="right"
            :mask-closable="false"
        >
            <div class="panel">
                <div class="panel-body">
                    <ul class="clearFloat">
                        <li class="title">{{ $t('com.name') }}:</li>
                        <li class="value">{{ info.name }}</li>
                    </ul>
                    <ul class="clearFloat">
                        <li class="title">Scope:</li>
                        <li class="value">
                            {{ info.scope === 'System' ? $t('user.system') :
                            info.scope === 'Product' ? $t('user.product') : $t('user.support') }}
                        </li>
                    </ul>
                    <ul v-show="info.scope === 'Product'" class="clearFloat">
                        <li class="title">{{ $t('product.name') }}:</li>
                        <li class="value">{{ info.product_name }}</li>
                    </ul>
                    <ul class="clearFloat">
                        <li class="title">Token:</li>
                        <li class="value">{{ info.token }}</li>
                    </ul>
                </div>
            </div>
        </Drawer>
        <pageTable
            ref="pageTable"
            :tableData="tableData"
            :columns="columns"
            :loading="loading"
        />
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
import CreateToken from './CreateToken.vue';
export default {
    components: {
        pageTable,
        CreateToken
    },
    mounted() {
        this.getTokenList();
        this.getProductList();
    },
    data() {
        const that = this;
        return {
            tableData: [],
            columns: [
                {
                    key: 'name',
                    title: this.$t('com.name'),
                },
                {
                    key: 'scope',
                    title: 'scope',
                    render(h, params) {
                        return <p>
                            { params.row.scope === 'System' ? that.$t('user.system') :
                            params.row.scope === 'Product' ? that.$t('user.product') : that.$t('user.support')}
                        </p>
                    }
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    render(h, params) {
                        return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            that.onViewDetails(params);
                                        }
                                    }
                                }, that.$t('com.detail')),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                           that.onDel(params);
                                        }
                                    }
                                }, that.$t('com.del')),
                            ]
                        );
                    }
                }
            ],
            loading: false,
            hidden: false,
            productList: [],
            info: {},
            detailsDrawerVisible: false
        };
    },
    methods: {
        onViewDetails(params) {
            this.$request(
                {
                    url: this.$urlFormat('auth/tokens/{token_name}', {
                            token_name: params.row.name
                        }),
                    method: 'get'
                }
            )
            .then((data) => {
                if (data.status === 200) {
                    this.info = data.data.Data;
                    this.detailsDrawerVisible = true;
                }
            })
            .finally(() => {
            });
        },
        getProductList() {
            this.$request(
                {
                    url: 'products',
                    method: 'get'
                }
            )
            .then((data) => {
                if (data.status === 200) {
                    this.productList = data.data.Data;
                }
            })
            .finally(() => {
            });
        },
        submitData(data) {
            this.$request({
                url: 'auth/tokens',
                method: 'post',
                data: data
            }).then(data => {
                this.loading = false;
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipEstablishSucc')
                    });
                    this.hidden = false;
                    this.getTokenList();
                }
            });
        },
        getTokenList() {
            this.loading = true;
            this.$request({
                url: 'auth/tokens',
                method: 'get'
            }).then(data => {
                this.loading = false;
                if (data.status === 200) {
                    if (data.data.Data) {
                        this.tableData = data.data.Data;
                    }
                }
            });
        },
        onAdd() {
            this.hidden = true;
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('com.confirmDel') + params.row.name + '?',
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('auth/tokens/{token_name}', {
                            token_name: params.row.name
                        }),
                        method: 'delete'
                    }).then(data => {
                        if (data.status === 200) {
                            this.$Message.success({
                                content: this.$t('com.tipDelSucc')
                            });
                            this.getTokenList();
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>