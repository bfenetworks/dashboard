<!-- eslint-disable -->
<template>
    <div class="newClusters">
        <BaseConfig
            v-show="stepsCurrentState === 0"
            :baseConfigData="baseConfigData"
            :reportFlag="baseSubmitFlag"
            :isAdd="isAdd"
            :clusterNames="clusterNames"
            @submitData="acceptDataHandler"
        />
        <Timeout
            v-show="stepsCurrentState === 1"
            :baseConfigData="baseConfigData"
            :reportFlag="timeoutSubmitFlag"
            :isAdd="isAdd"
            @submitData="acceptDataHandler"
        />
        <PassiveHealthCheck
            v-show="stepsCurrentState === 2"
            :passiveHealthData="passiveHealthData"
            :reportFlag="passiveHealthSubmitFlag"
            :isAdd="isAdd"
            :submitName="submitName"
            @submitData="acceptDataHandler"
        />
        <SubClusters
            v-show="stepsCurrentState === 3"
            :mountedSubCluster="mountedSubCluster"
            :subClustersData="subClustersData"
            :reportFlag="subClustersFlag"
            :subClusterProductList="subClusterProductList"
            @submitData="acceptDataHandler"
        />

        <Scheduler
            v-show="stepsCurrentState === 4 && isAdd"
            :schedulerConfig="schedulerConfig"
            :isAdd="isAdd"
            :subClustersData="subClustersData"
            :reportFlag="schedulerSubmitFlag"
            @submitData="acceptDataHandler"
            @disable="onChangeDisable"
        />

        <Review
            v-show="stepsCurrentState === 5"
            :baseConfigData="baseConfigData"
            :subClustersData="subClustersData"
            :passiveHealthData="passiveHealthData"
            :schedulerConfig="schedulerConfig"
            :subClusterProductList="subClusterProductList"
            :isAdd="isAdd"
            :reportFlag="reviewSubmitFlag"
            v-on="$listeners"
            @submitData="submit"
        />
        <footer>
            <Steps :current="stepsCurrentState">
                <Step :title="StepsTitle(0)" :content="$t('cluster.basicConfig')"></Step>
                <Step
                    :title="StepsTitle(1)"
                    :content="$t('cluster.timeoutAndRetransmission')"
                ></Step>
                <Step :title="StepsTitle(2)" :content="$t('cluster.passiveHealthCheck')"></Step>
                <Step
                    :title="StepsTitle(3)"
                    :content="$t('com.createX', { obj: $t('subCluster.name') })"
                ></Step>
                <Step
                    v-show="isAdd"
                    :title="StepsTitle(4)"
                    :content="$t('cluster.schedulerConfig')"
                ></Step>
                <Step :title="StepsTitle(5)" :content="$t('cluster.review')"></Step>
            </Steps>
        </footer>
        <div class="com-btn-box drawer-footer">
            <Button
                v-show="stepsCurrentState === 5"
                size="small"
                type="primary"
                @click="submitNextSteps"
            >
                {{ $t('com.submit') }}
            </Button>
            <Button
                v-show="stepsCurrentState !== 5"
                size="small"
                :disabled="disabled"
                @click="submitNextSteps"
                type="primary"
            >
                {{ $t('com.nextStep') }}
            </Button>
            <Button v-show="stepsCurrentState !== 0" @click="back" size="small">{{
                $t('com.lastStep')
            }}</Button>
        </div>
    </div>
