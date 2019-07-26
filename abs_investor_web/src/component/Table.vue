<template>
    <div class="c-table">
        <el-table :data="list" v-on="cfg.on" ref="table" v-bind="cfg.attrs">
            <el-table-column v-for="c in config.headers" :key="c.prop" v-bind="{...cfg.columnAttrs, ...c}">
                <template slot="header" slot-scope="scope">
                    {{c.label}}
                </template>
                <template slot-scope="{row}">
                    <Cell :field="c" :data="row"/>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    import Cell                         from 'component/cell';

    export default {
        props: {config: Object, lazyList: Array},
        components: {Cell},
        mounted(){
            this.config.refTable = this.$refs.table;
        },
        computed: {
            cfg(){
                return _.merge({
                    list: [],
                    page: null,
                    refTable: null,
                    headers: [],
                    on: null,
                    attrs: {
                        border: true,
                    },
                    columnAttrs: {
                        align: 'center',
                        resizable: false,
                        headerAlign: 'center',
                        showOverflowTooltip: true,
                    },
                }, this.config);
            },
            list(){
                let {list} = this.config, {lazyList} = this;
                return _.isEmpty(list) ? lazyList : list;
            },
        },
    }
</script>

<style lang="scss">

    @import "../../assets/variable";

    .c-table{
        .el-table{
            color: $labelColor;
            font-size: 12px;
            thead{
                color: $textColor;
            }
            th, td{
                padding: 8px 0;
            }
            th{
                background: #F7F9FF;
                .cell{
                    padding: 0;
                }
            }
        }
        &.no-border .el-table__body-wrapper{
            th, td{
                border: none;
            }
        }
    }
</style>
