import Vue          from 'vue';
import Vuex         from 'vuex';
import user         from './user';
import home         from './home';
import situation    from './situation';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        home,
        situation,
    },
    getters: {
        userToken: state => state.user.token,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
    }
});
