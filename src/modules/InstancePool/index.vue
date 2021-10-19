<!-- eslint-disable -->
<template>
    <div>
        <Button
            class="add-button"
            type="primary"
            size="small"
            @click="onAdd"
        >
            {{ $t('com.createX', {obj: $t('instancePool.name')}) }}
        </Button>
        <Drawer
            v-model="isVisible"
            :mask-closable="false"
            width="1150"
            :title="isAdd ? $t('com.createX', {obj: $t('instancePool.name')}) :
            $t('com.editX', {obj: $t('instancePool.name')})"
        >
            <createPool
                v-if="isVisible"
                :isAdd="isAdd"
                :currentData="currentData"
                :instancesPoolNames="instancesPoolNames"
                @submit="submitData"
                @cancle="onClose"
            />
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
import createPool from './components/Create.vue';
export default {
    name: 'instancePools',
    components: {
        pageTable,
        createPool
    },
    mounted() {
        this.getPoolList();
    },
    data() {
        const that = this;
        return {
            currentData: {},
            instancesPoolNames: [],
            loading: false,
            isVisible: false,
            isAdd: false,
            tableData: [],
            columns: [
                {
                    title: this.$t('com.nameX', {obj: this.$t('instancePool.name')}),
                    searchable: true,
                    sortable: 'custom',
                    key: 'name'
                },
                {
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
                                        that.onUpdate(params);
                                    }
                                }
                            },
                                that.$t('com.edit')
                            ),
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
                            },
                                that.$t('com.del')
                            )
                        ]
                        );
                    }
                }
            ]
        };
    },
    methods: {
        onAdd() {
            this.isVisible = !this.isVisible;
            this.isAdd = true;
        },
        onUpdate(params) {
            this.isAdd = false;
            this.loading = true;
            this.getProductInstancePoolInfo(params.row.name);
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('com.confirmDelX', {obj: this.$t('instancePool.name')}) + params.row.name + '?',
                onOk: () => {
                    this.onDelInstancePool(params.row.name);
                },
                onCancel: () => {
                    this.$Message.info({content: this.$t('com.tipCancelDel')});
                }
            });
        },
        onClose() {
            this.isVisible = !this.isVisible;
        },
        submitData(data) {
            if (this.isAdd) {
                this.onAddInstancePool(data);
            }
            else {
                this.onUpdatetInstancePool(data);
            }
        },
        getProductInstancePoolInfo(name) {
            let tmpName = name.split('.')[1];
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance_pools/{instance_pool_name}', {
                    instance_pool_name: tmpName
                }),
                method: 'get'
            })
            .then(data => {
                if (data.status === 200) {
                    this.loading = false;
                    this.isVisible = true;
                    this.currentData = data.data.Data;
                }
            });
        },
        onDelInstancePool(name) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance_pools/{instance_pool_name}', {
                    instance_pool_name: name
                }),
                method: 'delete'
            })
            .then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipDelSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                }
            });
        },
        onAddInstancePool(data) {
            data.type = 'product';
            let tmpName = this.$store.getProduct();
            data.name = tmpName.name + '.' + data.name;
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance_pools'),
                method: 'post',
                data: data
            })
            .then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipAddSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                }
            });
        },
        onUpdatetInstancePool(data) {
            let tmpName = this.currentData.name.split('.')[1];
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance_pools/{instance_pool_name}', {
                    instance_pool_name: tmpName
                }),
                method: 'patch',
                data: data
            })
            .then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipEditSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                }
            });
        },
        getPoolList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance_pools'),
                method: 'get'
            })
            .then(data => {
                this.tableData = [];
                if (data.status === 200) {
                    data.data.Data.map(item => {
                        let obj = {};
                        obj.name = item;
                        this.tableData.push(obj);
                    });
                    this.instancesPoolNames = data.data.Data;
                }
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>