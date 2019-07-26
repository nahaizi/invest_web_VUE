<template>
    <div class="main">
        <Container title="基本要素" bodyClass="flex-avg">
            <VTable :config="base" class="mb-table"/>
            <div class="process flex-avg f-column">
                <div class="mp-h flex-avg" ref="a1"><span>{{a1.name}} {{a1.value}}</span></div>
                <div class="mp-b flex-avg" ref="sub"><span>{{sub.name}} {{sub.value}}</span></div>
                <div class="mp-f flex-avg"><span />已偿付</div>
            </div>
        </Container>
        <Container title="参与机构">
            <VTable v-if="org" :config="org"/>
        </Container>
        <Container title="产品周期">
            <Step :list="stepList"/>
        </Container>
        <Container title="证券信息">
            <Table :config="stock"/>
        </Container>
        <Container :title="stockTitle">
            <Table :config="stockCurrent"/>
        </Container>
    </div>
</template>

<script>

    import Step                                     from './Step';
    import Table                                    from 'component/Table';
    import VTable                                   from 'component/VTable';
    import Container                                from 'component/Container';
    import {LoadTab}                                from 'common/mixin';
    import {mapActions}                             from 'vuex';
    import {COLUMNS, findColumns}                   from 'common/constant';

    const {form, table} = COLUMNS.main;

    export default {
        props: {id: String},
        mixins: [LoadTab],
        components: {Step, Table, VTable, Container},
        data(){
            return {
                a1:{},
                sub: {},
                org: null,
                base: {
                    data: {},
                    width: 8,
                    headers: findColumns('abcdefghijk', form).concat({
                        ...form.t,
                        click: () => this.$router.push({name: 'mainList'}),
                    }),
                },
                stock:{
                    list: [],
                    headers: findColumns('abcdefghijklm', table),
                },
                stockCurrent:{
                    date: '',
                    list: [],
                    headers: findColumns('nbopqrstu', table),
                },
                stepList: [],
            };
        },
        created(){
            this.fetchMain(this.id).then(r => {

                [this.a1, this.sub] = r.payment;
                this.org = r.org;
                this.stepList = r.stepList;
                this.base.data = r.base;
                this.stock.list = r.stock;
                this.stockCurrent.date = r.stockCurrent.date;
                this.stockCurrent.list = r.stockCurrent.list;

                this.updateProcess({a1: this.a1.value, sub: this.sub.value});

            });
        },
        computed: {
            stockTitle(){
                return `证券当前信息（报告更新至${this.stockCurrent.date}）`;
            }
        },
        methods: {
            ...mapActions(['fetchMain']),
            updateProcess(map){
                _.reduce(map, (r, v, k) => {
                    _.set(this.$refs, `${k}.style.background`, `linear-gradient(90deg, #467557 ${v}, currentColor 0)`);
                }, {});
            }
        },
    }

</script>

<style lang="scss">
    @import "../../../assets/variable";
    .main{
        $height: 40px;
        $complete: #467557;
        .mb-table{
            flex: 1;
        }
        .process{
            color: white;
            width: 200px;
            min-height: 140px;
            align-self: stretch;
            align-items: stretch;
            padding: 30px 40px 30px 90px;
            border: 1px solid $borderColor;
            border-left: none;
        }
        .mp-h, .mp-b{
            background: currentColor;
            span{
                color: white;
            }
        }
        .mp-h{
            flex: 1;
            color: rgba(70, 117, 87, .8);
        }
        .mp-b{
            height: $height;
            margin: $height / 4 0;
            color: rgba(63, 92, 81, .52);
        }
        .mp-f{
            height: $height;
            color: $textColor;
            span{
                width: 20px;
                height: 20px;
                font-size: 14px;
                background: $complete;
                margin-right: 8px;
            }
        }
    }
</style>
