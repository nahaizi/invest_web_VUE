<template>
    <div class="document">
        <Container v-for="d in documents" :title="d.name" :key="d.id" bodyClass="dc">
            <a v-for="a in d.children" target="_blank" :href="a.url">{{a.name}}</a>
        </Container>
    </div>
</template>

<script>

    import Container                   from 'component/Container';
    import {LoadTab}                   from 'common/mixin';
    import {mapActions}                from 'vuex';

    export default {
        props: {id: String},
        mixins: [LoadTab],
        methods: mapActions(['fetchDocument']),
        components: {Container},
        data: () => ({documents: {}}),
        created(){
            this.fetchDocument(this.id).then(r => this.documents = r);
        },
    }
</script>

<style lang="scss">
    @import "../../../assets/variable";
    .document{
        a{
            color: $labelColor;
            margin: 24px 0;
            display: block;
            position: relative;
            text-decoration: none;
            &:hover{
                text-decoration: underline;
                &:after{
                    content: '\e647';
                    margin: .2em 1em;
                    position: absolute;
                    font-family: 'element-icons';
                }
            }
            &:active{
                color: $primaryColor;
            }
        }
        .dc:empty:after{
            content: '暂无数据';
        }
    }
</style>
