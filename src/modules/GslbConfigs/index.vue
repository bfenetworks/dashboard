<!-- eslint-disable -->
<template>
    <div>
        <Drawer v-model="drawerVisible" :title="$t('gslb.name')" width="70" :mask-closable="false">
            <Scheduler v-if="drawerVisible"
                :reportFlag="repeatSchedulerFlag"
                :scheduler="editingSchedulerConfig"
                @submitData="acceptDataHandler"
            />
            <div class="com-btn-box drawer-footer">
                <Button
                    v-show="drawerVisible"
                    size="small"
                    type="primary"
                    @click="onSubmitBtnClick"
                >{{ $t('com.submit') }}</Button>
            </div>
        </Drawer>
        <page-table :tableData="tableData" :columns="columns" ref="pageTable" :loading="loading" />
    </div>
</template>


<script>
import pageTable from '@/components/table/pageTable';
import Scheduler from '../Clusters/components/Scheduler.vue';
export default {
    components: {
        'page-table': pageTable,
        Scheduler
    },
    mounted() {
        this.getGslbConfigsList();
    },
    data() {
        const that = this;
        return {
            loading: false,

            drawerVisible: false,
            editingSchedulerConfig: {},

            repeatSchedulerFlag: false,
            gslbInfoName: '',
            tableData: [],
            columns: [
                {
                    key: 'name',
                    title: this.$t('com.nameX', {obj: this.$t('cluster.name')}),
                    searchable: true,
                    sortable: 'custom',
                },
                {
                    key: 'description',
                    title: this.$t('com.desc'),
                },
                {
                    key: 'scheduler',
                    title: this.$t('gslb.type'),
                    sortable: 'custom',
                    render(h, params) {
                        return (
                            <div>
                               { that.$t('cluster.manual') }
                            </div>
                        );
                    }
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
                            on: {
                                click: () => {
                                    that.onDetailBtnClick(params);
                                }
                            }
                        }, that.$t('gslb.config'));
                    }
                }
            ],
        };
    },
    methods: {
        submit() {
            this.getGslbConfigsList();
            this.drawerVisible = !this.drawerVisible;
        },
        getGslbConfigsList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/clusters'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.tableData = data.data.Data;
                }
            }).finally(() => {
                    this.loading = false;
            });
        },
        onDetailBtnClick(params) {
            this.editingSchedulerConfig = params.row.scheduler;
            this.gslbInfoName = params.row.name;
            this.drawerVisible = true;
        },
        onSubmitBtnClick() {
            this.repeatSchedulerFlag = !this.repeatSchedulerFlag;
        },
        acceptDataHandler(data) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/clusters/{cluster_name}/scheduler',
                {cluster_name: this.gslbInfoName}),
                method: 'patch',
                data: data.data
            }).then(data => {
                if (data.status === 200) {
                    this.drawerVisible = false;
                    this.$Message.success({content: this.$t('com.tipSubmitSucc')});
                    this.getGslbConfigsList();
                }
            });
        }
    }
};
</script>