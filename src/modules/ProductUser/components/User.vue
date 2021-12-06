<!-- eslint-disable -->
<template>
    <div>
         <Button
            class="add-button"
            type="primary"
            size="small"
            @click="onAdd"
        >{{ $t('user.relationX', {obj: $t('user.name')}) }}</Button>
        <Drawer
            v-model="isHiden"
            :title="$t('user.relationX', {obj: $t('user.name')})"
            width="30"
            :mask-closable="false"
        >
            <AssociatedUser
                v-if="isHiden"
                :userNameList="userNameList"
                @submit="submitData"
            />
        </Drawer>
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
import AssociatedUser from './AssociatedUser.vue';
export default {
    components: {
        pageTable,
        AssociatedUser
    },
    mounted() {
        this.getUserList();
    },
    data() {
        const that = this;
        return {
            loading: false,
            isHiden: false,
            currentData: {},
            tableData: [],
            userNameList: [],
            columns: [
                {
                    key: 'user_name',
                    title: this.$t('user.name'),
                    searchable: true,
                    sortable: 'custom',
                },
                {
                    key: 'is_admin',
                    title: this.$t('user.role'),
                    render(h, params) {
                        return (
                            <div>
                                {
                                    <span>{params.row.is_admin ? that.$t('com.sysAdmin') : that.
                                    $t('com.ordinaryUser')}</span>
                                }
                            </div>
                        );
                    }
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    render(h, params) {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                       that.onRelieve(params);
                                    }
                                }
                            }, that.$t('user.disassociate'))
                        ]
                        );
                    }
                }
            ]
        };
    },
    methods: {
        onRelieve(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('user.tipDisassociate', {obj: params.row.user_name}),
                onOk: () => {
                    this.onDisassociateUser(params.row.user_name);
                }
            });
        },
        onDisassociateUser(name) {
            let user = this.$store.getUser();
            this.$request({
                url: this.$urlFormat('auth/users/{user_name}/products/{product_name}', {
                    user_name: name
                }),
                method: 'delete'
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({content: this.$t('user.tipDisassociateSucc')});
                    if (user.name === name) {
                        this.$Modal.error({
                            loading: true,
                            title: this.$t('com.informationTips'),
                            content: this.$t('user.tipUserDisassociateSucc'),
                            onOk: () => {
                                this.$Modal.remove();
                                location.href = `${window.location.protocol}//${window.location.host}/login`;
                            },
                        });
                    }
                    else {
                        this.getUserList();
                    }
                }
            });
        },
        submitData(data) {
            if (data) {
                this.onAddProductUser(data);
            }
        },
        onAddProductUser(data) {
            this.$request({
                url: this.$urlFormat('auth/users/{user_name}/products/{product_name}', {
                    user_name: data.user_name,
                }),
                method: 'post'
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({content: this.$t('user.tipAssociationSucc')});
                    this.isHiden = false;
                    this.getUserList();
                }
            });
        },
        getUserList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('auth/users/actions/search-by-product/{product_name}'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.tableData = data.data.Data ? data.data.Data : [];
                    if (this.tableData) {
                        this.userNameList = this.tableData.map(item => {
                            return item.user_name;
                        });
                    }
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        onAdd() {
            this.isHiden = true;
        },
        onUpdatePassword(params) {
            this.isHiden = true;
            this.currentData = params.row;
        }
    }
};
</script>

<style lang="less" scoped>

</style>