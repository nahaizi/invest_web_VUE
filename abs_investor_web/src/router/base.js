import Base from 'view/base';
import home from 'view/base/home'
import list from 'view/base/list'
import blockDetail from 'view/base/blockDetail'
import transactionDetail from 'view/base/transactionDetail'

export default {
    name: 'base',
    path: ':id/base',
    props: true,
    component: Base,
    redirect: {name:'baseHome'},

    children:[
        {
            name: 'baseHome',
            path: 'base_home',
            props: true,
            component: home,
        },
        {
            name: 'list',
            path: 'list',
            props: true,
            component: list,
        },
        {
            name: 'blockDetail',
            path: 'blockDetail',
            props: true,
            component: blockDetail,
        },
        {
            name: 'transactionDetail',
            path: 'transactionDetail',
            props: true,
            component: transactionDetail,
        }
    ]
};
