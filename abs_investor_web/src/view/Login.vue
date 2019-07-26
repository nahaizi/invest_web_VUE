<template>
    <div class="login">
        <header class="header">
            <div class="w-1200">
                <Logo />
                <span>区块链资产证券化平台</span>
            </div>
        </header>
        <section class="body">
            <div class="w-1200 content-section">
                <div class="txt-div">
                    <h3>普云链 | ABS投资人平台</h3>
                    <p>打造“区块链+金融"资产证券云平台，为投资人提供准确、实时的信息披露，辅助做好投后管理，助您全面把控资产风险。</p>
                </div>
                <div class="form-div">
                    <el-form class="form login-form" ref="form" :model="user" :rules="rules">
                        <h3>登录</h3>
                        <el-form-item prop="username">
                            <el-input class="input-area"  v-model.trim="user.username" prefix-icon="el-icon-account" maxlength="128" placeholder="用户名"/>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input class="input-area" v-model.trim="user.password" prefix-icon="el-icon-password" maxlength="32" placeholder="密码" type="password"/>
                        </el-form-item>
                        <el-form-item class="img-code-item" prop="captcha">
                            <el-input class="input-area" v-model.trim="user.captcha" @keyup.enter.native="submitFunc" prefix-icon="el-icon-img-code" maxlength="6" placeholder="验证码"></el-input>
                            <img class="img-code" :src="imgPath" @click="getImgCode" alt="img-code">
                        </el-form-item>
                        <el-button class="submit-btn" @click="submitFunc">登录</el-button>
                    </el-form>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Logo from 'component/Logo';
    import { createNamespacedHelpers } from 'vuex'
    const { mapActions } = createNamespacedHelpers('user')
    import DataApi from '@/api/user'
    export default {
        components: {Logo},
        name:'login',
        data: function (){ 
            return {
                isSubmitting:false,
                isGetting:false,
                user: {
                    username: '',
                    captcha: '',
                    password: '',
                },
                uuid:'',                                        //前端随机串
                imgPath:'',

                rules:{
                    'username':[
                        {validator:this.generalCell,msg:'请输入用户名',trigger: 'blur'}
                    ],
                    'password':[
                        {validator:this.generalCell,msg:'请输入密码',trigger: 'blur'}
                    ],
                    'captcha':[
                        {validator:this.generalCell,msg:'请输入验证码',trigger: 'blur'}
                    ]
                }
            }
        },
        created(){
            this.getImgCode();
        },
        methods: {
            ...mapActions(['setUserInfo','setUserToken']),
            submitFunc(){                                               //提交登录
                this.$refs['form'].validate((valid) => {
                    if(valid){
                        
                        this.loginIn();
                    }else{
                        console.log('前端校验失败！');
                        return false;
                    }
                })
            },
            loginIn (){
                if(this.isSubmitting==true){return}
                this.isSubmitting=true;
                let params={
                    username:this.user.username,
                    password:this.user.password,
                    captcha:this.user.captcha.toLocaleUpperCase()
                }
                DataApi.loginIn(params).then(
                    res => {
                        if(res.code==200){
                            this.setUserToken({
                                token:res.data.token
                            });
                            this.$router.push({
                                path:'/home'
                            });
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.data.msg?res.data.msg:'系统异常请联系管理员！'
                            });
                            if(res.code!=100){
                                this.getImgCode();
                            }
                        }
                        this.isSubmitting=false;
                    },

                    err => {
                        this.$message({
                            type:'error',
                            message:'网络似乎出现了问题，请稍后再试'
                        })
                        this.isSubmitting=false;
                    }
                )
                
            },
            getImgCode (){
                this.uuid='random-number-'+Math.random();
                let path='/abs_asset/user/captcha?width=100&height=26&t='+(new Date()).getTime()+'.png';
                this.imgPath=path;

                // if(this.isGetting==true){return}
                // this.isGetting=true;
                
                // DataApi.getImgCode({
                //     uuid:this.uuid
                // }).then(
                //     res => {
                //         console.log(res)
                //         if(res){
                //             this.imgPath=res.data.image || '';
                //         }
                //         this.isGetting=false;
                //     }
                // )
            },

            generalCell(rule, val, callback) {                             //基础函数-一般字段
                if (this.isSpaceVal(val)) {
                    this.showMsg(rule.msg);
                    callback(' ');
                } else {
                    callback();
                }
            },
            showMsg (txt){                                      //提示信息
                this.$message({
                    type:'warning',
                    message:txt
                })
            },
            isSpaceVal(val) {                           //验证值是否为空或者不可用
                return val == '' || val == undefined || val == null
            },
        }
    }

</script>
<style lang="scss">
    @import "~@assets/user/login";
</style>

<style lang="scss" scoped>
    html,body,body *{margin: 0;padding: 0;}
    .login{
        min-width: 1200px;
        min-height: 100vh;
        background-image: url(~@assets/imgs/user/login-bg.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        .header{
            padding-top: 30px;
            padding-bottom: 30px;
            color: #fff;
            background-color: rgba(10,10,10,0.5);
            span{
                display: inline-block;
                font-size: 18px;
                margin-left: 15px;
                vertical-align: middle;
            }
        }
        .content-section{
            display: flex;
            align-items : center;
            justify-content: space-between;
            padding-top: 210px;
            padding-bottom: 100px;
        }
        .txt-div{
            width: 670px;
            h3{
                font-size: 59px;
                font-weight: 500;
                margin-bottom: 48px;
                color: #F5C045;
            }
            p{
                font-size: 22px;
                line-height: 40px;
                font-family: 'Adobe Heiti Std R';
                color: #D3D3D3;
            }
        }
        .w-1200{
            width: 1200px;
            margin: auto;
        }
        .form-div{
            width: 373px;
            border-radius: 6px;
            background-color: #fff;
        }

        .form{
            padding: 25px 25px 34px;
            h3{
                font-size: 27px;
                margin-bottom: 27px;
                color: #333;
                text-align: center;
            }

            .input-area{
                height: 45px;
                line-height: 45px;
                border-radius: 45px;
                overflow: hidden;
                margin-bottom: 12px;
            }

            .img-code-item{
                position: relative;
            }
            .img-code{
                z-index: 10;
                position: absolute;
                right: 0;
                width: 120px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                cursor: pointer;
                border-radius: 0px 45px 45px 0
            }
            .submit-btn{
                display: block;
                width: 74.5%;
                height: 50px;
                line-height: 50px;
                padding: 0px;
                margin: 15px auto 0;
                line-height: 50px;
                font-size: 22px;
                color: #fff;
                background-color: #F5C045;
                border-radius: 50px;
                outline: none;
                border: none;
            }
            
        }
    }

</style>
