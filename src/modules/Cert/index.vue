<!-- eslint-disable -->
<template>
    <div>
        <Button
            class="add-button"
            type="primary"
            size="small"
            @click="onAdd"
        >{{ $t('com.createX', {obj: $t('cert.name')}) }}</Button>
        <div class="cert-isdefult">
            <span>{{ $t('cert.globalDefaultCert') }}：</span>
            <Select
                v-model="showCertIsDefult"
                class="show-cert-isdefult"
                @on-change="onChangeCert"
            >
                <Option
                    v-for="item in tableData"
                    :key="item.cert_name"
                    :value="item.cert_name"
                >{{ item.cert_name }}</Option>
            </Select>
        </div>

        <Drawer
            v-model="isHiden"
            :mask-closable="false"
            width="500"
            :visible.sync="isHiden"
            :title="$t('com.createX', {obj: $t('cert.name')})"
        >
            <Create
                v-if="isHiden"
                @submit="submitData"
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
import Create from './components/Create.vue';
import moment from 'moment';
export default {
    name: 'instancePools',
    components: {
        pageTable,
        Create
    },
    mounted() {
        this.getCerList();
    },
    data() {
        const that = this;
        return {
            getCertIsDefult: '',
            showCertIsDefult: '',
            isHiden: false,
            tableData: [],
            loading: false,
            columns: [
                {
                    key: 'cert_name',
                    title: this.$t('com.nameX', {obj: this.$t('cert.name')}),
                    searchable: true,
                    sortable: 'custom',
                    render(h, params) {
                        return h('Tooltip', {
                            props: {
                                content: params.row.description === '' ? '-' : params.row.description,
                                placement: 'right'
                            },
                            style: {
                                cursor: 'pointor'
                            }
                        },
                        params.row.cert_name
                        );
                    },
                },
                {
                    key: 'cert_file_name',
                    title: this.$t('cert.certFile'),
                    searchable: true,
                    sortable: 'custom',
                    render(h, params) {
                        return (
                            <span>{ params.row.cert_file_name ? params.row.cert_file_name : '-' }</span>
                        );
                    },
                },
                {
                    key: 'key_file_name',
                    title: this.$t('cert.privateKeyFile'),
                    searchable: true,
                    sortable: 'custom',
                    render(h, params) {
                        return (
                            <span>{ params.row.key_file_name ? params.row.key_file_name : '-' }</span>
                        );
                    },
                },
                {
                    key: 'expired_date',
                    title: this.$t('cert.expiredDate'),
                    searchable: true,
                    width: '200px',
                    sortable: 'custom',
                    render(h, params) {
                        return (
                            <span>{ params.row.expired_date ? moment(params.row.expired_date).
                            format('YYYY-MM-DD HH:mm:ss') : '-' }</span>
                        );
                    },
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    width: '200px',
                    render(h, params) {
                        return h('span', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '20px'
                                },
                                on: {
                                    click: () => {
                                        that.onDel(params.row);
                                    }
                                }
                            },
                                that.$t('com.del')
                            ),
                        ]);
                    }
                }
            ]
        };
    },
    methods: {
        updateCertificates(name) {
            this.$request({
                url: this.$urlFormat('certificates/{cert_name}/default', {cert_name: name}),
                method: 'patch'
            }).then((data) => {
                if (data.status === 200) {
                    this.isHiden = !this.isHiden;
                    this.$Message.success({
                        content: this.$t('com.tipOperationSucc')
                    });
                    this.isHiden = false;
                    this.getCerList();
                }
            });
        },
        createCertificates(data) {
            this.$request({
                url: 'certificates',
                method: 'post',
                data: data
            }).then((data) => {
                if (data.status === 200) {
                    this.isHiden = !this.isHiden;
                    this.$Message.success(
                        {
                            content: this.$t('com.tipAddSuccX', {obj: this.$t('cert.name')})
                        }
                    );
                    this.isHiden = false;
                    this.getCerList();
                }
            });
        },
        onChangeCert(item) {
            let certData = {};
            this.tableData.map((ite) => {
                if (ite.cert_name === item) {
                    certData = ite;
                }
            });
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content: this.$t('cert.tipSumitCertFile') + certData.cert_name + this.
                $t('cert.tipCofigDefault') + '?',
                onOk: () => {
                    this.updateCertificates(certData.cert_name);
                },
                onCancel: () => {
                    this.$Message.info({
                        content: this.$t('com.tipCancel')
                    });
                    this.showCertIsDefult = this.getCertIsDefult;
                },
            });
        },
        onDel(data) {
            this.$Modal.confirm({
                loading: true,
                title: this.$t('com.informationTips'),
                content: this.$t('com.confirmDelX', {obj: this.$t('cert.name')}) + data.cert_name + '?',
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('certificates/{cert_name}', {cert_name: data.cert_name}),
                        method: 'delete'
                    }).then((data) => {
                        this.$Modal.remove();
                        if (data.status === 200) {
                            this.$Message.success({
                                content: this.$t('com.tipDelSucc')
                            });
                            this.getCerList();
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info({
                        content: this.$t('com.tipCancelDel')
                    });
                },
            });
        },
        submitData(data) {
            if (data) {
                this.createCertificates(data);
            }
        },
        getCerList() {
            this.loading = true;
            this.$request({
                url: 'certificates',
                method: 'get'
            })
            .then((data) => {
                if (data.status === 200) {
                    this.tableData = data.data.Data;
                    data.data.Data.map((item) => {
                        if (item.is_default) {
                            this.getCertIsDefult = item.cert_name;
                            this.showCertIsDefult = this.getCertIsDefult;
                        };
                    });
                };
            })
            .finally(() => {
                this.loading = false;
            });
        },
        onAdd() {
            this.isHiden = !this.isHiden;
        },
    },
};
</script>
<style lang="less" scoped>
.cert-isdefult {
    background-color: #f8f8f9;
    height: 42px;
    line-height: 42px;
    margin-bottom: 20px;
    padding: 0 20px;
    .show-cert-isdefult {
        width: 200px;
    }
    span {
        font-size: 14px;
        color: #000000a6;
        font-weight: 600;
    }
}
</style>
