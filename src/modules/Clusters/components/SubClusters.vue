<!-- eslint-disable -->
<template>
    <div>
        <div class="upsert-subClusters">
            <div class="subClusters-child">
                <h4 class="title">{{ $t('cluster.subClusterPool') }}</h4>
                <pageTable
                    :columns="columnsAll"
                    :tableData="subClustersAllList"
                    :loading="clustersLoading"
                />
            </div>
            <div class="subClusters-child">
                <h4 class="title">{{ $t('cluster.subClusterMounted') }}</h4>
                <pageTable
                    :columns="columnsUsed"
                    :tableData="subClustersUsed"
                    :loading="clustersLoading"
                />
            </div>
        </div>
    </div>
</template>
<script>
import pageTable from '@/components/table/pageTable';
import {cloneDeep} from 'lodash';
export default {
    name: 'upsert-SubClusters',

    components: {pageTable},

    props: {
        subClustersData: {
            type: Array,
            default() {
                return [];
            }
        },
        reportFlag: {
            type: Boolean
        },
        subClusterProductList: {
            type: Array,
            default() {
                return [];
            }
        },
        mountedSubCluster: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    watch: {
        mountedSubCluster: {
            handler(data) {
                if (data) {
                    this.currentUsedSubCluters = cloneDeep(data);
                }
            },
            deep: true,
            immediate: true
        },
        subClustersData: {
            handler(data) {
                if (data) {
                    this.subClustersUsed = [];
                    this.subClustersAllList.map(item => {
                        if (data.indexOf(item.name) !== -1) {
                            this.subClustersUsed.push(item);
                        }
                    });
                }
            },
            deep: true,
            immediate: true
        },

        reportFlag: {
            handler(v) {
                this.handleSubmit();
            }
        },
        subClusterProductList: {
            handler(v) {
                this.subClustersAllList = cloneDeep(v);
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        const that = this;
        const columns = [
            {
                title: this.$t('subCluster.name'),
                key: 'name'
            },
            {
                title: this.$t('instancePool.name'),
                key: 'instance_pool'
            }
        ];
        return {
            currentUsedSubCluters: [],
            subClustersAllList: [],
            subClustersUsed: [],
            clustersLoading: false,
            columnsAll: [
                ...columns,
                {
                    title: this.$t('com.state'),
                    key: 'instance_pool',
                    render(h, params) {
                        return (<span>{ that.getSubClusterState(params.row) }</span>);
                    }
                },
                {
                    title: this.$t('com.operation'),
                    key: 'action',
                    render(h, params) {
                        return h('Button', {
                            props: {
                                type: 'success',
                                size: 'small',
                                disabled: that.getDisabled(params.row)
                            },
                            on: {
                                click: () => {
                                    that.subClustersUsed.push(params.row);
                                    that.currentUsedSubCluters.push(params.row.name);
                                }
                            },
                        },
                            that.$t('cluster.mount')
                        );
                    }
                }
            ],
            columnsUsed: [
                ...columns,
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
                                    that.subClustersUsed.splice(params.row._index, 1);
                                    let index = that.currentUsedSubCluters.indexOf(params.row.name);
                                    that.currentUsedSubCluters.splice(index, 1);
                                }
                            },
                        },
                            that.$t('cluster.unmount')
                        );
                    }
                }
            ]
        };
    },

    methods: {
        getDisabled(params) {
            if (!params.ready || this.
            currentUsedSubCluters.indexOf(params.name) !== -1) {
                return true;
            }
            return false;
        },
        getSubClusterState(params) {
            if (this.currentUsedSubCluters.indexOf(params.name) !== -1) {
                return this.$t('cluster.mounted');
            }
            if (!params.ready) {
                return this.$t('com.notEffective');
            }
            return this.$t('cluster.available');
        },
        handleSubmit() {
            if (this.subClustersUsed.length < 1) {
                this.$Message.info({
                    content: this.$t('cluster.tipSubClusterMounted')
                });
                return;
            }
            let tmpList = [];
            tmpList = this.subClustersUsed.map(item => {
                return item.name;
            });
            this.$emit('submitData', {
                topic: 'subClustersData',
                data: tmpList
            });
        }
    }
};
</script>
<style lang="less" scoped>
.upsert-subClusters {
    display: flex;
    margin-bottom: 15px;
    .subClusters-child {
        flex-grow: 5;
        width: 0;
        .title {
            font-size: 18px;
            padding: 5px 0;
        }
    }
    .subClusters-child + .subClusters-child {
        margin-left: 30px;
        flex-grow: 4;
    }
}
</style>
