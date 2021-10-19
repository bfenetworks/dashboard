<!-- eslint-disable -->
<template>
    <div class="bfeCluster">
        <Button type="primary" size="small" @click="onAdd">{{
            $t('com.createX', { obj: $t('cluster.BFE') })
        }}</Button>

        <Drawer v-model="isHiden" :title="$t('com.createX', { obj: $t('cluster.BFE') })" width="60">
            <created
                v-if="isHiden"
                :instancePoolList="instancePoolList"
                :bfeClusterNames="bfeClusterNames"
                @submitForm="submitForm"
            />
            <Spin v-if="spinShow" size="large" fix></Spin>
        </Drawer>
        <pageTable :tableData="tableData" :columns="columns" :loading="tableLoading" />
    </div>
</template>
<script>
import pageTable from '@/components/table/pageTable';
import created from './components/Created.vue';
export default {
    name: 'BfeClusters',

    components: {
        pageTable,
        created
    },
    mounted() {
        this.getBfeList();
        this.getInstancePoolList();
    },

    data() {
        const that = this;
        return {
            bfeClusterNames: [],
            instancePoolList: [],
            isHiden: false,
            tableData: [],
            tableLoading: false,
            spinShow: false,
            columns: [
                {
                    title: this.$t('com.nameX', {obj: this.$t('cluster.name')}),
                    key: 'name',
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: this.$t('bfeClusters.clusterInstancePool'),
                    key: 'pool',
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: this.$t('com.operation'),
                    key: 'action',
                    render(h, params) {
                        return h(
                            'Button',
                            {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.onDel(params);
                                    }
                                }
                            },
                            that.$t('com.del')
                        );
                    }
                }
            ]
        };
    },
    methods: {
        submitForm(data) {
            this.spinShow = true;
            this.$request({
                url: 'bfe-clusters',
                method: 'post',
                data: data
            })
                .then(data => {
                    if (data.status === 200) {
                        this.$Message.success({
                            content: this.$t('com.tipAddSucc')
                        });
                        this.isHiden = false;
                        this.getBfeList();
                    }
                })
                .finally(() => {
                    this.spinShow = false;
                });
        },
        getBfeList() {
            this.tableLoading = true;
            this.$request({
                url: 'bfe-clusters',
                method: 'get'
            })
                .then(data => {
                    if (data.status === 200) {
                        this.tableData = data.data.Data;
                        this.bfeClusterNames = this.tableData.map(item => {
                            return item.name;
                        });
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        onAdd() {
            this.isHiden = true;
        },
        getInstancePoolList() {
            this.$request({
                url: 'bfe-pools',
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.instancePoolList = data.data.Data;
                }
            });
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.tips'),
                content: this.$t('com.confirmDel') + `${params.row.name}`,
                loading: true,
                onOk: () => {
                    this.$Modal.remove();
                    this.$request({
                        url: this.$urlFormat('bfe-clusters/{name}', { name: params.row.name }),
                        method: 'delete'
                    }).then(data => {
                        if (data.status === 200) {
                            this.$Message.success({
                                content: this.$t('com.tipDelSucc')
                            });
                            this.getBfeList();
                        }
                    });
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.selectBox {
    border: 1px solid #d9dbe3;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    position: relative;
    padding-left: 15px;
    i {
        float: right;
        display: block;
        height: 30px;
        line-height: 30px;
        width: 20px;
    }
    p {
        float: left;
        height: 30px;
        line-height: 30px;
    }
}
.com-btn-box {
    button {
        float: right;
    }
    .btnBox-btn {
        margin-right: 8px;
    }
}
</style>
