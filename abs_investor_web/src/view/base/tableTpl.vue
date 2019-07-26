<template>
    <el-table
        class="table-ele"
        :data="tableData"
        border
        :max-height="thHeight?thHeight:'auto'"
        :header-cell-style="{'padding':'9px 0px','font-size':'12px','background-color':'#F7F9FF'}"
        :cell-style="{'padding':'9px 0px','font-size':'12px'}"
        style="width: 100%">
        <el-table-column
            v-for="(item,index) in theadData"
            :key="index"
            align="center"
            :prop="item.key"
            :width="(item.key=='contracnO' || item.key=='lesseename')?'150px':ow"
            :label="item.val"
            :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <router-link class="color4" v-if="item.type=='link'" :to="{path:item.path,query:item.queryKeys?setQueryParams(scope.row,item.queryKeys):{id:scope.row['id']}}" type="text">{{scope.row[item.key]}}</router-link>
                    <router-link class="color4" v-else-if="item.type=='name'" :to="{name:item.pathName,query:item.queryKeys?setQueryParams(scope.row,item.queryKeys):{id:scope.row['id']}}" type="text">{{scope.row[item.key]}}</router-link>
                    <template v-else>{{scope.row[item.key]}}</template>
                </template>
        </el-table-column>
        <el-table-column
            v-if="lastName"
            fixed="right"
            align="center"
            :label="lastName"
            width="100">
            <template slot-scope="scope">
                <el-button class="detail-btn" @click="toDetail(scope.$index,scope.row)" type="text">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name:'tableList',
        props:['tableData','theadData','lastName','toDetail','tdWidth','thHeight'],
        data (){
            return {
            }
        },
        computed :{
            ow (){
                return this.tdWidth || 'auto'
            }
        },
        components:{
            
        },
        created (){
            
        },
        methods :{
            setQueryParams (item,keys){
                let query=Object.assign({},this.$route.query);
                keys.forEach(element => {
                    if(item[element]!=undefined){
                        query[element]=item[element];
                    }
                });
                return query
            }
        }
    }
</script>

<style lang="scss" scoped>
    .detail-btn{
        padding: 0px 10px;
    }
    .color4{
        color: #2C6952;
    }
</style>
