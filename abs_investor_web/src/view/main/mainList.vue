<template>
    <div class="content-section" v-loading="isGetting">
        <el-breadcrumb class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'main'}"><span class="parent-item">产品要素</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">交易列表</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="total-info">
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>产品简称 : </label>{{detailInfo.productName}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>产品ID : </label>{{detailInfo.productId}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>产品类型 : </label>{{detailInfo.productTypeName}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>基础资产类型 : </label>{{detailInfo.assetTypeName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>发行规模 : </label>{{detailInfo.issueScale}} 亿元
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>产品状态 : </label>{{detailInfo.productStatusName}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>产品成立日 : </label>{{detailInfo.issueDate}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>法定到期日 : </label>{{detailInfo.legalDueDate}}
                </el-col>
            </el-row>
        </div>

        <!-- 表格 -->
        <table-template
            v-loading="isGetList"
            :to-detail="toDetail"
            :table-data="tableData" :thead-data="theadData"></table-template>
        <!-- 分页 -->
        <pagination-template :page-info="pageInfo" @getPageChange="getPageChange"></pagination-template>
    
    </div>
</template>
<script>
    import tableTemplate from '@/view/base/tableTpl'
    import paginationTemplate from '@/view/common/paginationTpl'
    import DataApi from '@/api/product'
    export default {
        name:'list',
        data (){
            return {
                isGetting:true,
                isGetList:false,
                detailInfo:{
                    productName:'普洛斯0516-1',
                    productId:'4201802012314',
                    productTypeName:'信贷资产证券化',
                    assetTypeName:'租赁资产',
                    issueScale:'690000',
                    productStatusName:'已发行',
                    issueDate:'2018-02-10',
                    legalDueDate:'2022-01-04'
                },
                pageInfo:{
                    totalCount:0,
                    pageSize:20
                },
                currentPage:1,
                params:{},
                tableData:[],                                   //表格数据
                theadData:[
                    {key:'transactionHash',val:'交易哈希',type:'name',pathName:'mainHashDetail',queryKeys:['transactionHash','par-contracNO']},
                    {key:'initOrg',val:'发起机构'},
                    {key:'transactionType',val:'类型'},
                    {key:'transactionDate',val:'时间'},
                    {key:'transactionStatus',val:'交易状态'},
                    {key:'blockHash',val:'所属区块哈希',type:'name',pathName:'mainBlockDetail',queryKeys:['blockHash']}
                ],
            }
        },
        components:{
            'table-template':tableTemplate,
            'pagination-template':paginationTemplate,
        },
        created (){


            this.params=this.$route.params;
            // let arr=[];
            // let obj={
            //     transactionHash:'rfjngnjxfvmdgnfv23949nfngbj34344',
            //     initOrg:'普洛斯金融',
            //     transactionType:'资金入池',
            //     transactionDate:'2019-05-24',
            //     transactionStatus:'有效',
            //     blockHash:'xejfrhjfbcfvfvgj3434374njgfjbngj22'
            // }
            // for(let i=0;i<10;i++){
            //     this.theadData.forEach((item,index) => {
            //         obj['id']=index;
            //     })
            //     arr.push(obj);
            // }
            // this.tableData=arr;

            this.getDetailInfo();
            this.getList();
        },
        methods:{
            getDetailInfo (){
                let params={
                    productId:this.params.id
                }
                DataApi.getProductInfo(params).then(
                    res => {
                        if(res.code==200){
                            let ndata=res.data || {};
                            this.detailInfo=ndata;
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
            getList (){                                 //获取资产列表
                if(this.isGetList==true){return}
                this.isGetList=true;
                let params={
                    productId:this.params.id,
                    currentPage:this.currentPage,
                    pageSize:this.pageInfo.pageSize,
                }
                DataApi.getTransactionList(params).then(
                    res => {
                        if(res.code==200){
                            let ndata=res.data || {};
                            this.tableData=ndata.items || [];
                            this.pageInfo.totalCount=ndata.total;
                        }
                        this.isGetList=false;
                    },
                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                        this.isGetList=false;
                    }
                )
            },
            getPageChange (data){
                this.currentPage=data.currentPage;
                this.getList();
            },
            toDetail (index,item){
                
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
