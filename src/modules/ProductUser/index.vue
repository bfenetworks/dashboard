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
            <CreateUser
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
import CreateUser from './components/Create.vue';
export default {
    name: 'instancePools',
    components: {
        'page-table': pageTable,
        CreateUser,
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
            associatedUseList: [],
            userNameList: [],
            columns: [
                {
                    key: 'user_name',
                    title: this.$t('user.name'),
                    searchable: true,
                    sortable: 'custom',
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
                            }, that.$t('user.disassociate')),
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
                loading: true,
                title: this.$t('com.informationTips'),
                content: this.$t('user.tipDisassociate'),
                onOk: () => {
                    this.onDelProductUser(params.row.user_name);
                },
                onCancel: () => {
                    this.$Message.info({content: this.$t('com.tipCancelDel')});
                }
            });
        },
        onDelProductUser(name) {
            let user = this.$store.getUser();
            this.$request({
                url: this.$urlFormat('auth/products/{product_name}/users/{user_name}', {
                    user_name: name
                }),
                method: 'delete'
            }).then(data => {
                if (data.status === 200) {
                    this.$Modal.remove();
                    this.$Message.success({content: this.$t('user.tipDisassociateSucc')});
                    if (user.name === name) {
                        location.href = `${window.location.protocol}//${window.location.host}/login`;
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
                url: this.$urlFormat('auth/products/{product_name}/users/{user_name}', {
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
                url: this.$urlFormat('auth/products/{product_name}/users'),
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

