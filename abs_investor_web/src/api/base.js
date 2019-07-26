/**
 * author   lut000
 * date     2019/05/10
 * purpose  底层资产api
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

    getAssetbasicAssetList:(data) => FetchFn({                        //底层资产列表
        url:'assetbasic/assetList'+setParams(data)
    }),
    getAssetbasicAssetInfo:(data) => FetchFn({                        //底层资产-明细信息
        url:'assetbasic/assetInfo'+setParams(data)
    }),
    getAssetbasicTransactionList:(data) => FetchFn({                        //底层资产-交易列表
        url:'assetbasic/transactionList'+setParams(data)
    }),
    
    getProductInfo:(data) => FetchFn({                                //底层资产产品信息
        url:'product/productInfo'+setParams(data),
    }),
    getBlockInfo:(data) => FetchFn({                                  //区块详情
        url:'block/blockInfo'+setParams(data)
    }),
    getBlockList:(data) => FetchFn({                                  //区块详情列表
        url:'block/blockList'+setParams(data)
    }),
    getTransactionDetail:(data) => FetchFn({                          //交易详情
        url:'block/transactionDetail'+setParams(data)
    })
}
