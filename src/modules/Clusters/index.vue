<!-- eslint-disable -->
<template>
    <div class="clusters">
        <Button
            type="primary"
            size="small"
            @click="onAdd"
        >{{ $t('com.createX', {obj: $t('cluster.name')}) }}</Button>
        <pageTable
            :tableData="tableData"
            :columns="columns"
            :loading="tableLoading"
        />

        <Drawer
            :title="isAdd ? $t('com.createX',
            {obj: $t('cluster.name')}) : $t('com.editX', {obj: $t('cluster.name')})"
            v-model="upsertVisible"
            :mask-closable="false"
            width="80"
        >
            <Upsert
                v-if='upsertVisible'
                :currentCluster="currentCluster"
                :clusterNames="clusterNames"
                :subClusterProductList="subClusterProductList"
                :mountedSubCluster="mountedSubCluster"
                :isAdd="isAdd"
                @submit="upsertSubmit"
            />
        </Drawer>

        <Drawer
            :title="$t('com.detail')"
            v-model="infoVisible"
            width="80"
        >
            <Review
                :showFooter="false"
                :baseConfigData="baseConfigData"
                :subClustersData="subClustersData"
                :passiveHealthData="passiveHealthData"
                :schedulerConfig="schedulerConfig"
                :subClusterProductList="subClusterProductList"
            />
        </Drawer>
    </div>
</template>
<script>
import pageTable from '@/components/table/pageTable';
import Upsert from './components';
import Review from './components/Review';
import {cloneDeep} from 'lodash';
export default {
    name: 'Clusters',

    components: {
        pageTable,
        Upsert,
        Review
    },

    computed: {
        columns() {
            const that = this;
            return [
                {
                    title: this.$t('com.name'),
                    key: 'name',
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: this.$t('com.desc'),
                    key: 'description'
                },
                {
                    title: this.$t('com.operation'),
                    key: 'action',
                    render(h, params) {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        that.onEdit(params.row);
                                    }
                                }
                            }, that.$t('com.edit')),
                            h('Button', {
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
                            }, that.$t('com.del')),
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.onDetails(params);
                                    }
                                }
                            }, that.$t('com.detail'))
                        ]);
                    }
                }
            ];
        }
    },

    mounted() {
        this.getClusters();
        this.getSubClusters();
    },

    data() {
        return {
            tableLoading: false,
            upsertVisible: false,
            infoVisible: false,
            tableData: [],
            isAdd: false,
            currentCluster: {},
            clusterNames: [],
            baseConfigData: {},
            passiveHealthData: {},
            subClustersData: [],
            schedulerConfig: {},
            subClusterProductList: [],
            mountedSubCluster: []
        };
    },

    methods: {
        getSubClusters() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/sub_clusters'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.subClusterProductList = data.data.Data ? data.data.Data : [];
                }
            });
        },
        getClusters() {
            this.tableLoading = true;
            this.$request(
                {
                    url: this.$urlFormat('products/{product_name}/clusters'),
                    method: 'get'
                })
                .then(data => {
                    if (data.status === 200) {
                        this.tableData = data.data.Data;
                        this.clusterNames = [];
                        this.mountedSubCluster = [];
                        if (this.tableData && this.tableData.length > 0) {
                            this.tableData.forEach(item => {
                                this.clusterNames.push(item.name);
                                if (item.sub_clusters && item.sub_clusters.length > 0) {
                                    this.mountedSubCluster = this.mountedSubCluster.concat(item.sub_clusters);
                                }
                            });
                        }
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        onAdd() {
            this.currentCluster = {};
            this.isAdd = true;
            this.upsertVisible = true;
        },
        onEdit(row) {
            this.currentCluster = row;
            this.isAdd = false;
            this.upsertVisible = true;
        },
        onDetails(data) {
            const tmpData = cloneDeep(data.row);
            this.baseConfigData = {
                name: tmpData.name,
                description: tmpData.description,
                connection: tmpData.basic.connection,
                buffers: tmpData.basic.buffers,
                retries: tmpData.basic.retries,
                timeouts: tmpData.basic.timeouts,
                sticky_sessions: tmpData.sticky_sessions
            },
            this.baseConfigData.connection.cancel_on_client_close = tmpData.
            basic.connection.cancel_on_client_close + '';
            this.passiveHealthData = tmpData.passive_health_check;
            this.subClustersData = tmpData.sub_clusters ? tmpData.sub_clusters : [];
            this.schedulerConfig = {
                scheduler: tmpData.scheduler,
                manual_scheduler: tmpData.manual_scheduler
            };
            this.infoVisible = true;
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('com.confirmDel') + params.row.name,
                loading: true,
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('products/{product_name}/clusters/{cluster_name}',
                        {cluster_name: params.row.name}),
                        method: 'delete'
                    })
                        .then(data => {
                            if (data.status === 200) {
                                this.getClusters();
                                this.getSubClusters();
                                this.tableData.splice(params.index, 1);
                                this.$Message.success({
                                    content: this.$t('com.tipDelSucc')
                                });
                            }
                        })
                        .finally(() => {
                            this.$Modal.remove();
                        });
                }
            });
        },
        upsertSubmit() {
            this.getClusters();
            this.getSubClusters();
            this.upsertVisible = false;
        }
    }
};
</script>
