<template>
    <el-pagination
        v-if="totalCount>pageSize"
        class="pagination-page-section"
        @current-change="pageChange"
        background
        align="right"
        :page-size="pageSize"
        prev-text="上一页"
        next-text="下一页"
        :pager-count="pageCount"
        layout="total, prev, pager, next, jumper,slot"
        :total="totalCount"
        >
        <el-button class="to-page-btn" slot>确定</el-button>
    </el-pagination>
</template>

<script>
    export default {
        name:'pagination',
        props:['pageInfo'],
        data (){
            return {
            }
        },
        computed :{
            pageSize:{
                get:function(){
                    return this.pageInfo.pageSize || 20;
                },
                set:function(){
                    
                }
            },
            pageCount (){
                return this.pageInfo.pageCount || 5;
            },
            totalCount (){
                return this.pageInfo.totalCount || 0;
            }
        },
        methods:{
            pageChange (currentPage){
                this.$emit('getPageChange',{
                    currentPage
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination-page-section{
        margin-top: 30px;
    }
</style>
