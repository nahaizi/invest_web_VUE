<template>
    <div class="home">
        <section class="header-section">
            <header class="header flex-avg f-between box">
                <div>
                    <Logo />
                    <span class="separate">区块链资产证券化平台</span>
                </div>
                <div class="info flex-avg">
                    <div>{{userInfo.userName}}</div>
                    <el-button type="text" class="exit separate" @click="logout">退出</el-button>
                </div>
            </header>
        </section>
        <section class="body box">
            <header class="b-header box flex-avg f-between">
                <div class="flex-avg">
                    <div class="pic pointer" />
                    <el-select v-model="id" @change="loadTab" class="select" popper-class="select-p" placeholder="请选择">
                        <el-option
                            v-for="p in list"
                            :key="p.id"
                            :label="p.name"
                            :value="p.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="body">
                    <span>发行时间：{{project.date}}</span>
                    <span>发行金额：{{project.amount}} 亿元</span>
                </div>
            </header>
            <footer class="b-footer">
                <el-tabs v-model="tab" @tab-click="go" class="tab">
                    <el-tab-pane v-for="m in menus" v-bind="m" :key="m.name" />
                </el-tabs>
                <div class="content box">
                    <router-view :key="$route.fullPath"/>
                </div>
            </footer>
        </section>
    </div>
</template>

<script>
    
    import Store                                    from 'store';
    import Logo                                     from 'component/Logo';
    import {MENUS}                                  from 'common/constant';
    import DataApi from '@/api/user'
    import {mapGetters,mapActions,createNamespacedHelpers}                 from 'vuex';
    const {mapState:mapState,mapActions:userMapActions} = createNamespacedHelpers('user')
    let globalUser=null;


    export default {
        components: {Logo},
        data (){

            return {
                isGoout:false,

                id: '',
                tab: 'main',
                list: [],
                project: {},
                userInfo:{
                    userName:''
                }
            }
        },
        beforeRouteEnter: (t, f, next) => {
            globalUser=localStorage.getItem('user');
            globalUser=globalUser?JSON.parse(globalUser):{};
            if(globalUser.isLogin==true){
                next();
            }else{
                next({
                    path: "/login"
                })
            }
        },
        created(){
            this.getUserInfo();

            this.fetchProjects().then(r => {
                this.list = r;
                this.loadTab(1);
            });
        },
        computed: {
            ...mapState({
                userToken:'userToken'
            }),
            menus: () => MENUS,
        },
        methods: {
            ...mapActions(['fetchProjects']),
            ...userMapActions(['setUserInfo','delUserInfo']),

            getUserInfo (){                             //获取用户信息
                
                let user=localStorage.getItem('user');
                let userInfo=user?JSON.parse(user).userInfo:null;
                if(userInfo){
                    this.userInfo=userInfo;
                }else{
                    DataApi.getUserInfo({}).then(
                        res => {
                            if(res.code==200){
                                this.userInfo=res.data;
                                this.setUserInfo(this.userInfo);
                            }else{
                                this.$message({
                                    type:'warning',
                                    message:res.data.msg
                                });
                            }
                        },
                        err => {
                            this.$message({
                                type:'error',
                                message:'网络似乎出现了问题，请稍后再试'
                            })
                        }
                    )
                }
            },

            go({name}){
                this.$router.push({name, params: {id: this.id}});
            },
            loadTab(type){
                var p = _.find(this.list, {id: this.id}) || _.get(this.list, '[0]', {});
                this.id = p.id;
                this.project = p;
                if(this.$route.path=='/home' && type==1){
                    this.go({name: this.tab});
                    return;
                }
                let query=this.$route.query || {};
                // 重设路由参数
                this.$router.push({
                    params:{
                        id:this.id
                    },
                    query
                })
                if(type!=1){
                    window.location.reload(true);
                }
            },
            logout(){
                if(this.isGoout==true){return}
                this.isGoout=true;
                DataApi.loginOut({
                    token:globalUser.token
                }).then(
                    res => {
                        if(res.code==200){
                            this.delUserInfo({});
                            this.$router.push({
                                path:'/login'
                            })
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.data.msg
                            });
                        }
                        this.isGoout=false;
                    },
                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                    }
                )


                /*---------------------------登出登录、重新登录前，必须执行下段代码，清除记录数据-----------------------------*/
                this.delUserInfo({});
                this.$router.push({
                    path:'/login'
                })
                /*---------------------------end-----------------------------*/

            }
        }
    }
</script>

<style lang="scss">

    @import "../../assets/variable";

    .home{
        $width: 1200px;
        $gutter: 1em;
        $paddingLeft: 50px;
        $headerHeight: 104px;
        $subHeaderHeight: 76px;
        background-color: $bgColor;
        >{
            .body{
                color: $labelColor;
                height: calc(100vh - #{$headerHeight});
                padding: $gutter;
                font-family: "PingFangSC-Regular", "Microsoft YaHei", "微软雅黑", Arial;
                .b-header, .b-footer{
                    width: $width;
                    margin: 0 auto;
                    background: white;

                }
                .b-header{
                    height: $subHeaderHeight;
                    padding: 0 $paddingLeft;
                    font-size: 15px;
                    background-color: white;
                    .body > span{
                        margin-left: 25px;
                    }
                    .pic{
                        width: 24px;
                        height: 25px;
                        display: inline-block;
                        background: url("../../assets/imgs/project.png") no-repeat;
                    }
                    .select{
                        width: 20em;
                        font-size: 18px;
                        input, .el-input{
                            font-size: inherit;
                        }
                        input{
                            border: none;
                            padding-left: 11px;
                        }
                    }
                }
                $tabHeight: 68px;
                .b-footer{
                    height: calc(100% - #{$subHeaderHeight} - #{$gutter});
                    margin-top: $gutter;
                    background-color: #FFF;
                    .tab .el-tabs__header{
                        margin: 0;
                        .el-tabs__nav{
                            margin-left: 50px;
                        }
                        .el-tabs__nav-wrap::after{
                            height: 1px;
                            background-color: #EEE;
                        }
                        .el-tabs__item{
                            width: 140px;
                            height: $tabHeight;
                            line-height: $tabHeight;
                            font-size: 16px;
                            text-align: center;
                        }

                    }
                }
                .content{
                    height: calc(100% - #{$tabHeight});
                    padding: 35px;
                    overflow: auto;
                }
            }
        }

        .header-section{
            
            background-color: rgba(27,27,29, .98);
            .header{
                color: white;
                height: $headerHeight;
                font-size: 18px;
                width: $width;
                margin: auto;
                .info{
                    color: #C6C5C5;
                }
                .exit, .exit span{
                    color: inherit;
                    font-size: inherit;
                }
                .separate:before{
                    content: '|';
                    margin: .6em;
                }
            }
        }
    }
    .select-p .el-select-dropdown__item{
        font-size: 18px;
    }
</style>
