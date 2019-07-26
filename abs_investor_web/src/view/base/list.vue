<template>
    <div class="content-section" v-loading="isGetting">
        <el-breadcrumb class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'base'}"><span class="parent-item">底层资产</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">交易列表</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="total-info">
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>承租人姓名 : </label>{{detailInfo.lesseeName}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>合同编号 : </label>{{detailInfo.contracNO}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>融资金额 : </label>{{detailInfo.financingAmount}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>剩余本金 : </label>{{detailInfo.remainingPrincipal}}
                </el-col>
                
            </el-row>
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>租金金额 : </label>{{detailInfo.rentalAmount}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>租金余额 : </label>{{detailInfo.rentalBalance}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>起租日 : </label>{{detailInfo.rentDate}}
                </el-col>
                <el-col class="col-item" :span="6">
                    <label>到期日 : </label>{{detailInfo.expiryDate}}
                </el-col>
            </el-row>
            <el-row>
                <el-col class="col-item" :span="6">
                    <label>还款方式 : </label>{{detailInfo.paymentMethod}}
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
    import tableTemplate from './tableTpl'
    import paginationTemplate from '../common/paginationTpl'
    import DataApi from '@/api/base'
    export default {
        name:'list',
        data (){
            return {
                isGetting:true,
                isGetList:false,
                detailInfo:{
                    lesseeName:'',
                    contracNO:'',
                    financingAmount:'',
                    remainingPrincipal:'',
                    rentalAmount:'',
                    rentalBalance:'',
                    rentDate:'',
                    expiryDate:'',
                    paymentMethod:''
                },
                pageInfo:{
                    totalCount:0,
                    pageSize:20
                },
                currentPage:1,
                query:{},
                tableData:[],                                   //表格数据
                theadData:[
                    {key:'transactionHash',val:'交易哈希',type:'link',path:'transactionDetail',queryKeys:['transactionHash','par-contracNO']},
                    {key:'initOrg',val:'发起机构'},
                    {key:'transactionType',val:'类型'},
                    {key:'transactionDate',val:'时间'},
                    {key:'transactionStatus',val:'交易状态'},
                    {key:'blockHash',val:'所属区块哈希',type:'link',path:'blockDetail',queryKeys:['blockHash']}
                ]
            }
        },
        components:{
            'table-template':tableTemplate,
            'pagination-template':paginationTemplate,
        },
        created (){
            this.query=this.$route.query;
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
                    contracNO:this.query.contracNO
                }
                DataApi.getAssetbasicAssetInfo(params).then(
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
                    contracNO:this.query.contracNO,
                    currentPage:this.currentPage,
                    pageSize:this.pageInfo.pageSize,
                }
                DataApi.getAssetbasicTransactionList(params).then(
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
