/**
 * author   lut000
 * date     2019/05/10
 * purpose  用户api
 * */

import FetchFn            from './baseFetch';
import setParams            from './requestFn'
export default {
    
    loginIn:(data) => FetchFn({                        //登录
        url:'user/login',
        methods:'post',
        data
    }),
    loginOut:(data) => FetchFn({                        //登出
        url:'user/logout',
        methods:'post',
        data
    }),
    getUserInfo:(data) => FetchFn({                     //获取用户信息
        url:'user/userinfo'+setParams(data)
    }),
    getImgCode:(data) => FetchFn({                        //底层资产-交易列表
        url:'/user/captcha'+setParams(data)
    })
}
