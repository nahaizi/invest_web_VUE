import Vue          from 'vue';
import Router       from 'vue-router';

import home         from './home';
import Login        from 'view/Login';
import NotFound     from 'view/NotFound';
Vue.use(Router);
export default new Router({
    routes: [
        home,
        {
            name: 'login',
            path: '/login',
            component: Login
        },
        {
            path: '/404',
            component: NotFound
        },
        {
            path: '',
            hidden: true,
            redirect: {path: '/home'}
        },
        {
            path: '*',
            hidden: true,
            redirect: '/404'
        }
    ]
});
