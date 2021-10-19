<!-- eslint-disable -->
<template>
    <div>
        <pageTable
            ref="Table"
            :columns="columns"
            :tableData="tableData"
            :loading="tableLoading"
        />
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
    export default {
        data() {
            return {
                tableData: [],
                tableLoading: false
            };
        },
        computed: {
            columns() {
                let that = this;
                return [
                    {
                        title: this.$t('com.nameX', {obj: this.$t('subCluster.name')}),
                        key: 'name',
                        sortable: 'custom',
                        searchable: true
                    },
                    {
                        title: this.$t('instancePool.name'),
                        key: 'instance_pool',
                        sortable: 'custom',
                        searchable: true
                    },
                    {
                        title: this.$t('com.desc'),
                        key: 'description',
                        sortable: 'custom',
                        searchable: true
                    },
                    {
                        title: this.$t('com.operation'),
                        key: 'action',
                        render(h, params) {
                            return h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.onDel(params.row);
                                    }
                                }
                            },
                                that.$t('com.del')
                            );
                        }
                    }
                ];
            }
        },
        components: {
            pageTable
        },
        mounted() {
            this.getSubClusters();
        },
        methods: {
            onDel(params) {
                this.$Modal.confirm({
                    title: this.$t('com.tips'),
                    content: this.$t('com.confirmDel') + params.name,
                    loading: true,
                    onOk: () => {
                        this.$request({
                            url: this.$urlFormat('products/{product_name}/sub_clusters/{sub_cluster_name}',
                            {sub_cluster_name: params.name}),
                            method: 'delete'
                        })
                            .then(data => {
                                if (data.status === 200) {
                                    this.$Message.success({content: this.$t('com.tipDelSucc')});
                                    this.tableData = this.tableData.filter(
                                        item => item.name !== data.data.Data.name
                                    );
                                }
                                this.$emit('getTableData', this.tableData);
                            })
                            .finally(() => {
                                this.$Modal.remove();
                            });
                    },
                    onCancel: () => {
                        this.$Message.info({content: this.$t('com.tipCancel')});
                    }
                });
            },
            getSubClusters() {
                this.tableLoading = true;
                this.$request({
                        url: this.$urlFormat('products/{product_name}/sub_clusters'),
                        method: 'get'
                })
                .then(data => {
                    if (data.status === 200) {
                        this.tableData = data.data.Data ? data.data.Data : [];
                        this.$emit('getTableData', this.tableData);
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
            }
        }
    };
</script>
<style lang="less" scoped>
</style>