<template>
    <div class="content-section" v-loading="isGetting">
        <el-breadcrumb v-if="originType==1" class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'base'}"><span class="parent-item">底层资产</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">区块详情</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb v-else class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'main'}"><span class="parent-item">产品要素</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">区块详情</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="total-info">
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>区块高度 : </label>{{totalInfo.blockHeight}}
                </el-col>
                <el-col class="col-item" :span="18">
                    <label>区块时间 : </label>{{totalInfo.blockDate}}
                </el-col>
            </el-row>
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>交易数量 : </label>{{totalInfo.tradeNum}}
                </el-col>
                <el-col class="col-item" :span="18">
                    <label>区块哈希 : </label>{{totalInfo.blockHash}}
                </el-col>
            </el-row>
        </div>

        <!-- 表格 -->
        <table-template
            :table-data="tableData" :thead-data="theadData"></table-template>
        <!-- 分页 -->
        <pagination-template :page-info="pageInfo" @getPageChange="getPageChange"></pagination-template>
    </div>
</template>

<script>
    import tableTemplate from './tableTpl'
    import paginationTemplate from '../common/paginationTpl'
    import DataApi from '@/api/base'
    export default {
        name:'blockDetail',
        
        data (){
            return {
                isGetting:true,                                  //是否请求数据
                isGetList:false,
                pageInfo:{
                    totalCount:30,
                    pageSize:20,
                },
                
                currentPage:1,
                totalInfo:{
                    blockHeight:1515,
                    blockDate:'2019-10-05 10:00:00',
                    tradeNum:100,
                    blockHash:'ffwfkafhe922IHFEFT7TGBJHOFW8YDH3WDJEF9E907ICEHY',
                },
                tableData:[],                                   //表格数据
                theadData:[
                    {key:'transactionHash',val:'交易哈希'},
                    {key:'initOrg',val:'发起机构'},
                    {key:'transactionType',val:'类型'},
                    {key:'transactionDate',val:'时间'},
                    {key:'transactionStatus',val:'交易状态'}
                ],
                query:{},
                originType:1
            }
        },
        components:{
            'table-template':tableTemplate,
            'pagination-template':paginationTemplate,
        },
        created (){
            if(this.$route.path.indexOf('/mainBlockDetail')!=-1){
                this.originType=2;
            }
            this.query=this.$route.query;
            this.getDetail();
            this.getList();
        },
        methods:{
            getDetail (){
                let params={
                    blockHash:this.query.blockHash,
                }
                DataApi.getBlockInfo(params).then(
                    res => {
                        if(res.code==200){
                            this.totalInfo=res.data;
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.msg?res.msg:'系统异常请联系管理员！'
                            })
                        }
                        this.isGetting=false;
                    },
                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                        this.isGetting=false;
                    }
                )
            },
            getList (){
                if(this.isGetList==true){return}
                this.isGetList=true;
                let params={
                    blockHash:this.query.blockHash,
                    currentPage:this.currentPage,
                    pageSize:this.pageInfo.pageSize
                }
                DataApi.getBlockList(params).then(
                    res => {
                        if(res.code==200){
                            this.tableData=res.data.items;
                            this.pageInfo.totalCount=res.data.total;
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.msg?res.msg:'系统异常请联系管理员！'
                            })
                        }
                        this.isGetList=false;
                        
                    },
                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                        this.isGetting=false;
                    }
                )
            },
            getPageChange (data){
                this.currentPage=data.currentPage;
                this.getList();
            },

            getSample (){
                let arr=[];
                let obj={
                    transactionHash:'155dejdejdje12323',
                    initOrg:'普洛斯',
                    transactionType:'产品成立',
                    transactionDate:'2019-05-23',
                    transactionStatus:'有效'
                };
                for(let i=0;i<10;i++){
                    this.theadData.forEach((item,index) => {
                        obj['id']=index;
                    })
                    arr.push(obj);
                }
                this.tableData=arr;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content-section{
        font-size: 14px;
    }
    .breadcrumb-section{
        margin-bottom: 40px;
    }
    .parent-item{
        color: #888;
        font-weight: 400;
    }
    .color3{
        color: #333;
    }
    .font15{
        font-size: 15px;
    }
    .total-info{
        margin-bottom: 15px;
    }
    .col-item{
        margin-bottom: 25px;
        label{
            color: #4A4A4A;
        }
    }
</style>
