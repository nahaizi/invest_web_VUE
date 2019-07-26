<template>
    <Table :config="predict" :lazyList="data"/>
</template>

<script>

    import Table                                    from 'component/Table';
    import {COLUMNS, findColumns}                   from 'common/constant';

    export default {
        props: {data: Array},
        components: {Table},
        data: () => ({
            predict: {
                attrs: {height: 500},
                headers: findColumns('abcd', COLUMNS.situation.predict),
            }
        }),
    }

</script>
