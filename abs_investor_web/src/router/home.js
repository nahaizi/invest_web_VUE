import Home             from  'view/Home';
import Main             from  'view/main';
import MainList         from  'view/main/mainList';
import MainHashDetail   from  'view/base/transactionDetail';
import MainBlockDetail  from  'view/base/blockDetail';
import Assets           from  'view/assets';
import Document         from  'view/document';
import Situation        from  'view/situation';
import base             from  './base';

const name = 'home';
export default {
    name,
    path: `/${name}`,
    component: Home,
    children: [
        base,
        {
            name: 'main',
            path: ':id/main',
            props: true,
            component: Main,
        },
        {
            name: 'mainList',
            path: ':id/mainList',
            props: true,
            component: MainList,
        },
        {
            name: 'mainHashDetail',
            path: ':id/mainHashDetail',
            props: true,
            component: MainHashDetail,
        },
        {
            name: 'mainBlockDetail',
            path: ':id/mainBlockDetail',
            props: true,
            component: MainBlockDetail,
        },
        {
            name: 'assets',
            path: ':id/assets',
            props: true,
            component: Assets,
        },
        {
            name: 'document',
            path: ':id/document',
            props: true,
            component: Document,
        },
        {
            name: 'situation',
            path: ':id/situation',
            props: true,
            component: Situation,
        },
    ]
}
