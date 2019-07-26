<template>
    <div class="s-repay">
        <div class="sr-unit flex-avg">单位：元</div>
        <div class="c-table">
            <el-table :data="dataList" ref="table" height="400" border stripe >
                <el-table-column v-for="(h, i) in labelList" :label="h.label" :key="i">
                    <el-table-column v-for="c in h.headers" :key="c.prop" v-bind="c" :resizable="false" align="center" show-overflow-tooltip>
                        <template slot="header" slot-scope="scope">
                            {{c.label}}
                        </template>
                        <template slot-scope="{row}">
                            <Cell :field="c" :data="row[i]"/>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <div class="sr-footer flex-avg">
            <div>总现金流入：{{data.total}}</div>
            <div>现金流入对优先级资产支持证券的本金覆盖倍数：{{data.multiple}}</div>
        </div>
    </div>
</template>

<script>

    import Cell                                     from 'component/cell';
    import {COLUMNS, findColumns}                   from 'common/constant';

    let columns = COLUMNS.situation.repay, headers = findColumns('bcd', columns);

    export default {
        props: {data: {type: Object, default: () => ({})}},
        components: {Cell},
        computed: {
            list(){
                return _.get(this.data, 'list');
            },
            dataList(){
                let list = _.map(this.list, 'list');
                return _.zip.apply(null, [list[0]].concat(list));
            },
            labelList(){
                return [{headers: [columns.a]}].concat(_.map(this.list, 'label').map(label => ({label, headers})));
            }
        },
    }

</script>

<style lang="scss">

    .s-repay{
        .sr-unit{
            height: 30px;
            font-size: 12px;
            justify-content: flex-end;
        }
        .sr-footer{
            height: 70px;
            justify-content: flex-start;
            > div{
                flex: 1;
            }
        }
        .c-table .el-table .el-table__header-wrapper .is-group > tr:first-child{
            height: 50px;
            font-size: 18px;
            > th{
                text-align: center;
                background-color: white;
            }
        }
    }

</style>
