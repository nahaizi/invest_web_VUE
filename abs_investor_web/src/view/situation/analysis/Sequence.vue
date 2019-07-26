<template>
    <div class="s-sequence">
        <div class="ss-table">
            <Table :config="seq" :lazyList="data" class="no-border"/>
        </div>
        <div class="ss-side" :class="{show: show}">
            <div class="ss-bg flex-avg">
                <div class="ss-btn pointer" @click="close" />
                <Table :config="seqSide" :lazyList="sideData" class="no-border"/>
            </div>
        </div>
    </div>
</template>

<script>

    import Table                                    from 'component/Table';
    import {COLUMNS, findColumns}                   from 'common/constant';

    let columns = COLUMNS.situation.sequence;

    export default {
        props: {data: Array},
        components: {Table},
        data(){
            return ({
                show: false,
                sideData: [],
                seq: {
                    on: {'row-click': this.open.bind(this)},
                    attrs: {
                        height: 500,
                        rowClassName: 'pointer',
                        highlightCurrentRow: true,
                    },
                    headers: [{type: 'Radio', width: 60}].concat(findColumns('abcdef', columns)),
                },
                seqSide: {
                    headers: findColumns('ghijk', columns),
                }
            });
        },
        methods: {
            open(data){
                this.show = true;
                this.sideData = data.datalist;
            },
            close(){
                this.show = false;
            }
        },
    }

</script>

<style lang="scss">
    @import "../../../../assets/variable";
    .s-sequence{
        position: relative;
        .ss-table{
            width: 100%;
        }
        tr.current-row > td{
            background-color: unset;
        }
        $sideBg: rgba(195, 212, 206, .23);
        .ss-side{
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            position: absolute;
            transform: translateX(100%);
            transition: transform 1s;
            background-color: white;
            .c-table{
                flex: 1;
                align-self: flex-start;
                .el-table--group, .el-table--border{
                    border-left: none;
                }
                .el-table{
                    th{
                        background: #C3D4CE;
                    }
                    tr{
                        background-color: $sideBg;
                    }
                }
            }
            &.show{
                transform: translateX(0);
            }
        }
        .ss-bg{
            width: 100%;
            height: 100%;
            background-color: $sideBg;
        }
        .ss-btn{
            color: $primaryColor;
            width: 11px;
            height: 100%;
            opacity: .5;
            z-index: 1;
            position: relative;
            background-color: $primaryColor;
            &:before{
                content: '';
                top: calc(50% - 10px);
                width: 0;
                height: 0;
                position: absolute;
                transform: translateX(100%);
                border-top: 10px solid transparent;
                border-left: 10px solid currentColor;
                border-bottom: 10px solid transparent;
            }
        }
    }
</style>
