<template>
    <Container class="site-list" :class="{open: isOpen}" bodyClass="s-container">
        <template slot="title">
            情景列表
            <div class="sc-list flex-avg"><slot /></div>
            <el-button type="text" class="switch" @click="toggleOpen()" />
        </template>
        <template v-if="hasSituation">
            <div class="sc-header flex-avg f-between">
                <div class="title">{{situation.name}}-参数详情</div>
                <div class="body-switch pointer" :class="controller.name" @click="next()" />
            </div>
            <div class="sc-body">
                <compnent :is="componentName" :data="situation.data" />
            </div>
        </template>
    </Container>
</template>

<script>

    import Table                                    from './Table';
    import Diagram                                  from './Diagram';
    import Container                                from 'component/Container';

    class Controller{

        constructor(name, next){
            this.name = name;
            this.setNext(next);
        }

        setNext(next){
            this.next = next;
        }

    }

    let table = new Controller('table'), diagram = new Controller('diagram', table);
    table.setNext(diagram);

    export default {
        props: {situation: Object},
        components: {Table, Diagram, Container},
        data: () => ({
            isOpen: false,
            controller: diagram,
        }),
        computed: {
            hasSituation(){
                return this.situation.id !== undefined;
            },
            componentName(){
                return _.upperFirst(this.controller.name);
            },

        },
        methods: {
            toggleOpen(){
                this.isOpen = !this.isOpen;
            },
            next(){
                this.controller = this.controller.next;
            }
        },

    }

</script>

<style lang="scss">
    @import "../../../../assets/variable";
    .site-list{
        .s-container{
            height: 0;
            margin: 10px;
            padding: 0;
            border: 1px solid transparent;
            overflow: hidden;
            transition: height .45s, border .45s, padding 0s .45s;
        }
        .switch{
            color: #2164BF;
            padding: 1em 25px;
            &:before{
                content: '展开';
            }
        }
        .sc-header{
            color: $titleColor;
            height: 40px;
            padding: 0 20px;
            font-size: 18px;
        }
        .sc-body{
            padding: 10px;
        }
        .body-switch{
            color: #676767;
            font-size: 16px;
            &:before, &.diagram:before{
                color: $primaryColor;
                font-family: element-icons;
                margin-right: 4px;
            }
            &:before{
                content: '\e648';
            }
            &:after{
                content: '图形查看';
            }
            &.diagram:before{
                content: '\e649';
            }
            &.diagram:after{
                content: '列表查看';
            }
        }
        &.open {
            .s-container{
                border: 1px solid $borderColor;
                padding: 10px;
                transition: height .45s, border .45s, padding 0s;
            }
            .switch:before{
                content: '收起';
            }
            .s-container{
                height: 600px;
            }
        }
        .sc-list{
            margin: 0 25px;
        }
        $size: 14px;
        $iconWidth: 20px;
        .item{
            color: $labelColor;
            margin: 0 25px;
            font-size: $size;
            .icon{
                width: $iconWidth;
                height: $iconWidth;
                position: relative;
                background: #DDDEE2;
                margin-right: 15px;
                border-radius: 50%;
            }
            &.active .icon{
                opacity: .8;
                background: linear-gradient(87deg, #52A060, #2C6952);
                &:before{
                    top: #{($iconWidth - $size) / 2};
                    left: #{($iconWidth - $size) / 2};
                    color: white;
                    content: '\e611';
                    position: absolute;
                    font-size: $size;
                    line-height: 1;
                    font-family: element-icons;
                }
            }
        }
    }
</style>
