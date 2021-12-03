<!-- eslint-disable -->
<template>
    <div>
        <page-table
            ref="pageTable"
            :tableData="tableData"
            :columns="columns"
            :loading="loading"
        />
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
        return {
            nameValue: 'ordinaryUser',
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
                    key: 'scope',
                    title: 'scope',
                    searchable: true,
                    sortable: 'custom',
                },
                {
                    key: 'token',
                    title: 'token',
                    searchable: true,
                    sortable: 'custom',
                }
            ]
        };
    },
    methods: {
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