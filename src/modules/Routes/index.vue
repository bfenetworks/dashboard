<!-- eslint-disable -->
<template>
    <div class="routes">
        <Button
            size="small"
            type="primary"
            class="submit"
            @click="submitRoutes"
        >{{ $t('com.submitAndEffect') }}</Button>
        <div>
            <h3 class='title'>{{ $t('com.ruleExplain') }}</h3>
            <p>{{ $t('route.tipExplain') }}</p>
            <p style="color:red">{{ $t('route.tipExplain2') }}</p>
            <h3 class='title'>{{ $t('route.config') }}</h3>
            <Tabs
                v-model="rulesValue"
                :animated="false"
                type="card"
                @on-click="changeTabs"
            >
                <TabPane
                    v-for="(item,index) in tabList"
                    :key="index"
                    :label="item.label"
                    :name="item.name"
                    :disabled="disabled"
                    >
                    <Button
                        v-show="rulesValue !== 'defaultRules'"
                        size="small"
                        type="primary"
                        @click="addForwardRule"
                    >{{ addBtnText }}</Button>
                    <span v-show="rulesValue === 'basicRules'" class="content">
                        {{ $t('route.tipBasicExplain') }}
                    </span>
                    <span v-show="rulesValue === 'advancedRules'" class="content">
                        {{ $t('route.tipAdvanceExplain') }}
                    </span>
                    <span v-show="rulesValue === 'defaultRules'" class="content defalut">
                        {{ $t('route.tipDefaultExplain') }}
                    </span>
                    <ForwardRuleList
                        v-if="routeData"
                        :rulesData="routeData"
                        :rulesValue="rulesValue"
                        :tableData="tableData"
                        :clustersData="clustersData"
                        @updateForwardRule="updateForwardRule"
                        @getDefaultClusterName="getDefaultClusterName"
                        @del="delForwardRule"
                        @handleDragDrop="handleDragDrop"
                    />
                </TabPane>
            </Tabs>
            <Drawer
                v-model="cantrolRule"
                :title="drawerTitle"
                width="60"
                :mask-closable="false"
            >
                <ForwardRuleUpsert
                    v-if="cantrolRule"
                    :clustersData="clustersData"
                    :rulesData="currentRuleData"
                    :rulesValue="rulesValue"
                    :isAdd="isAdd"
                    @del="delForwardRule"
                    @submit="submitForwardRule"
                />
            </Drawer>
        </div>
    </div>
