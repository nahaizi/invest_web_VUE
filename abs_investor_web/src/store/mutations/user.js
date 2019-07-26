/**
 * author   lut000
 * date     2019/04/23
 * purpose  用户mutations
 * */


export default {
    setUserToken (state,data){                           //设置用户token
        state.token=data.token;
        state.isLogin=true;
        localStorage.setItem('user',JSON.stringify({
            token:data.token,
            isLogin:true
        }))
    },
    setUserInfo (state,data){                           //设置用户信息
        // 存储用户信息
        state.userInfo=data;
        // 优先取localStorage的数据
        let user=localStorage.getItem('user');
        let token=user?JSON.parse(user).token:state.token;
        localStorage.setItem('user',JSON.stringify({
            userInfo:data,
            token,
            isLogin:true
        }))
    },
    delUserInfo (state,data){                           //退出登录
        state.userInfo=null;
        state.isLogin=false;
        state.token='';
        localStorage.removeItem('user');
    },
}







