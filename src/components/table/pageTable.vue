<!-- eslint-disable -->
<template>
    <div class="page-table">
        <div class="searchTable">
            <Table
                v-if="needSerarchInput"
                :columns="searchColumns"
                :data="[{title: ''}]"
                :show-header="false"
                :row-class-name="rowClassName"
            ></Table>
        </div>

        <div class="show-iView-Table">
            <Table
                :columns="columns"
                :data="pageData"
                :border="border"
                width="95%"
                :height="height"
                @on-sort-change="sortChange"
                :loading="loading"
                :class="loading ? 'show-iView-Table-list' : ''"
                :draggable="draggable"
                @on-drag-drop="onDragDrop"
            >
            </Table>
        </div>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="showCurrentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="showTableData.length"
            background
            class="page"
        ></el-pagination>
    </div>
</template>
<script>
import {cloneDeep, isEmpty} from 'lodash';
export default {
    name: 'nonePageTable',

    props: {
        columns: {
            type: Array,
            default() {
                return [];
            }
        },

        tableData: {
            type: Array,
            default() {
                return [];
            }
        },

        border: {
            type: Boolean,
            default: true
        },

        height: {
            type: Number,
            default: null
        },

        loading: {
            type: Boolean,
            default: false
        },

        currentPage: {
            type: Number,
            default: 1
        },

        pageSize: {
            type: Number,
            default: 20
        },

        pageSizes: {
            type: Array,
            default: function () {
                return [20, 30, 40, 50];
            }
        },
        draggable: {
            type: Boolean,
            default: false
        }
    },

    watch: {
        columns: {
            handler(data) {
                const that = this;
                this.searchColumns = [];
                data.forEach(item => {
                    const showTitle = item.showTitle ? item.searchMsg : item.title;
                    if (item.searchable) {
                        this.searchColumns.push({
                            key: item.key,
                            width: item.width,
                            maxWidth: item.maxWidth,
                            minWidth: item.minWidth,
                            render(h) {
                                return h('Input', {
                                    props: {
                                        placeholder: that.$t('com.tipEnterX', {obj: ''}) + showTitle +
                                        that.$t('com.query'),
                                        value: item.searchValue,
                                        maxWidth: '230px'
                                    },
                                    on: {
                                        'on-change': event => {
                                            item.searchValue = event.target.value;
                                            that.searchTable(item);
                                        }
                                    }
                                });
                            }
                        });
                        this.needSerarchInput = true;
                    } else {
                        this.searchColumns.push({
                            key: item.key,
                            width: item.width,
                            maxWidth: item.maxWidth,
                            minWidth: item.minWidth
                        });
                    }
                });
            },
            deep: true,
            immediate: true
        },

        tableData: {
            handler(data) {
                if (!data) {
                    data = [];
                }
                this.showTableData = cloneDeep(data);
                this.cloneShowData = cloneDeep(data);
                this.handlePageData(this.showTableData, this.page);
            },
            deep: true,
            immediate: true
        },

        page: {
            handler(data) {
                this.handlePageData(this.showTableData, data);
            },
            deep: true
        }
    },

    mounted() {
        this.showCurrentPage = this.currentPage;
        this.page = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
        };
    },

    data() {
        return {
            searchColumns: [],
            showTableData: [],
            cloneShowData: [],
            pageData: [],
            needSerarchInput: false,
            showCurrentPage: 0,
            searchMessage: {},
            filterMessage: {},
            page: {
                currentPage: 1,
                pageSize: 20
            }
        };
    },

    methods: {
        searchTable(event) {
            if (event !== 'filter-message') {
                if (event.searchValue === '') {
                    this.$delete(this.searchMessage, event.key);
                    this.$delete(this.searchMessage, event.key + '_render_', event.render);
                } else {
                    this.$set(this.searchMessage, event.key, event.searchValue);
                    if (event.render) {
                        this.$set(this.searchMessage, event.key + '_render_', event.render);
                    }
                }
            }

            if (isEmpty(this.searchMessage) && isEmpty(this.filterMessage)) {
                this.showTableData = cloneDeep(this.tableData);
                this.cloneShowData = cloneDeep(this.showTableData);
                if (this.page.currentPage !== 1) {
                    this.page.currentPage = 1;
                } else {
                    this.handlePageData(this.showTableData, this.page);
                }
            } else {
                this.showTableData = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    let flag = true;
                    l: for (let key in this.searchMessage) {
                        if (key.indexOf('_render_') === -1) {
                            const item = this.tableData[i][key] + '';
                            if (!this.searchMessage[key + '_render_']) {
                                if (
                                    item
                                        .toUpperCase()
                                        .indexOf(this.searchMessage[key].toUpperCase()) === -1
                                ) {
                                    flag = false;
                                    break l;
                                } else {
                                    flag = true;
                                }
                            } else {
                                const render = this.searchMessage[key + '_render_'](
                                    this.$createElement,
                                    {
                                        row: this.tableData[i]
                                    }
                                );
                                if (
                                    this.getShowTableChildren(render.children)
                                        .toUpperCase()
                                        .indexOf(this.searchMessage[key].toUpperCase()) === -1
                                ) {
                                    flag = false;
                                    break l;
                                } else {
                                    flag = true;
                                }
                            }
                        }
                    }
                    for (let key in this.filterMessage) {
                        if (this.filterMessage[key].indexOf(this.tableData[i][key]) === -1) {
                            flag = false;
                            break;
                        }
                    }

                    if (flag) {
                        this.showTableData.push(this.tableData[i]);
                    }
                }
                if (this.page.currentPage !== 1) {
                    this.page.currentPage = 1;
                } else {
                    this.handlePageData(this.showTableData, this.page);
                }
                this.cloneShowData = cloneDeep(this.showTableData);
            }
        },
        getShowTableChildren(arr, content = []) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].text) {
                    content.push(arr[i].text);
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    this.getShowTableChildren(arr[i].children, content);
                }
            }
            return content.join(',').replace(/(^\s*)|(\s*$)/g, '');
        },
        sortChange(data) {
            if (data.order === 'normal') {
                this.showTableData = cloneDeep(this.cloneShowData);
                if (this.page.currentPage !== 1) {
                    this.page.currentPage = 1;
                } else {
                    this.handlePageData(this.showTableData, this.page);
                }
                return;
            }
            if (data.column.customSort) {
                this.pageData = [];
                this.$nextTick(() => {
                    this.showTableData = this.$parent.customSort(
                        data,
                        cloneDeep(this.showTableData)
                    );
                });
            } else {
                this.showTableData.sort((a, b) => {
                    if (typeof a[data.key] === 'object') {
                        return;
                    } else if (typeof a[data.key] === 'number' && typeof b[data.key] === 'number') {
                        if (data.order === 'asc') {
                            return a[data.key] - b[data.key];
                        } else {
                            return b[data.key] - a[data.key];
                        }
                    } else if (data.order === 'asc') {
                        return a[data.key].localeCompare(b[data.key]);
                    } else {
                        return b[data.key].localeCompare(a[data.key]);
                    }
                });
            }
            if (this.page.currentPage !== 1) {
                this.page.currentPage = 1;
            } else {
                this.handlePageData(this.showTableData, this.page);
            }
        },
        filterTable(arr, key) {
            this.$delete(this.filterMessage, key);
            if (arr.length > 0) {
                this.$set(this.filterMessage, key, arr);
            }
            this.searchTable('filter-message');
        },
        rowClassName() {
            return 'iview_table_tr';
        },
        handleSizeChange(val) {
            this.page.pageSize = val;
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
        },
        handlePageData(data, page) {
            const startIndex = (page.currentPage - 1) * page.pageSize;
            const endIndex = startIndex + page.pageSize;
            this.pageData = data.slice(startIndex, endIndex);
        },
        onDragDrop(a, b) {
            const pageStartIndex = (this.page.currentPage - 1) * this.page.pageSize;
            const startIndex = pageStartIndex + parseInt(a, 10);
            const endIndex = pageStartIndex + parseInt(b, 10);
            this.$emit('dragDrop', startIndex, endIndex);
        }
    }
};
</script>
<style lang="less" scoped>
.page-table {
    .page {
        margin-top: 15px;
    }
    ul {
        margin: 5px 0;
        li {
            padding: 0 3px;
        }
    }
}
</style>
<style lang="less">
.searchTable {
    .ivu-table:after {
        width: 1px;
        background-color: transparent !important;
    }
    .iview_table_tr {
        td {
            background-color: transparent;
            border: 0;
        }
    }
    .ivu-table {
        background-color: transparent;
    }
    .ivu-table-wrapper {
        border: 0px !important;
        background: transparent;
        .ivu-table-tip::after {
            width: 0;
        }
    }
    .ivu-table tr.ivu-table-row-hover td {
        background-color: transparent !important;
    }
    .ivu-table .ivu-table-cell {
        padding-left: 0 !important;
    }
}
.show-iView-Table {
    .ivu-table-wrapper {
        border-bottom: 1px solid #e7e9f0;
    }
}
.show-iView-Table-list {
    min-height: 300px;
}
</style>
