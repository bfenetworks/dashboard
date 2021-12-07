<!-- eslint-disable -->
<template>
    <div>
        <page-table
            ref="pageTable"
            :tableData="tableData"
            :columns="columns"
            :loading="loading"
        />

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
                    <ul class="clearFloat">
                        <li class="title">Token:</li>
                        <li class="value">{{ info.token }}</li>
                    </ul>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
export default {
    components: {
        pageTable
    },
    mounted() {
        this.getTokenList();
    },
    data() {
        const that = this;
        return {
            loading: false,
            tableData: [],
            columns: [
                {
                    key: 'name',
                    title: this.$t('com.name'),
                    searchable: true,
                    sortable: 'custom',
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    render(h, params) {
                        return h('Button', {
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
                        }, that.$t('com.detail'))
                    }
                }
            ],
            detailsDrawerVisible: false,
            info: {}
        };
    },
    methods: {
        onViewDetails(params) {
            this.info = params.row;
            this.detailsDrawerVisible = true;
        },
        getTokenList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('auth/tokens/actions/search-by-product/{product_name}'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.tableData = data.data.Data ? data.data.Data : [];
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>

<style lang="less" scoped>

</style>