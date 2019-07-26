/**
 * author   lut000
 * date     2019/04/23
 * purpose  用户actions
 * */


export default {
    
    setUserToken ({commit},data){                           //设置用户token
        commit('setUserToken',data);
    },
    setUserInfo ({commit},data){                           //设置用户信息
        commit('setUserInfo',data);
    },
    delUserInfo ({commit},data){                           //删除用户信息
        commit('delUserInfo',data);
    }
}







