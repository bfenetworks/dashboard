<!-- eslint-disable -->
<template>
    <div class="productLineList" @click="controlList = false">
        <div class="productLineTitle">{{ $t('product.list') }}</div>
        <div class="product-content">
            <div class="note-search">
                <div class="search">
                    <div>
                        <div class="number">{{ productList.length }}</div>
                        <div class="authority clearFloat">
                            <div class="searchTitle">{{ $t('product.productLine') }}</div>
                            <div class="btn clearFloat" v-if="permissionOperation">
                            </div>
                        </div>
                        <div class="search-content clearFloat">
                            <div class="selectCondition" @click.stop>
                                <i-button @click="controlList = !controlList">{{ serachcondition }}</i-button>
                                <ul class="conditionList" v-if="controlList">
                                    <li
                                        v-for="(item, index) in conditionList"
                                        :key="index"
                                        @click="
                                            (controlList = false),
                                                (serachcondition = item.title),
                                                (typeValue = item.value),
                                                changeTypeValue(typeValue)
                                        "
                                    >{{ item.title }}</li>
                                </ul>
                            </div>
                            <div :class="otherSearchType ? 'filter-domain-inp' : 'filter-inp'">
                                <Input v-if="otherSearchType" v-model="serachContent" />
                                <Input
                                    v-else
                                    v-model="serachContent"
                                    v-on:input="productsFilter"
                                />
                            </div>
                            <div v-if="otherSearchType" class="selectCondition" @click.stop>
                                <i-button
                                    class="domain-search"
                                    @click="domainClusterSearch(typeValue)"
                                >{{ $t('com.query') }}</i-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentModule clearFloat">
                <div class="moduleItem" v-for="(item, index) in productList" :key="index">
                    <div
                        class="jiesuo-moduleItemContent"
                    >
                        <div class="itemConten" @click="enterProductView(item)">
                            <div class="itemContentBox">
                                <div class="itemContentBoxTitle">{{ item.name }}</div>
                                <div class="itemContentBoxContent">{{ item.description }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'products',
    computed: {
        user() {
            return this.$store.getUser();
        }
    },
    watch: {
        serachContent: {
            handler(data) {
                if (data === '') {
                    this.productList = cloneDeep(this.productShow);
                }
            },
            immediate: true
        }
    },
    created() {
        this.$store.removeProduct();
    },
    mounted() {
        this.permissionOperation = this.user.isAdmin;
        this.getProducts();
    },
    data() {
        return {
            permissionOperation: true,
            otherSearchType: false,
            productList: [],
            productShow: [],
            spinShow: false,
            serachContent: '',
            serachcondition: this.$t('com.name'),
            controlList: false,
            conditionList: [
                { title: this.$t('com.name'), value: 'name' },
                { title: this.$t('com.desc'), value: 'description' },
                { title: this.$t('product.contacts'), value: 'contact_person_list' },
                { title: this.$t('domain.name'), value: 'domain' },
                { title: this.$t('com.nameX', {obj: this.$t('cluster.name')}), value: 'cluster' },
            ],
            typeValue: 'name',
        };
    },
    methods: {
         domainClusterSearch(typeValue) {
            this.spinShow = true;
            this.$request(
                {
                    url: this.$urlFormat('products?{key}={val}', {key: typeValue, val: this.serachContent}),
                    method: 'get'
                }
            )
                .then((data) => {
                    if (data.status === 200) {
                        this.productList = data.data.Data;
                    }
                })
                .finally(() => {
                    this.spinShow = false;
                });
        },
        changeTypeValue(typeValue) {
            this.serachContent = '';
            if (typeValue === 'contact_person_list') {
                this.productShow.map(item => {
                    let tmpStr = '';
                    item.contact_person_list.map(k => {
                        tmpStr += k + ';';
                    });
                    item.contact_person_list = tmpStr;
                });
            }
            this.productList = cloneDeep(this.productShow);
            if (typeValue === 'domain' || typeValue === 'cluster') {
                this.otherSearchType = true;
            }
            else {
                this.otherSearchType = false;
            }
        },
        getProducts() {
            this.spinShow = true;
            this.$request(
                {
                    url: 'products',
                    method: 'get'
                }
            )
                .then((data) => {
                    if (data.status === 200) {
                        this.productList = data.data.Data;
                        this.productShow = cloneDeep(this.productList);
                    }
                })
                .finally(() => {
                    this.spinShow = false;
                });
        },
        productsFilter() {
            this.productList = cloneDeep(this.productShow);
            this.productList = this.productList.filter((ele) => ele[this.typeValue].
            toLowerCase().indexOf(this.serachContent.toLowerCase()) !== -1);
        },
        enterProductView(item) {
            this.$router.push({
                name: 'gslb.list',
                params: { name: item.name },
                query: {role: this.$ProductRole}
            });
            this.$store.setProduct({ name: item.name });
        },
    },
};
</script>
<style lang="less" scoped>
.productLineList {
    width: 100%;
    border-color: transparent;
    background: transparent;
    .productLineTitle {
        padding-right: 15px;
        padding-left: 15px;
        font-size: 23px;
        font-weight: 700;
        height: 56px;
        line-height: 56px;
    }
    .product-content {
        position: relative;
        padding: 10px 10px 10px 0;
        .note-search {
            .search {
                padding: 10px;
                & > div {
                    padding: 10px;
                    background: #637d97;
                    box-sizing: border-box;
                    border-radius: 5px;
                    .number {
                        font-size: 38px;
                        color: #fff;
                        font-weight: bold;
                        text-align: left;
                    }
                    .authority {
                        .searchTitle {
                            float: left;
                            color: #fff;
                            font-size: 15px;
                        }
                        .btn {
                            float: right;
                            & > div {
                                float: left;
                                width: 60px;
                                height: 22px;
                                color: #fff;
                                border-radius: 5px;
                            }
                            .onAuthority {
                                background-color: #00a65a;
                                border: 1px solid #008d4c;
                                cursor: pointer;
                            }
                            .offAuthority {
                                background-color: #f39c12;
                                border: 1px solid #e08e0b;
                                cursor: pointer;
                            }
                        }
                    }
                }
                .search-content {
                    margin: 10px 0;
                    display: flex;
                    .selectCondition {
                        float: left;
                        position: relative;
                        .domain-search {
                            background-color: #2d8cf0;
                        }
                        button {
                            background-color: #f39b12;
                            color: #fff;
                            i {
                                margin-left: 3px;
                            }
                        }
                        .conditionList {
                            position: absolute;
                            z-index: 99999;
                            left: 0;
                            top: 35px;
                            border-radius: 5px;
                            background: #fff;
                            width: 158px;
                            li {
                                height: 26px;
                                line-height: 26px;
                                text-align: left;
                                padding: 0 16px;
                                cursor: pointer;
                                &:hover {
                                    background-color: #e1e3e9;
                                    color: #333;
                                }
                            }
                        }
                    }
                }
            }
        }
        .contentModule {
            margin-top: 16px;
            .moduleItem {
                box-sizing: border-box;
                width: calc(100% / 3);
                padding: 0 10px;
                float: left;
                margin: 10px 0;
                cursor: pointer;
                .moduleItemContentadd {
                    background-color: #00a65a !important;
                }
                .moduleItemContent {
                    background-color: #637d97;
                    color: #fff;
                    min-height: 90px;
                    border-radius: 3px;
                    overflow: hidden;
                    box-shadow: 0, 0, 0.5;
                    .itemIcon {
                        width: 30%;
                        height: 90px;
                        float: left;
                        position: relative;
                        background: rgba(0, 0, 0, 0.2);
                        i {
                            font-size: 45px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .addFont {
                        float: left;
                        width: 70%;
                        font-size: 20px;
                        display: flex;
                        align-items: center;
                        text-align: left;
                        padding-left: 10px;
                        height: 90px;
                    }
                    .itemConten {
                        width: 100%;
                        text-align: left;
                        .itemContentBox {
                            border-bottom: 2px solid #fff;
                            padding-left: 30px;
                            .itemContentBoxTitle {
                                font-size: 18px;
                                margin: 5px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                cursor: pointer;
                            }
                        }
                        .itemContentBoxContent {
                            font-size: 13px;
                            height: 17px;
                            line-height: 15px;
                            margin: 5px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            cursor: pointer;
                        }
                        .hover:hover {
                            outline: none;
                            text-decoration: none;
                            color: #72afd2;
                        }
                    }
                }
                .jiesuo-moduleItemContent {
                    .moduleItemContent();
                    color: white;
                    background: #496582;
                }
            }
        }
    }
}
.filter-inp {
    width: 80%;
    float: left;
}
.filter-domain-inp {
    width: 60%;
    float: left;
}
@media (min-width: 1500px) {
    .moduleItem {
        width: calc(100% / 6) !important;
    }
    .search {
        width: calc(100% / 6) !important;
    }
}
@media (min-width: 1084px) {
    .moduleItem {
        width: calc(100% / 3) !important;
    }
    .search {
        width: calc(100% / 3) !important;
    }
}
@media (min-width: 801px) and (max-width: 1083px) {
    .moduleItem {
        width: calc(100% / 2) !important;
    }
    .search {
        width: calc(100% / 2) !important;
    }
}

@media (max-width: 800px) {
    .moduleItem {
        width: 100% !important;
    }
    .search {
        width: 100% !important;
    }
}
</style>
