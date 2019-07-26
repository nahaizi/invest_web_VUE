const MENUS = [
    {
        name: 'main',
        label: '产品要素'
    },
    {
        name: 'assets',
        label: '资产池'
    },
    {
        name: 'document',
        label: '产品文档'
    },
    {
        name: 'situation',
        label: '情景分析'
    },
    {
        name: 'base',
        label: '底层资产'
    },
];

const COLUMNS = {
    main: {
        form: {
            a: {
                prop: 'productName',
                type: 'Tip',
                label: '产品简称',
            },
            b: {
                prop: 'productTypeName',
                label: '产品类型',
            },
            c: {
                prop: 'assetTypeName',
                label: '基础资产类型',
            },
            d: {
                prop: 'tradingPlace',
                label: '交易场所',
            },
            e: {
                prop: 'regulatoryAuthority',
                label: '监管机构',
            },
            f: {
                prop: 'productStatusName',
                label: '产品状态',
            },
            g: {
                prop: 'issueScale',
                label: '发行规模（亿元）',
            },
            h: {
                prop: 'recruitmentMethod',
                label: '募集方式',
            },
            i: {
                prop: 'cyclePurchase',
                label: '循环购买',
            },
            j: {
                prop: 'issueDate',
                label: '产品成立日',
            },
            k: {
                prop: 'legalDueDate',
                label: '法定到期日',
            },
            t: {
                type: 'Anchor',
                text: '查看',
                label: '区块链信息',
            }
        },
        table: {
            a: {
                prop: 'securitiesName',
                width: 80,
                label: '证券简称',
            },
            b: {
                prop: 'securitiesCode',
                width: 100,
                label: '证券代码',
            },
            c: {
                prop: 'lvlAmount',
                width: 150,
                label: '分档金额(万元)',
            },
            d: {
                prop: 'amountProportion',
                type: 'Percent',
                label: '金额占比',
            },
            e: {
                prop: 'rateType',
                label: '利率类型',
            },
            f: {
                prop: 'baseRates',
                type: 'Percent',
                label: '基准利率',
            },
            g: {
                prop: 'floatingValue',
                type: 'Percent',
                label: '浮动值',
            },
            h: {
                prop: 'rateSpread',
                type: 'Percent',
                label: '利差',
            },
            i: {
                prop: 'issueRate',
                type: 'Percent',
                label: '发行利率',
            },
            j: {
                prop: 'reimbursementMethod',
                label: '偿付方式',
            },
            k: {
                prop: 'expectedPeriod',
                label: '预计期限(年)',
            },
            l: {
                prop: 'averagePeriod',
                label: '平均期限(年)',
            },
            m: {
                prop: 'lvl',
                type: 'Tip',
                label: '评级',
                tipProp: 'lvlDetail',
            },
            n: {
                prop: 'securitiesName',
                width: 80,
                label: '证券名称',
            },
            o: {
                prop: 'unpaidAmount',
                width: 150,
                label: '未偿金额(万元)',
            },
            p: {
                prop: 'unpaidAmountProportion',
                type: 'Percent',
                label: '未偿金额占比',
            },
            q: {
                prop: 'currentRates',
                type: 'Percent',
                label: '当前利率',
            },
            r: {
                prop: 'lvl',
                type: 'Tip',
                label: '跟踪评级',
                tipProp: 'lvlDetail',
            },
            s: {
                prop: 'cdr',
                label: 'CDR临界值',
            },
            t: {
                prop: 'principalCoverage',
                type: 'Percent',
                label: '本金覆盖率',
            },
            u: {
                prop: 'interestCoverage',
                type: 'Percent',
                label: '利息覆盖率',
            },
        },
    },
    assets: {
        form: {
            a: {
                prop: 'borrowersum',
                label: '承租人数量',
            },
            b: {
                prop: 'contractsum',
                label: '租赁合同笔数',
            },
            c: {
                prop: 'principalamt',
                label: '资产池本金余额(万元)',
            },
            d: {
                prop: 'permaxprincipalamt',
                label: '单笔租赁合同最高本金余额(万元)',
            },
            e: {
                prop: 'peravgprincipalamt',
                label: '单笔租赁合同平均本金余额(万元)',
            },
            f: {
                prop: 'contractprincipaltotal',
                label: '合同本金总额(万元)',
            },
            g: {
                prop: 'permaxprincipaltotal',
                label: '单笔租赁合同最高本金总额(万元)',
            },
            h: {
                prop: 'peravgprincipaltotal',
                label: '单笔租赁合同平均本金总额(万元)',
            },
            i: {
                prop: 'weightingavgrate',
                label: '加权平均利率(%)',
            },
            j: {
                prop: 'weightingavgterm',
                label: '加权平均租赁合同期限(天)',
            },
            k: {
                prop: 'weightingavgoddterm',
                label: '加权平均租赁合同剩余期限(天)',
            },
            l: {
                prop: 'permaxoddterm',
                label: '单笔租赁合同最长剩余期限(天)',
            },
            m: {
                prop: 'perminoddterm',
                label: '单笔租赁合同最短剩余期限(天)',
            },
            n: {
                prop: 'assetnormalrate',
                label: '正常类资产占比(%)',
            },
        },
        table: {
            a: {
                prop: 'featuretype',
                label: '资产池所在省份',
            },
            b: {
                prop: 'assetcount',
                width: 70,
                label: '资产数量',
            },
            c: {
                prop: 'assetcountrate',
                type: 'Percent',
                width: 100,
                label: '资产数量占比(%)',
            },
            d: {
                prop: 'oddamt',
                label: '剩余金额(元)',
            },
            e: {
                prop: 'oddamtrate',
                type: 'Percent',
                width: 100,
                label: '剩余金额占比(%)',
            },
            f: {
                prop: 'peravgoddamt',
                label: '平均每笔余额(元)',
            },
        },
    },
    situation: {
        sit: {
            a: {
                prop: 'term',
                label: '期数',
            },
            b: {
                prop: 'defaultrate',
                label: '违约率',
                borderColor: '#377A32',
            },
            c: {
                prop: 'racoveryrate',
                label: '回收率',
                borderColor: '#67757F',
            },
            d: {
                prop: 'prepayrate',
                label: '提前还款率',
                borderColor: '#C36865',
            },
            e: {
                prop: 'adjustdate',
                label: '调整日期',
            },
            f: {
                prop: 'adjustrate',
                label: '调整利率',
                borderColor: '#C06B68',
            },
        },
        predict: {
            a: {
                prop: 'secname',
                label: '分档',
            },
            b: {
                prop: 'prinrate',
                label: '本金覆盖率',
            },
            c: {
                prop: 'avgterm',
                label: '平均期限(年)',
            },
            d: {
                prop: 'yiledrate',
                label: '到期收益率',
            },
        },
        category: {
            a: {
                prop: 'object',
                label: '对象',
            },
            b: {
                prop: 'type',
                label: '类型',
            },
            c: {
                prop: 'happendate',
                label: '明细发生日',
            },
            d: {
                prop: 'shouldamt',
                label: '应收支额(元)',
            },
            e: {
                prop: 'ableamt',
                label: '可收支额(元)',
            },
        },
        repay: {
            a: {
                prop: 'paydate',
                label: '兑付日期',
            },
            b: {
                prop: 'prinamt',
                label: '本金(元)',
            },
            c: {
                prop: 'intamt',
                label: '利息(元)',
            },
            d: {
                prop: 'prinrate',
                label: '本息覆盖率',
            },
        },
        sequence: {
            a: {
                prop: 'direction',
                label: '方向',
            },
            b: {
                prop: 'paydate',
                label: '日期',
            },
            c: {
                prop: 'happenamt',
                label: '发生金额(元)',
            },
            d: {
                prop: 'accountbalance',
                label: '账户余额(元)',
            },
            e: {
                prop: 'profitAccountBalance',
                label: '收益账户余额(元)',
            },
            f: {
                prop: 'principalAccountBalance',
                label: '本金账户余额(元)',
            },
            g: {
                prop: 'targetname',
                label: '对象',
            },
            h: {
                prop: 'typename',
                label: '类型',
            },
            i: {
                prop: 'paydate',
                label: '明细发生日',
            },
            j: {
                prop: 'payamounttotal',
                label: '应收支额(元)',
            },
            k: {
                prop: 'payable',
                label: '可收支额(元)',
            },
        },
        statistic: {
            a: {
                prop: 'pr',
                label: '优先档',
                borderColor: '#C36865',
            },
            b: {
                prop: 'ir',
                label: '次级档',
                borderColor: '#2C6952',
            },
            c: {
                prop: 'prplan',
                label: '优先档计划',
                pointStyle: 'dash',
                borderDash: [16, 4],
                borderColor: '#C36865',
            },
            d: {
                prop: 'irplan',
                label: '次级档计划',
                pointStyle: 'dash',
                borderDash: [8, 2],
                borderColor: '#75B380',
            },
            e: {
                prop: 'assetpool',
                label: '资产池',
            },
            f: {
                prop: 'assetpoolplan',
                label: '资产池计划',
                pointStyle: 'dash',
                borderDash: [8, 2],
                borderColor: '#80B98A',
            },
            g: {
                prop: 'sec',
                label: '证券',
                pointStyle: 'dash',
                borderDash: [8, 2],
                borderColor: '#2C6952',
            },
            h: {
                prop: 'default',
                label: '资产池累计损失率',
                borderColor: '#D6AF47',
            },
        },
    },
};

const findColumns = (ids, columns) => ids.split('').map(id => ({...columns[id]}));


export {
    MENUS,
    COLUMNS,
    findColumns,
}
