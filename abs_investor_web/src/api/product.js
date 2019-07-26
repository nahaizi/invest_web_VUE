/**
 * author   lut000
 * date     2019/05/23
 * purpose  产品要素接口
 * */

import FetchFn            from './baseFetch'
import setParams            from './requestFn'


export default {
    post: (url,data) => FetchFn({
        url,
        options: postMethod(data)
    }),
    get: (url,data) => FetchFn({
        url:url+setParams(data)
    }),

    getProductInfo:(data) => FetchFn({                            //产品明细信息
        url:'product/productInfo'+setParams(data)
    }),
    getTransactionList:(data) => FetchFn({                        //产品明细信息
        url:'product/transactionList'+setParams(data)
    }),
}
