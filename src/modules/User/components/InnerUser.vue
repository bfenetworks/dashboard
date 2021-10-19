<!-- eslint-disable -->
<template>
    <div>
        <Button class="add-button" type="primary" size="small" @click="onAdd">{{
            $t('com.establish')
        }}</Button>
        <Alert show-icon>{{ $t('user.tipInnerUserDel') }}</Alert>
        <pageTable ref="pageTable" :tableData="tableData" :columns="columns" :loading="loading" />
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
export default {
    components: {
        pageTable
    },
    mounted() {
        this.getInnerUserList();
    },
    data() {
        const that = this;
        return {
            tableData: [],
            columns: [
                {
                    key: 'name',
                    title: 'token'
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
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
            ],
            loading: false
        };
    },
    methods: {
        getInnerUserList() {
            this.loading = true;
            this.$request({
                url: 'auth/inner-users',
                method: 'get'
            }).then(data => {
                this.loading = false;
                this.tableData = [];
                if (data.status === 200) {
                    if (data.data.Data) {
                        data.data.Data.map(item => {
                            let obj = {};
                            obj.name = item;
                            this.tableData.push(obj);
                        });
                    }
                }
            });
        },
        onAdd() {
            this.$request({
                url: 'auth/session-keys/inner',
                method: 'post'
            }).then(data => {
                this.loading = false;
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipEstablishSucc')
                    });
                    this.getInnerUserList();
                }
            });
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('com.confirmDel') + params.row.name + '?',
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('auth/session-keys/{session_key}', {
                            session_key: params.row.name
                        }),
                        method: 'delete'
                    }).then(data => {
                        if (data.status === 200) {
                            this.$Message.success({
                                content: this.$t('com.tipDelSucc')
                            });
                            this.getInnerUserList();
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info({ content: this.$t('com.tipCancelDel') });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>