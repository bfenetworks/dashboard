<!-- eslint-disable -->
<template>
    <div class="SubClusters">
        <div>
            <Button
                size="small" type="primary"
                @click="onAdd"
            >{{ $t('com.createX', {obj: $t('subCluster.name')})}}</Button>
            <Drawer
                v-model="visible"
                :title="$t('com.createX', {obj: $t('subCluster.name')})"
                width="50"
                :mask-closable="false"
            >
                <Upsert
                    v-if="visible"
                    :tableData="tableData"
                    @submit="handleSubmit"
                />
            </Drawer>
            <ProductList
                ref="ProductList"
                @getTableData="getTableData"
            />
        </div>
    </div>
</template>
<script>
import ProductList from './components/ProductList';
import Upsert from './components/Upsert';
export default {
    name: 'SubClusters',

    components: {
        ProductList,
        Upsert
    },

    data() {
        return {
            visible: false,
            upsertLoading: false,
            tableData: []
        };
    },
    methods: {
        getTableData(v) {
            this.tableData = v;
        },
        onAdd() {
            this.visible = true;
        },
        handleSubmit(v) {
            this.upsertLoading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/sub_clusters'),
                method: 'post',
                data: v
            })
                .then(data => {
                    if (data.status === 200) {
                        this.$refs.ProductList.getSubClusters();
                        this.visible = false;
                        this.$Message.success({
                            content: this.$t('com.tipAddSucc')
                        });
                    }
                })
                .finally(() => {
                    this.upsertLoading = false;
                });
        }
    }
};
</script>
