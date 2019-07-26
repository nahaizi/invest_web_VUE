<template>
    <div class="v-table">
        <div class="row flex-avg" v-for="rows in headers">
            <template v-for="col in rows">
                <div class="key col" :style="{width: labelWidth + 'em'}">{{col.label}}</div>
                <div class="val col"><Cell :field="col" :data="config.data" empty="" /></div>
            </template>
        </div>
    </div>
</template>

<script>

    import Cell                         from 'component/cell';
    import Container                    from 'component/Container';

    export default {
        props: {config: Object},
        components: {Cell, Container},
        computed: {
            headers(){
                let {cols = 2, data = {}, headers} = this.config, headerList = headers.slice(), ignoreTypes = ['Anchor'];
                //remove undefined field
                _.remove(headerList, h => ignoreTypes.indexOf(h.type) === -1 && data[h.prop] === undefined);
                //add empty cols
                return _.chunk(headerList.concat(_.fill(Array((cols - headerList.length % cols) % cols), {})), cols);
            },
            labelWidth(){
                return this.config.width || 16;
            }
        },
    }
</script>

<style lang="scss">

    @import "../../assets/variable";

    .v-table{
        .row{
            border-top: 1px solid $borderColor;
            border-left: 1px solid $borderColor;
        }
        .row:last-child{
            border-bottom: 1px solid $borderColor;
        }
        .col{
            height: 50px;
            line-height: 50px;
            padding: 0 25px;
            border-right: 1px solid $borderColor;
        }
        .key{
            width: 16em;
            background: #FAFAFA;
        }
        .val{
            flex: 1;
            color: $textColor;
            padding: 0 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            .el-tooltip{
                white-space: nowrap;
            }
        }
    }
</style>