</template>
<script>
import ForwardRuleUpsert from './components/ForwardRuleUpsert.vue';
import ForwardRuleList from './components/ForwardRuleList.vue';
import {cloneDeep} from 'lodash';
export default {
    name: 'Routes',
    components: {
        ForwardRuleUpsert,
        ForwardRuleList
    },
    computed: {
        addBtnText() {
            return this.rulesValue === 'basicRules' ? this.$t('com.createX', {obj: this.$t('route.basicRule')}) :
            this.$t('com.createX', {obj: this.$t('route.advanceRule')});
        },
        editBtnText() {
            return this.rulesValue === 'basicRules' ? this.$t('com.editX', {obj: this.$t('route.basicRule')}) :
            this.$t('com.editX', {obj: this.$t('route.advanceRule')});
        },
        drawerTitle() {
            let text = '';
            if (this.isAdd) {
                text = this.addBtnText;
            }
            else {
                text = this.editBtnText;
            }
            return text;
        },
        tabList() {
            return [
                {
                    name: 'basicRules',
                    label: this.basicLabel
                },
                {
                    name: 'advancedRules',
                    label: this.advanceLabel
                },
                {
                    name: 'defaultRules',
                    label: this.defaultLabel
                }
            ];
        }
    },

    watch: {
        defaulList(v) {
            this.disabled = !v[0].cluster_name;
        }
    },
    mounted() {
        this.getRoutes();
        this.getClusters();
    },

    data() {
        const that = this;
        return {
            loading: false,
            disabled: false,
            cantrolRule: false,
            routeData: {
                forward_rules: []
            },
            tableData: [],
            defaulList: [],
            clustersData: [],
            currentRuleData: {},
            isAdd: true,
            currentForwardRuleIndex: -1,
            rulesValue: 'basicRules',
            basicLabel: h => {
                return h('div',
                    [
                        h('div', {
                            style: {
                                borderRadius: '50%',
                                float: 'left',
                                width: '40px',
                                textAlign: 'center',
                                lineHeight: '40px',
                                height: '40px',
                                marginLeft: '15px',
                                border: that.rulesValue === 'basicRules' ? '1px solid #333' : '1px solid #ccc'
                            }
                        }, '1'),
                        h('span', {
                            style: {
                                lineHeight: '40px',
                                fontSize: '18px',
                                paddingLeft: '10px'
                            }
                        }, that.$t('route.basicRule')),
                        <p style="fontSize:14px;margin-top:10px;">{ that.$t('route.tipBasic') }</p>
                    ]);
            },
            advanceLabel: h => {
               return h('div',
                    [
                     h('div', {
                        style: {
                            borderRadius: '50%',
                            float: 'left',
                            width: '40px',
                            textAlign: 'center',
                            lineHeight: '40px',
                            marginLeft: '15px',
                            height: '40px',
                            border: that.rulesValue === 'advancedRules' ? '1px solid #333' : '1px solid #ccc'
                        }
                    }, '2'),
                    h('span', {
                        style: {
                            lineHeight: '40px',
                            fontSize: '18px',
                            paddingLeft: '10px'
                        }
                    }, that.$t('route.advanceRule')),
                    <p style="fontSize:14px;margin-top:10px;">{ that.$t('route.tipAdvance') }</p>
                ]);
            },
            defaultLabel: h => {
               return h('div',
                    [
                     h('div', {
                        style: {
                            borderRadius: '50%',
                            float: 'left',
                            width: '40px',
                            textAlign: 'center',
                            lineHeight: '40px',
                            height: '40px',
                            marginLeft: '5px',
                            border: that.rulesValue === 'defaultRules' ? '1px solid #333' : '1px solid #ccc'
                        }
                    }, '3'),
                    h('span', {
                        style: {
                            lineHeight: '40px',
                            fontSize: '18px',
                            paddingLeft: '10px'
                        }
                    }, that.$t('route.default')),
                    <p style="fontSize:14px;margin-top:10px;textAlign:center">{ that.$t('route.tipDefault') }</p>
                ]);
            }
        };
    },
    methods: {
        handleDragDrop(data) {
            this.tableData = cloneDeep(data);
            this.routeData.forward_rules = this.tableData;
        },
        changeForwardRules(v) {
            if (!v.forward_rules || v.forward_rules.length === 0) {
                v.forward_rules.push(this.defaulList[0]);
            }
            else {
                if (v.forward_rules.indexOf(this.defaulList[0]) === -1) {
                    v.forward_rules.push(this.defaulList[0]);
                }
            }
        },
        jumpDefaultRules() {
            this.rulesValue = 'defaultRules';
            this.tableData = this.defaulList;
        },
        getDefaultClusterName(v) {
            this.defaulList[0].cluster_name = v;
            this.disabled = false;
        },
        getClusters() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/clusters'),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.clustersData = data.data.Data.filter(element => element.ready);
                }
            });
        },
        changeTabs() {
            if (!this.defaulList[0].cluster_name) {
                this.rulesValue = 'defaultRules';
                this.tableData = this.defaulList;
                this.$Message.warning({
                    content: this.$t('route.tipDefaultRule')
                });
            }
            else {
                if (this.rulesValue === 'basicRules') {
                    this.tableData = this.routeData.basic_forward_rules;
                }
                else if (this.rulesValue === 'advancedRules') {
                    this.tableData = this.routeData.forward_rules;
                }
                else {
                    this.tableData = this.defaulList;
                }
            }
        },
        getRoutes() {
            this.routeData = {};
            this.loading = true;
            this.$request({url: this.$urlFormat('products/{product_name}/routes'), method: 'get'})
                .then(data => {
                    this.loading = false;
                    if (data.status === 200) {
                        this.routeData = data.data.Data;
                        this.defaulList = [];
                        if (this.routeData.forward_rules && this.routeData.forward_rules.length > 0) {
                            this.routeData.forward_rules.forEach((item, index) => {
                                if (item.name === 'default') {
                                    this.defaulList = this.routeData.forward_rules.splice(index, 1);
                                }
                            });
                        }
                        else {
                            let data = {
                                name: 'default',
                                cluster_name: '',
                                description: 'default rule',
                                expression: 'default_t()'
                            };
                            this.defaulList.push(data);
                        };
                        if (!this.defaulList[0].cluster_name) {
                            this.rulesValue = 'defaultRules';
                            this.tableData = this.defaulList;
                        }
                        else {
                            this.rulesValue = 'basicRules';
                            this.tableData = this.routeData.basic_forward_rules;
                        }
                    }
                })
                .finally(() => {
                });
        },
        addForwardRule() {
            this.cantrolRule = true;
            this.isAdd = true;
            this.currentRuleData = {};
        },
        updateForwardRule(data) {
            this.currentForwardRuleIndex = data._index;
            this.cantrolRule = true;
            this.isAdd = false;
            this.currentRuleData = data;
        },
        delForwardRule(index) {
            if (this.rulesValue === 'basicRules') {
                this.routeData.basic_forward_rules.splice(index, 1);
            }
            else if (this.rulesValue === 'advancedRules') {
                this.routeData.forward_rules.splice(index, 1);
            }
        },
        dropForwardRule(data) {
            this.routeData.forward_rules = data;
        },
        submitForwardRule(data) {
            if (!this.defaulList[0].cluster_name) {
                this.$Message.error({
                    content: this.$t('route.tipDefaultRule')
                });
                return;
            }
            let tmpData = null;
            if (this.rulesValue === 'basicRules') {
                tmpData = {
                    paths: [],
                    host_names: [],
                    description: data.description,
                    cluster_name: data.cluster_name
                };
                if (data.paths.trim()) {
                    tmpData.paths = data.paths.split(',').map(item => item.trim());
                }
                if (data.host_names.trim()) {
                    tmpData.host_names = data.host_names.split(',').map(item => item.trim());
                }
                if (this.isAdd) {
                    this.routeData.basic_forward_rules.unshift(tmpData);
                }
                else {
                    this.routeData.basic_forward_rules.splice(this.currentForwardRuleIndex, 1, tmpData);
                }
            }
            else if (this.rulesValue === 'advancedRules') {
                if (this.isAdd) {
                    this.routeData.forward_rules.unshift(data);
                }
                else {
                    this.routeData.forward_rules.splice(this.currentForwardRuleIndex, 1, data);
                }
            }
            this.cantrolRule = false;
        },
        submitRoutes() {
            this.loading = true;
            this.changeForwardRules(this.routeData);
            this.$request({
                url: this.$urlFormat('products/{product_name}/routes'),
                method: 'patch',
                data: {
                    basic_forward_rules: this.routeData.basic_forward_rules,
                    forward_rules: this.routeData.forward_rules
                }
            })
            .then(data => {
                this.loading = false;
                this.routeData.forward_rules.forEach((item, index) => {
                    if (item.name === 'default') {
                        this.defaulList = this.routeData.forward_rules.splice(index, 1);
                    }
                });
                if (data.status === 200) {
                    this.$Message.success({content: this.$t('com.tipSubmitSucc')});
                    this.getRoutes();
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
 /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
     height: 100px;
     padding: 15px 30px 0px 30px;
 }
 /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height:100px;
 }
 /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    font-weight: 600;
 }
.routes {
    position: relative;
    min-height: 500px;
    .submit {
        position: absolute;
        right: 0;
        z-index: 998;
    }
    .lodingBox {
        min-height: 500px;
        position: relative;
    }
    .routes_btn {
        margin-bottom: 15px;
    }
    .routes_title {
        width: 80%;
        margin: 0 auto;
        background: #eee;
    }
    .title{
        line-height:50px;
    }
    .content{
        padding: 3px 0px 3px 20px;
        margin-left: 20px;
        border-left: 1px solid rgba(37, 32, 32, 0.568);
        line-height: 50px;
    }
    .defalut {
        border-left: none;
        margin-left: 0px;
    }
}
</style>
