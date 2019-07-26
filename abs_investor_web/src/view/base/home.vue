<template>
    <div class="content-section" v-loading="isGetting">
        <div class="total-div">
            <span>
                <label>入池资产笔数 :</label>{{productInfo.cooperationNum}}
            </span>
            <span>
                <label>入池资产规模 :</label>{{productInfo.cooperationAmoutSum}}
            </span>
            <span>
                <label>剩余本金合计 :</label>{{productInfo.remainingPrincipalSum}}
            </span>
        </div>
        <!-- 表格 -->
        <table-template
            v-loading="isGetList"
            :to-detail="toDetail"
            :table-data="tableData" :last-name="lastName" :th-height="350" :td-width="'120px'" :thead-data="theadData"></table-template>
        <!-- 分页 -->
        <pagination-template :page-info="pageInfo" @getPageChange="getPageChange"></pagination-template>
        
    </div>
</template>

<script>
    import tableTemplate from './tableTpl'
    import paginationTemplate from '../common/paginationTpl'
    import DataApi from '@/api/base'
    export default {
        name:'home',
        data (){
            return {
                isGetting:true,                                  //是否请求数据
                isGetList:false,
                productInfo:{                                    //产品信息
                    cooperationNum:'',
                    cooperationAmoutSum:0,
                    remainingPrincipalSum:0
                },
                
                productId:'',                                   //产品id
                pageInfo:{
                    totalCount:0,
                    pageSize:20
                },
                currentPage:1,
                tableData:[],                                   //表格数据
                lastName:'区块链信息',
                theadData:[                                     //表格头部信息
                    {key:'contracnO',val:'合同编号'},
                    {key:'lesseename',val:'承租人名称'},
                    {key:'lesseeindustry',val:'承租人行业'},
                    {key:'area',val:'地区'},
                    {key:'leasetype',val:'租赁类型'},
                    {key:'assetsubtype',val:'业务品种'},
                    {key:'lesseeterm',val:'租赁合同账龄'},
                    {key:'reterm',val:'租赁合同剩余期限'},
                    {key:'term',val:'租赁合同期限'},
                    {key:'ratetype',val:'利率种类'},
                    {key:'paytype',val:'还款方式'},
                    {key:'guaranteeway',val:'担保方式'},
                    {key:'assetleaseholdtype',val:'租赁物类型'},
                    {key:'contractamount',val:'合同金额'},
                    {key:'payableamount',val:'当期应还金额'},
                    {key:'payabledate',val:'当期应还款日期'},
                    {key:'remainamount',val:'剩余本金金额'},
                    {key:'remaininterest',val:'剩余利息'}
                ]
            }
        },

        components:{
            'table-template':tableTemplate,
            'pagination-template':paginationTemplate,
        },
        created (){
            this.productId=this.$route.params.id;
            this.getList();
        },
        methods:{
            getList (){                                 //获取资产列表
                if(this.isGetList==true){return}
                this.isGetList=true;
                let params={
                    productId:this.productId,
                    currentPage:this.currentPage,
                    pageSize:this.pageInfo.pageSize,
                }
                DataApi.getAssetbasicAssetList(params).then(
                    res => {
                        if(res.code==200){
                            let ndata=res.data || {};
                            this.productInfo.cooperationAmoutSum=ndata.cooperationAmoutSum || '-';
                            this.productInfo.cooperationNum=ndata.cooperationNum || '-';
                            this.productInfo.remainingPrincipalSum=ndata.remainingPrincipalSum || '-';
                            this.tableData=ndata.items || [];
                            this.pageInfo.totalCount=ndata.total || 0;
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.msg?res.msg:'系统异常请联系管理员！'
                            })
                            // this.getSample();
                        }
                        this.isGetting=false;
                        this.isGetList=false;
                    },
                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                        this.isGetList=false;
                        this.isGetting=false;
                        // this.getSample();
                    }
                )
            },
            getSample (){
                let arr=[];
                let obj={
                    contracnO:'2382327932893892',
                    lesseename:'李三',
                    lesseeindustry:'石油采矿业',
                    area:'上海',
                    leasetype:'直租',
                    assetsubtype:'租赁',
                    lesseeterm:'5年',
                    reterm:'2年',
                    term:'3年',
                    ratetype:'固定',
                    paytype:'等额本金',
                    guaranteeway:'抵押',
                    assetleaseholdtype:'CAR+EQUIPMENT',
                    contractamount:'24000',
                    payableamount:'1000',
                    payabledate:'10',
                    remainamount:'2000',
                    remaininterest:'800',
                };
                    
                for(let i=0;i<10;i++){
                    this.theadData.forEach((item,index) => {
                        obj['id']=index;
                    })
                    arr.push(obj);
                }
                this.tableData=arr;
            },
            getPageChange (data){
                this.currentPage=data.currentPage;
                this.getList();
            },
            toDetail (index,item){
                this.$router.push({
                    path: 'list',
                    query:{
                        contracNO:item.contracnO || ''
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .total-div{
        margin-bottom: 40px;
        span{
            font-size: 14px;
            display: inline-block;
            margin-right: 130px;
            color: #888;
            label{
                margin-right: 10px;
                color: #4A4A4A;
            }
        }
    }
</style>
