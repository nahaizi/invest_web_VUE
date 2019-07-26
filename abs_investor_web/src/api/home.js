import Fetch            from './index';
import {getMethod}      from 'util/fetch';

export default {
    main: id => Fetch({
        url: `product/productIndex${getMethod({productId: id})}`,
        extra: data => ({
            base: data,
            stock: data.securitiesInitInfoList,
            payment: _.map(data.securitiesPaymentRateList, m => ({name: m.abscode, value: `${m.payrate * 100}%`})),
            stepList: _.map(data.productLifeList, (m, i) => ({date: m.lifeDate, title: m.lifeName, active: i < parseInt(data.process || '1')})),
            stockCurrent: {date: _.get(data, 'reportDate', ''), list: data.securitiesCurrentInfoList},
            org: _.reduce(data.underwritinggroup, (r, {groupType, groupName}, prop) => {
                r.data[prop] = groupName;
                r.headers.push({prop, label: groupType});
                return r;
            }, {width: 8, data: {}, headers: []}),
        }),
    }),
    assets: id => Fetch({url: `assetpool/featurecountandamt${getMethod({productId: id})}`}),
    document: id => Fetch({
        url: `product/doc${getMethod({productId: id})}`,
        extra: data => _.reduce(data, (r, {url, name, type, typeName}) => {
            let item = r[type] || (r[type] = {id: type, name: typeName, children: []});
            if(url){
                item.children.push({id: item.children.length, url, name});
            }
            return r;
        }, {}),
    }),
    assetsItem: (pId, id) => Fetch({
        url: `assetpool/feature${getMethod({productId: pId, featurecode: id})}`,
        extra: data => data.items.map((m, id) => ({id, ...m})),
    }),
    projects: () => Fetch({
        url: `product/getProductList`,
        extra: data => data.map(m => ({
            id: m.productId + '',
            name: m.productName,
            date: m.issueDate,
            amount: m.issueScale,
        })),
    }),
}
