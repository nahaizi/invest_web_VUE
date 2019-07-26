<template>
    <div class="situation">
        <Detail :situation="situation">
            <div
                v-for="s in list"
                class="item pointer flex-avg"
                :class="{active: s.id === situation.id}"
                @click="selectSituation(s)"
            >
                <div class="icon" />
                {{s.name}}
            </div>
        </Detail>
        <Container title="情景分析">
            <el-tabs type="card" class="s-analysis">
                <el-tab-pane v-for="a in analysis" :label="a.title" :key="a.name">
                    <component :is="a.component" :data="item[a.name]" />
                </el-tab-pane>
            </el-tabs>
        </Container>
        <Container title="统计结果">
            <Statistic :data="item.statistic"/>
        </Container>
    </div>
</template>

<script>

    import Money                                        from './analysis/Money';
    import Repay                                        from './analysis/Repay';
    import Detail                                       from './detail';
    import Predict                                      from './analysis/Predict';
    import Category                                     from './analysis/Category';
    import Sequence                                     from './analysis/Sequence';
    import Statistic                                    from './Statistic';
    import Container                                    from 'component/Container';
    import {LoadTab}                                    from 'common/mixin';
    import {createNamespacedHelpers}                    from 'vuex';

    const {mapActions} = createNamespacedHelpers('situation');

    const ANALYSIS = [
        {name: 'predict', title: '测算结果', component: Predict},
        {name: 'money', title: '现金流图', component: Money},
        {name: 'sequence', title: '时间顺序列表', component: Sequence},
        {name: 'category', title: '对象分类列表', component: Category},
        {name: 'repay', title: '偿还列表', component: Repay},
    ];

    export default {
        props: {id: String},
        mixins: [LoadTab],
        components: {Detail, Statistic, Container},
        data: () => ({
            list: [],
            item: {},
            situation: {},
        }),
        created(){
            this.fetchList(this.id).then(r => this.list = r);
            this.loadItem();
        },
        computed: {
            analysis: () => ANALYSIS,
        },
        methods: {
            ...mapActions(['fetchList', 'fetchItem']),
            selectSituation(s){
                this.situation = s;
                this.loadItem(s.id);
            },
            loadItem(id){
                this.fetchItem(this.id, id).then(r => this.item = r);
            }
        },

    }

</script>

<style lang="scss">
    @import "../../../assets/variable";
    .situation{

    }
    .s-analysis{
        .el-tabs__header{
            border: none;
            margin-bottom: 65px;
            .el-tabs__nav{
                border: 1px solid $borderColor;
                border-radius: 0;
                .el-tabs__item{
                    color: $labelColor;
                    width: 140px;
                    height: 50px;
                    font-size: 1rem;
                    text-align: center;
                    line-height: 50px;
                    border-left: 1px solid white;
                    background-color: #FAFAFA;
                    &:first-child{
                        border-left: none;
                    }
                    &.is-active{
                        color: white;
                        background-color: $primaryColor;
                    }
                }
            }
        }
        .el-tabs__content{
            min-height: 500px;
            /*overflow: auto;*/
        }
    }
</style>
