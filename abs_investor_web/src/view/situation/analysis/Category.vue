<template>
    <Table :config="category" :lazyList="data" class="s-category"/>
</template>

<script>

    import Table                                    from 'component/Table';
    import {COLUMNS, findColumns}                   from 'common/constant';

    let columns = COLUMNS.situation.category;

    export default {
        props: {data: Array},
        components: {Table},
        data: () => ({
            category: {
                attrs: {rowKey: 'id', height: 500},
                headers: findColumns('abcde', columns),
                columnAttrs: {align: 'left'},
            },
        }),
    }

</script>

<style lang="scss">
    .s-category{
        .el-table__body-wrapper{
            overflow-y: auto;
        }
        .el-table .el-table__expand-icon {
            width: 20px;
            color: currentColor;
            font-size: 16px;
            .el-icon-arrow-right{
                margin-top: -8px;
                margin-left: -8px;
                &:before{
                    content: '\e60e';
                }
            }
        }
    }
</style>
