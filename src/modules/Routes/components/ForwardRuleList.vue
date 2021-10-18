<!-- eslint-disable -->
<template>
    <div class="forwardRule">
        <pageTable
            :tableData="tableList"
            :columns="columns"
            :draggable="draggable"
            @dragDrop="dragDrop"
        />
    </div>
</template>
<script>
import pageTable from '@/components/table/pageTable';
import {cloneDeep} from 'lodash';
export default {
    name: 'forwardRule',

    props: {
        rulesData: {
            type: Object,
            required: true
        },
        rulesValue: {
            type: String,
            required: true
        },
        tableData: {
            type: Array,
            required: true
        },
        clustersData: {
            type: Array,
            required: true
        }
    },
    components: {
        pageTable
    },
    data() {
        return {
            columns: [],
            tableList: [],
            dragging: null,
            dragIndex: -1,
            forwardingRulesData: [],
            draggable: false
        };
    },
    computed: {
        basicColumns() {
            const that = this;
            return [
                {
                    title: this.$t('route.hostName'),
                    key: 'host_names',
                    searchable: true,
                    sortable: 'custom',
                    render(h, params) {
                        return h('div', [
                            params.row.host_names ? params.row.host_names.map(item => {
                                return <p class="expression_txt">{item}</p>;
                            }) : ''
                        ]);
                    }
                },
                {
                    title: this.$t('route.path'),
                    key: 'paths',
                    searchable: true,
                    sortable: 'custom',
                    render(h, params) {
                        return (
                            <div>
                               {params.row.paths.join(',')}
                            </div>
                        );
                    }
                },
                {
                    title: this.$t('route.targetCluster'),
                    key: 'cluster_name',
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        return (
                            <div>
                                { params.row.cluster_name === 'GO_TO_ADVANCED_RULES'
                                    ? that.$t('route.tipAdvanceMate') : params.row.cluster_name }
                            </div>
                        );
                    }
                },
                {
                    title: this.$t('com.desc'),
                    key: 'description',
                    searchable: true,
                    sortable: 'custom'
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
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        that.$emit('updateForwardRule', params.row);
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
                                        that.$Modal.confirm({
                                            title: that.$t('com.tips'),
                                            content: that.$t('route.tipDel'),
                                            onOk: () => {
                                                that.$emit('del', params.row._index);
                                            },
                                            onCancel: () => {
                                                that.$Message.info({content: that.$t('com.tipCancelDel')});
                                            }
                                        });
                                    }
                                }
                            },
                                that.$t('com.del')
                            )
                        ]
                        );
                    }
                }
            ];
        },
        advancedColumns() {
            const that = this;
            return [
                {
                    title: this.$t('route.expression'),
                    key: 'expression',
                    searchable: true
                },
                {
                    title: this.$t('route.targetCluster'),
                    key: 'cluster_name',
                    searchable: true
                },
                {
                    title: this.$t('com.desc'),
                    key: 'description',
                    searchable: true
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
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        that.$emit('updateForwardRule', params.row);
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
                                        that.$Modal.confirm({
                                            title: that.$t('com.tips'),
                                            content: that.$t('route.tipDel'),
                                            onOk: () => {
                                                that.$emit('del', params.row._index);
                                            },
                                            onCancel: () => {
                                                that.$Message.info({content: that.$t('com.tipCancelDel')});
                                            }
                                        });
                                    }
                                }
                            },
                                that.$t('com.del')
                            )
                        ]
                        );
                    }
                }
            ];
        },
        defaultColumns() {
            const that = this;
            return [
                {
                    title: this.$t('route.targetCluster'),
                    key: 'cluster_name',
                    render(h, params) {
                        return h('div', [
                            h('Select', {
                            props: {
                                value: params.row.cluster_name,
                                transfer: true
                            },
                            style: {
                                width: '80%'
                            },
                            on: {
                                'on-change': value => {
                                    that.$emit('getDefaultClusterName', value);
                                }
                            }
                        },
                        that.clustersData.map(item => {
                            return h('Option', {
                                props: {
                                    value: item.name
                                }
                            }, item.name);
                        })
                        )
                        ]);
                    }
                },
                {
                    title: this.$t('com.desc'),
                    key: 'description'
                }
            ];
        }
    },
    watch: {
        rulesData: {
            handler(data) {
                this.forwardingRulesData = cloneDeep(data);
            },
            deep: true,
            immediate: true
        },
        rulesValue: {
            handler(data) {
               this.changeTabs(data);
            },
            deep: true,
            immediate: true
        },
        tableData: {
            handler(data) {
                this.tableList = cloneDeep(data);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        changeTabs(data) {
            switch (data) {
                case 'basicRules':
                    this.columns = this.basicColumns;
                    this.draggable = false;
                    break;
                case 'advancedRules':
                    this.columns = this.advancedColumns;
                    this.draggable = true;
                    break;
                case 'defaultRules':
                    this.columns = this.defaultColumns;
                    this.draggable = false;
                    break;
            }
        },
        dragDrop(a, b) {
            const tableData = cloneDeep(this.tableList);
            let tmp = tableData[b];
            tableData[b] = tableData[a];
            tableData[a] = tmp;
            this.$emit('handleDragDrop', tableData);
        }
    }
};
</script>
<style lang="less" scoped>
</style>
