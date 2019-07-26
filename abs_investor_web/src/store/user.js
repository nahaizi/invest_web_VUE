/**
 * author   lut000
 * date     2019/04/23
 * purpose  用户state状态管理
 * */

import mutations from './mutations/user'
import actions from './actions/user'
let state = {
    userInfo: {name: '投资人'},                          //用户信息
    isLogin: false,                                     //是否登录
    token: '',                                          //登录用户token
};
export default {
    namespaced: true,
    state,
    getters: {
        
    },
    mutations,
    actions
}