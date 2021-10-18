<!-- eslint-disable -->
<template>
    <div class="expression">
        <div v-for="item in expressionConfig" :key="item.name" class="expression-item">
            <div v-if="item.buttons && item.buttons.length > 0" class="expression-item-box">
                <div class="title">{{ item.name }}:</div>
                <div class="expression-item-body">
                    <Tooltip placement="top" class="content" v-for="ele in item.buttons" :key="ele.name" theme="light"
                        :transfer="true" :disabled="!ele.description && !ele.example">
                        <div slot="content" class="expression-content" style="white-space: normal">
                            <p class="vars-expression-title">
                                {{ ele.description }}
                            </p>
                            <div v-html="ele.example" class="vars-expression-name expression-content-example"></div>
                                                    </div>
                        <div @click="onBtnClick(ele)" class="vars-expression-show">
                            {{ ele.name }}
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
        <Input v-model="localExpression" type="textarea" :rows="6" class="expression" @on-change="changeExpression"/>
        <div class="error" v-if="errmsg">{{errmsg}}</div>
    </div>
</template>
<script>
    import { controller, connController } from './ExpressionConfig';
    export default {
        name: 'Expression',
        props: {
            expression: {
                type: String,
                default: ''
            },
            vars: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            type: {
                type: String,
                default: 'controller'
            }
        },
        computed: {
            conditionVars() {
                if (!this.vars) {
                    return [];
                }
                return this.vars.map(item => {
                    return {
                        name: '$' + item.name,
                        expression: '$' + item.name
                    };
                });
            },
            expressionConfig() {
                if (this.type === 'controller') {
                    return controller(this.conditionVars);
                }
                return connController;
            }
        },
        watch: {
            expression: {
                handler(newVal) {
                    this.localExpression = newVal;
                },
                immediate: true
            }
        },
        data() {
            return {
                errmsg: '',
                localExpression: ''
            };
        },
        methods: {
            changeExpression() {
                if (this.localExpression === '') {
                    this.$emit('expressionChanged', {
                        expression: '',
                        vars: this.vars,
                        errmsg: this.$t('com.tipNotEmptyX', {obj: this.$t('route.expression')})
                    });
                    return;
                }
                let that = this;
                this.$request({
                    url: 'expression/verify',
                    method: 'patch',
                    unneedTips: true,
                    data: {
                        expression: that.localExpression,
                        vars: that.vars
                    }
                }).then(rsp => {
                    let errmsg = '';
                    if (rsp.status !== 200) {
                        errmsg = rsp.ErrMsg;
                        if (rsp.data) {
                            errmsg = rsp.data.message;
                        }
                    }
                    this.$emit('expressionChanged', {
                        expression: that.localExpression,
                        vars: that.vars,
                        errmsg
                    });
                    this.errmsg = errmsg;
                });
            },
            onBtnClick(data) {
                this.localExpression += data.expression;
                this.changeExpression();
            }
        }
    };
</script>
<style lang="less" scoped>
    .error {
        color: red;
    }
    .expression-item {
        background: #ffffff;
        .expression-item-box {
            display: flex;
            align-items: center;
            justify-content: left;
            flex-direction: row;
            border-bottom: 1px solid #eee;
            .title {
                color: #333;
                margin-right: 5px;
                width: 140px;
                text-align: right;
                height: 25px;
                line-height: 25px;
                font-weight: 500;
                font-size: 15px;
            }
            .content {
                .vars-expression-show {
                    border: 2px solid #eee;
                    border-radius: 3px;
                    margin: 3px;
                    padding: 0 5px;
                    cursor: pointer;
                    box-sizing: border-box;
                    line-height: 21px;
                    &:hover {
                        border-color: red;
                    }
                }
            }
        }
        .expression-content-example {
            word-break: break-all;
            p {
                word-break: break-all;
            }
        }
    }
    /deep/ .ivu-input {
        background-color: black;
        color: #ffffff;
    }
    .vars-expression-com-style {
        word-break: break-all;
        border: 1px solid #666;
        border-radius: 5px;
        padding: 5px;
    }
    .vars-expression-name {
        padding: 5px;
        padding-top: 15px;
        p {
            .vars-expression-com-style();
            background: #eee;
        }
    }
    .vars-expression-title {
        .vars-expression-com-style();
        background: #eeeeee61;
    }
</style>