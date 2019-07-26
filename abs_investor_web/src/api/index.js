import Notify                           from 'component/notify';
import {handleResponseType}             from 'util/fetch';
import {createNamespacedHelpers}        from 'vuex'
import store from '../store/index'

const RESULT = {
        200: ({data, extra, resolve}) => resolve(extra(data)),
        401: ({code, extra, resolve}) => {
            store.dispatch('user/delUserInfo',{})
            window.location.href=location.protocol+'//'+window.location.host+'/#/login';
        },
        default: r => r.handleError ? Notify.warning({message: r.msg || '系统异常请联系管理员！'}) : r.reject(r),
    };

export default ({url, base = '/abs_asset', extra = _.identity, handleError = true, options}) => {

    let req = new Request(`${base}/${url}`, {credentials: 'same-origin', ...options});

    return new Promise((resolve, reject) => fetch(req)
        .then(r => r.ok ? handleResponseType(r) : Promise.reject(r))
        .then(r => (RESULT[r.code] || RESULT.default)({...r, extra, reject, resolve, handleError}))
        .catch(e => Notify.error({message: `${e.status} ${e.statusText}`}))
    );

};
