<template>
    <div class="content-section" v-loading="isGetting">
        <el-breadcrumb v-if="originType==1" class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'base'}"><span class="parent-item">底层资产</span></el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: 'list',query:{contracNO:query.contracNO}}"><span class="parent-item">交易列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">交易详情</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb v-else class="breadcrumb-section" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'main'}"><span class="parent-item">产品要素</span></el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'mainList'}"><span class="parent-item">交易列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="color3 font15">交易详情</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="table-section">
            <h3>基本信息</h3>
            <table>
                <tbody>
                    <tr>
                        <th>交易状态</th>
                        <td>{{detailInfo.transactionStatus}}</td>
                        <th>交易类型</th>
                        <td>{{detailInfo.transactionType}}</td>
                    </tr>
                    <tr>
                        <th>产品ID</th>
                        <td>{{detailInfo.assetsCode}}</td>
                        <th>外部交易流水号</th>
                        <td>{{detailInfo.exTransactionNo}}</td>
                    </tr>
                    <tr>
                        <th>交易时间</th>
                        <td>{{detailInfo.transactionDate}}</td>
                        <th>发起机构</th>
                        <td>{{detailInfo.initOrg}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="table-section">
            <h3>区块链信息</h3>
            <table>
                <tbody>
                    <tr>
                        <th>区块高度</th>
                        <td>{{detailInfo.blockHeight}}</td>
                    </tr>
                    <tr>
                        <th>交易哈希</th>
                        <td>{{detailInfo.transactionHash}}</td>
                    </tr>
                    <tr>
                        <th>区块哈希</th>
                        <td>
                            <router-link class="color4" v-if="originType==1" :to="{path:'blockDetail',query:{blockHash:detailInfo.blockHash}}">{{detailInfo.blockHash}}</router-link>
                            <router-link class="color4" v-else :to="{name:'mainBlockDetail',query:{blockHash:detailInfo.blockHash}}">{{detailInfo.blockHash}}</router-link>
                        </td>
                    </tr>
                    <tr>
                        <th>业务数据</th>
                        <td>
                            <pre>{{detailInfo.businessData}}</pre>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    import DataApi from '@/api/base'
    export default {
        name:'transactionDetail',
        data (){
            return {
                isGetting:true,                                  //是否请求数据
                detailInfo:{
                    transactionStatus:'有效',
                    transactionType:'产品成立',
                    assetsCode:'jfhg_pqio_001_Z028785692897',
                    exTransactionNo:'CU_98853252',
                    transactionDate:'2019-04-03 12:23:56',
                    initOrg:'中国国际金融股份有限公司',
                    blockHeight:'1631',
                    transactionHash:'83rtt94u39t8g8huhf9we8f8syefhq7f89yhfehhoy9iue7f8eywhou900',
                    blockHash:'9hfoiueiusbw98fjo878whdh78fhwdnle7d6wrdfjasfkjesoiuriho',
                    businessData:'确认拒绝原因：所需文件类型未全部上传'
                },
                originType:1,
                query:{}
            }
        },
        created (){
            if(this.$route.path.indexOf('/mainHashDetail')!=-1){
                this.originType=2;
            }
            this.query=this.$route.query;
            this.getDetail();
        },
        methods:{
            getDetail (){
                let param={
                    transactionHash:this.query.transactionHash
                }
                DataApi.getTransactionDetail(param).then(
                    res => {
                        if(res.code==200){
                            if(res.data){
                                this.detailInfo=res.data || {};
                                // JSON.stringify(json, null, "\t")
                                let businessData=this.detailInfo.businessData || '';

                                if(businessData!=''){
                                    let businessObj=JSON.parse(businessData);
                                    this.detailInfo.businessData=JSON.stringify(businessObj,undefined,'\t');
                                }
                            }
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
        }
    }
</script>

<style lang="scss" scoped>
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
    .color4{
        color: #2C6952;
    }
    .font15{
        font-size: 15px;
    }

    .table-section{
        margin-bottom: 40px;
        &>h3{
            font-size: 18px;
            margin-bottom: 30px;
            color: #333;
            font-weight: 400;
        }

        table{
            width: 100%;
            border-collapse: collapse;
            font-size: 16px;
            th{
                padding: 14px 25px;
                background-color: #FAFAFA;
                border: 1px solid #EBEBEB;
                font-weight: 400;
            }
            td{
                padding: 14px 25px;
                color: #4A4A4A;
                border: 1px solid #EBEBEB;
            }
        }
    }
</style>
