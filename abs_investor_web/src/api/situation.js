import Fetch            from './index';
import {getMethod}      from 'util/fetch';

let transTreeData = (list, parentId = '') => _.map(list, (node, i) => {
    let id = `${parentId}-${i}`;
    return {...node, id, children: transTreeData(node.tabulationdetaillist, id)};
});

export default {
    list: id => Fetch({
        url: `product/scenariolist${getMethod({productid: id})}`,
        extra: data => _.map(data.itemlist,
            ({scenecode, scenename, scenedetaillist, adjustratelist}) => ({
                id: scenecode,
                name: scenename,
                data: {
                    sit: scenedetaillist,
                    rate: adjustratelist,
                },
            })),
    }),
    item: (pId, id) => Fetch({
        url: `product/scenarioanalysiscalculate${getMethod({productid: pId, scenecode: id})}`,
        extra: data => {
            let trans = (data, {type, list, x, y}) => _.reduce(data, (r, v) => ({...r, [v[type]]: _.map(v[list], m => ({x: m[x], y: m[y]}))}), {}),
                {IN, OUT, BALANCE, DEFAULT} = trans(data.cashchartlist, {type: 'xcode', list: 'datalist', x: 'datadate', y: 'amt'});

            return {
                predict: data.calculationresultlist,
                category: transTreeData(data.tabulationlist),
                sequence: data.timesequencelist,
                repay: {
                    list: _.map(data.paymentlist, m => ({label: m.secname, list: m.paymentdetaillist})),
                    total: data.cashintotol,
                    multiple: data.princoveragerate,
                },
                money: {
                    income: IN,
                    payout: OUT,
                    balance: BALANCE,
                    disobey: DEFAULT,
                },
                statistic: {
                    stock: trans(data.secpaymentlist, {type: 'seccode', list: 'detaillist', x: 'paymentdate', y: 'oddprinrate'}),
                    assets: trans(data.assetpoolpaymentlist, {type: 'xcode', list: 'prinamtlist', x: 'paymentdate', y: 'prinamt'}),
                },
            }
        },
    }),
}
