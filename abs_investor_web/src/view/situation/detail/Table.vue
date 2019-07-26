<template>
    <div class="assets-lt flex-avg f-between">
        <Table :config="sit"/>
        <Table :config="rate"/>
    </div>
</template>

<script>

    import Table                                    from 'component/Table';
    import {COLUMNS, findColumns}                   from 'common/constant';

    let columns = COLUMNS.situation.sit;

    export default {
        props: {data: Object},
        components: {Table},
        data(){
            let {sit, rate} = this.data;
            return ({
                sit: {
                    list: sit,
                    headers: findColumns('abcd', columns),
                },
                rate: {
                    list: rate,
                    headers: findColumns('ef', columns),
                },
            });
        }
    }

</script>

<style lang="scss">
    .assets-lt {
        align-items: flex-start;
        .c-table{
            margin: 10px;
            &:nth-child(1){
                flex: 16;
            }
            &:nth-child(2){
                flex: 9;
            }
        }
    }
</style>
