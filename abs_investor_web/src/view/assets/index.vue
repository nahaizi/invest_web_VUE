<template>
    <div class="assets">
        <Container title="入池资产笔数/金额特征">
            <VTable :config="sum"/>
        </Container>
        <Container title="入池资产利率/期限特征">
            <VTable :config="period"/>
        </Container>
        <Container title="资产池特征" bodyClass="pool">
            <div class="header flex-avg">
                <div class="item pointer flex-avg" :class="{active: poolId === p.id}" v-for="p in poolList" @click="selectPool(p)">{{p.name}}</div>
            </div>
            <div class="footer" v-if="poolId">
                <Table :config="assetsPool" class="af-table"/>
                <div class="pie"><Pie v-bind="pie"/></div>
            </div>
        </Container>
    </div>
</template>

<script>

    import Pie                                      from './Pie';
    import Table                                    from 'component/Table';
    import VTable                                   from 'component/VTable';
    import Container                                from 'component/Container';
    import {LoadTab}                                from 'common/mixin';
    import {mapActions}                             from 'vuex';
    import {COLUMNS, findColumns}                   from 'common/constant';

    const {form, table} = COLUMNS.assets;

    export default {
        props: {id: String},
        mixins: [LoadTab],
        components: {Pie, Table, VTable, Container},
        data: () => ({
            sum: {
                data: {},
                headers: findColumns('abcdefgh', form),
            },
            period:{
                data: {},
                headers: findColumns('ijklm', form),
            },
            poolId: '',
            poolList: [],
            assetsPool:{
                list: [],
                headers: [{...table.a}].concat(findColumns('bcdef', table)),
            },
        }),
        created(){
            this.fetchAssets(this.id).then(r => {
                this.sum.data = r;
                this.period.data = r;
                this.poolList = _.map(r.features, m => ({id: m.featurecode, name: m.featurename}));
            });
        },
        computed:{
            pie(){
                let {list} = this.assetsPool, {e, a} = table;
                return {prop: e.prop, label: a.prop, list};
            }
        },
        methods: {
            ...mapActions(['fetchAssets', 'fetchAssetsItem']),
            selectPool({id, name}){
                this.fetchAssetsItem({pId: this.id, id}).then(r => {
                    this.poolId = id;
                    this.assetsPool.list = r;
                    this.assetsPool.headers[0].label = name;
                });
            },
        },
    }

</script>

<style lang="scss">
    @import "../../../assets/variable";
    .assets{
        $margin: 5px;
        .pool{
            padding-left: $margin;
            padding-right: $margin;
            .header{
                flex-flow: wrap;
                justify-content: flex-start;
            }
            $n: 8;
            .item{
                width: calc(100% / #{$n - 1} - 2 * #{$margin});
                height: 40px;
                margin: #{$margin + 2.5} $margin;
                font-size: 13px;
                background: #f2f2f2;
                &:first-child:nth-last-child(-n+#{$n}),
                &:first-child:nth-last-child(-n+#{$n}) ~ .item{
                    flex: 1;
                    margin: 0;
                }
                &:first-child:nth-last-child(-n+#{$n}){
                    margin-left: $margin;
                }
                &:first-child:nth-last-child(-n+#{$n}) ~ .item:last-child, &:only-child:nth-last-child(1){
                    margin-right: $margin;
                }
                &.active{
                    color: white;
                    background-color: $primaryColor;
                }
            }
            >.footer{
                display: flex;
                padding: 30px $margin;
                >.pie{
                    width: 360px;
                }
            }
            .af-table{
                flex: 1;
            }
        }

    }
</style>
