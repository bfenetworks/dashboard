<!-- eslint-disable -->
<template>
    <div class="scheduler">
        <main>
            <div>
                <table>
                    <tr>
                        <th>BFE{{ $t('cluster.name') }}</th>
                        <th>{{ $t('com.nameX', {obj: $t('subCluster.name')}) }}</th>
                        <th>{{ $t('cluster.proportion') }}</th>
                        <th>Total</th>
                    </tr>

                    <template v-for="(subClusters, bfeCluster) in schedulerData">
                        <tr
                            v-for="(subCluster, index) in Object.keys(subClusters)"
                            :class="[queryTotalRate(subClusters) !== 100 ? 'errorColor' : '', 'td-padding']"
                            >
                            <td
                                v-if="index === 0"
                                class="td-padding"
                                :rowspan="Object.keys(subClusters).length"
                            >
                                {{ bfeCluster }}
                            </td>
                            <td class="td-padding">{{ subCluster }}</td>
                            <td class="td-padding">
                                <InputNumber v-model="subClusters[subCluster]">
                                </InputNumber>
                            </td>
                            <td
                                v-if="index === 0"
                                class="td-padding"
                                :rowspan="Object.keys(subClusters).length"
                            >
                                <p>{{ queryTotalRate(subClusters) }}</p>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </main>
    </div>
</template>
<script>
import {cloneDeep, isEqual} from 'lodash';
export default {
    name: 'Scheduler',

    props: {
        scheduler: {
            type: Object,
            default() {
                return {};
            }
        },
        reportFlag: {
            type: Boolean,
            default: false
        },
        subClustersData: {
            type: Array,
            default() {
                return [];
            }
        },
        isAdd: {
            type: Boolean
        }
    },

    watch: {
        scheduler: {
            handler(v) {
                if (!this.isAdd) {
                    this.schedulerData = cloneDeep(v);
                }
            },
            deep: true,
            immediate: true
        },
        reportFlag: {
            handler(v) {
                this.obtainEditedData();
            }
        },
        subClustersData: {
            handler(v) {
                if (this.isAdd) {
                    if (!isEqual(v, this.oldsubClusters)) {
                        this.getBfeClusters();
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        const validate = (rule, value, callback) => {
            if (value === null) {
                callback(new Error(this.$t('com.tipNotEmpty')));
                return;
            }
            if (value > 99999999) {
                callback(new Error(this.$t('com.maxValueX', {num: 99999999})));
                return;
            }
            if (value < 1) {
                callback(new Error(this.$t('com.minValueX', {num: 1})));
                return;
            }
            callback();
        };
        return {
            schedulerData: {},
            ruleValidate: {
                max_region_load: [{required: true, validator: validate}],
                max_blackhole_load: [{required: true, validator: validate}]
            },
            oldsubClusters: []
        };
    },

    methods: {
        getBfeClusters() {
            this.oldsubClusters = cloneDeep(this.subClustersData);
            this.$request(
                {
                    url: 'bfe-clusters',
                    method: 'get'
                }
            ).then(data => {
                if (data.status === 200) {
                    if (!data.data.Data || data.data.Data.length === 0) {
                        this.$Modal.warning({
                            title: this.$t('com.tips'),
                            content: this.$t('cluster.tipBfeClusterNotExist'),
                            onOk: () => {
                                this.$emit('disable', true);
                            }
                        });
                    }
                    if (data.data) {
                        data.data.Data.forEach(item => {
                            let obj = {};
                            this.subClustersData.forEach(ele => {
                                obj[ele] = 0;
                            });
                            this.$set(this.schedulerData, item.name, cloneDeep(obj));
                            this.$set(this.schedulerData[item.name], 'GSLB_BLACKHOLE', 0);
                        });
                    }
                }
            });
        },
        queryTotalRate(subCluster2rate) {
            let rate = 0;
            for (let subCluster in subCluster2rate) {
                if (subCluster2rate.hasOwnProperty(subCluster)) {
                    rate += subCluster2rate[subCluster];
                }
            }
            return rate;
        },
        obtainEditedData() {
            for (let key in this.schedulerData) {
                if (this.queryTotalRate(this.schedulerData[key]) !== 100) {
                    this.$Message.error({
                        content: this.$t('cluster.tipSubClusterCapacityTotalRule')
                    });
                    return;
                }
            }
            this.$emit('submitData', {
                topic: 'scheduler',
                data: this.schedulerData
            });
        }
    }
};
</script>
<style lang="less" scoped>
.scheduler {
    @borderstyle:1px solid #f4f4f4;
    border: @borderstyle;
    border-top: 3px solid #d2d6de;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    .select {
        display: flex;
        padding: 10px;
        justify-items: center;
        p {
            line-height: 47px;
            font-size: 15px;
            width: 100px;
            text-align: left;
        }
        .select {
            flex-grow: 1;
        }
    }
    table {
        @tableBorder: 1px solid #f4f4f4;
        width: 100%;
        border-top: @tableBorder;
        border-left: @tableBorder;
        border-collapse: collapse;
        margin-bottom: 30px;
        .t {
            border-right: @tableBorder;
            border-bottom: @tableBorder;
            text-align: left;
            font-size: 14px;
        }
        .td-padding {
            padding: 0 8px;
            line-height: 40px;
            height: 40px;
        }
        .chlid {
            border-bottom: @tableBorder;
            padding: 0 8px;
            .td-padding();
            &:last-child {
                border-bottom: 0px;
            }
            .warningMessage {
                font-size: 12px;
                text-align: left;
                color: black;
                height: 12px;
                line-height: 12px;
            }
        }
        .errorColor {
            line-height: 45px;
            height: 60px;
        }
        td {
            .t();
        }
        th {
            .t();
            .td-padding();
        }
        .background {
            background: #eee;
        }
    }
    .input-number {
        width: 50%;
    }
    .auto {
        padding: 15px;
    }
}
</style>