</template>
<script>
import BaseConfig from './BaseConfig';
import Timeout from './Timeout';
import SubClusters from './SubClusters';
import Scheduler from './Scheduler';
import PassiveHealthCheck from './PassiveHealthCheck';
import { cloneDeep } from 'lodash';
import Review from './Review';
export default {
    name: 'newClusters',

    components: {
        BaseConfig,
        Timeout,
        PassiveHealthCheck,
        SubClusters,
        Scheduler,
        Review
    },
    props: {
        currentCluster: {
            type: Object,
            default() {
                return {};
            }
        },
        clusterNames: {
            type: Array,
            default() {
                return [];
            }
        },
        isAdd: {
            type: Boolean
        },
        subClusterProductList: {
            type: Array,
            default() {
                return [];
            }
        },
        mountedSubCluster: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    mounted() {
        if (!this.isAdd) {
            this.changeData();
        }
    },

    data() {
        return {
            submitName: '',
            stepsCurrentState: 0,
            baseConfigData: {},
            passiveHealthData: {},
            schedulerConfig: {},
            baseSubmitFlag: false,
            timeoutSubmitFlag: false,
            passiveHealthSubmitFlag: false,
            subClustersFlag: false,
            schedulerSubmitFlag: false,
            reviewSubmitFlag: false,
            disabled: false,
            subClustersData: []
        };
    },

    methods: {
        onChangeDisable(v) {
            this.disabled = true;
        },
        submit() {
            let params = this.handelData();
            if (!this.isAdd) {
                Promise.all([
                    this.updateSubClusters(params.sub_clusters),
                    this.updataClusterBasicData(params)
                ]).then(data => {
                    if (data.every(item => item.status === 200)) {
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                        this.$emit('submit');
                    }
                });
            } else {
                this.$request({
                    url: this.$urlFormat('products/{product_name}/clusters'),
                    method: 'post',
                    data: params
                }).then(data => {
                    if (data.status === 200) {
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                        this.$emit('submit');
                    }
                });
            }
        },
        updataClusterBasicData(params) {
            delete params.scheduler;
            delete params.manual_scheduler;
            delete params.sub_clusters;
            return this.$request({
                url: this.$urlFormat('products/{product_name}/clusters/{cluster_name}', {
                    cluster_name: params.name
                }),
                method: 'patch',
                data: params
            });
        },
        acceptDataHandler(data) {
            this[data.topic] = data.data;
            this.submitName = this.baseConfigData.name;
            if (!this.isAdd && this.stepsCurrentState === 3) {
                this.stepsCurrentState += 2;
            } else {
                this.stepsCurrentState += 1;
            }
        },
        updateSubClusters(data) {
            return this.$request({
                url: this.$urlFormat(
                    'products/{product_name}/clusters/{cluster_name}/sub-clusters',
                    { cluster_name: this.baseConfigData.name }
                ),
                method: 'patch',
                data: {
                    name: this.baseConfigData.name,
                    sub_clusters: data
                }
            });
        },
        handelData() {
            let data = {
                name: this.baseConfigData.name,
                description: this.baseConfigData.description,
                basic: {
                    connection: this.baseConfigData.connection,
                    retries: this.baseConfigData.retries,
                    buffers: this.baseConfigData.buffers,
                    timeouts: this.baseConfigData.timeouts
                },
                sub_clusters: this.subClustersData,
                sticky_sessions: this.baseConfigData.sticky_sessions,
                passive_health_check: this.passiveHealthData,
                scheduler: this.schedulerConfig.scheduler,
                manual_scheduler: this.schedulerConfig.manual_scheduler
            };
            data.basic.connection.cancel_on_client_close = this.baseConfigData.connection.
            cancel_on_client_close === 'true';
            this.changeObj(data);
            return data;
        },
        changeObj(data) {
            for (let key in data) {
                if (JSON.stringify(data[key]) === '{}') {
                    data[key] = null;
                }
            }
        },
        StepsTitle(state) {
            let msg =
                state === this.stepsCurrentState
                    ? this.$t('com.haveInHand')
                    : state > this.stepsCurrentState
                    ? this.$t('com.pending')
                    : this.$t('com.completed');
            return msg;
        },
        submitNextSteps() {
            switch (this.stepsCurrentState) {
                case 0:
                    this.baseSubmitFlag = !this.baseSubmitFlag;
                    break;
                case 1:
                    this.timeoutSubmitFlag = !this.timeoutSubmitFlag;
                    break;
                case 2:
                    this.passiveHealthSubmitFlag = !this.passiveHealthSubmitFlag;
                    break;
                case 3:
                    this.subClustersFlag = !this.subClustersFlag;
                    break;
                case 4:
                    this.schedulerSubmitFlag = !this.schedulerSubmitFlag;
                    break;
                case 5:
                    this.reviewSubmitFlag = !this.reviewSubmitFlag;
                    break;
            }
        },
        changeData() {
            const tmpData = cloneDeep(this.currentCluster);
            this.baseConfigData = {
                name: tmpData.name,
                description: tmpData.description,
                connection: tmpData.basic.connection,
                buffers: tmpData.basic.buffers,
                retries: tmpData.basic.retries,
                timeouts: tmpData.basic.timeouts,
                sticky_sessions: tmpData.sticky_sessions
            };
            this.passiveHealthData = tmpData.passive_health_check;
            this.subClustersData = tmpData.sub_clusters ? tmpData.sub_clusters : [];
            this.schedulerConfig = {
                scheduler: tmpData.scheduler,
                manual_scheduler: tmpData.manual_scheduler
            };
        },
        back() {
            if (!this.isAdd && this.stepsCurrentState === 5) {
                this.stepsCurrentState -= 2;
            } else {
                this.stepsCurrentState -= 1;
            }
        }
    }
};
</script>
<style lang="less" scoped>
footer {
    padding-bottom: 30px;
    margin-top: 35px;
}
</style>
