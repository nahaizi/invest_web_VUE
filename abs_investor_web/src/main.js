import Vue          from 'vue';

import assets       from '../assets';
import App          from './App';
import store        from './store';
import router       from './router';
import filters      from './common/filter';

_.each(filters, (filter, name) => Vue.filter(name, filter));

if(assets){}

new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App)
});
