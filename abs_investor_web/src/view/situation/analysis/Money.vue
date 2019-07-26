<template>
    <div class="s-money flex-avg">
        <canvas ref="money" height="500" width="1080"/>
    </div>
</template>

<script>

    import ChartLoader       from 'util/chart';

    const MONEY_TYPE = {
        is: type => MONEY_TYPE.type === type,
        type: 'money',
        RANGE_SIZE: 8,
        legend: {
            income: {
                type: 'income',
                label: '收入',
                color: '#7CB4EC',
                hidden: false,
            },
            payout: {
                type: 'payout',
                label: '支出',
                color: '#434347',
                hidden: false,
            },
        },
        getUnit: (() => {
            let UNIT = ' KMGT', KILO = 1000;
            return n => {
                let i = 0;
                while (KILO < (n / Math.pow(KILO, i))) {
                    i++;
                }
                return v => v / Math.pow(KILO, i) + UNIT[i];
            };
        })(),
        getTicks: (max, unit = MONEY_TYPE.getUnit(max)) => ({
            min: -max,
            max,
            stepSize: max / 3,
            callback: unit,
        }),
        buildTicks: max => {
            let i = 0, r, divisor = 3, rate = 0, base = 10;
            while (Math.pow(base, divisor) < (r = max / Math.pow(base, divisor * i))) {
                i++;
            }
            r = r.toFixed(1);
            if(r < divisor){
                rate = -1;
                r = r * base;
            }else if(Math.pow(base, divisor - 1) <= r){
                rate = 1;
                r = parseInt(r / base);
            }
            r += divisor - (r % divisor);
            return MONEY_TYPE.getTicks(r * Math.pow(base, rate + divisor * i));
        }
    },
        dataList = [],
        labelList = [],
        balanceList = [];

    export default {
        data: () => ({$money: undefined}),
        props: {data: Object},
        mounted(){
            ChartLoader.then(Chart => {
                let {type, legend, is, getTicks} = MONEY_TYPE;
                this.$money = new Chart(this.$refs.money, {
                    type: 'bar',
                    data: {
                        labels: labelList,
                        datasets: [
                            {
                                type: 'bar',
                                data: dataList,
                                pointStyle: 'line',
                                $type: type,
                                $legend: legend,
                            },
                            {
                                type: 'line',
                                data: balanceList,
                                fill: false,
                                label: '现金余额',
                                borderWidth: 2,
                                borderColor: '#9CEF8B',
                                pointStyle: 'line',
                                pointRadius: 0,
                                pointHoverRadius: 0,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            xAxes: [
                                {
                                    barThickness: 2,
                                    ticks: {
                                        display: false,
                                    },
                                    gridLines: {
                                        tickMarkLength: 5,
                                        drawOnChartArea: false,
                                    },
                                },
                                {
                                    labels: [],
                                    ticks: {
                                        padding: 5,
                                    },
                                    gridLines: {
                                        display: false,
                                    },
                                }
                            ],
                            yAxes: [
                                {
                                    ticks: getTicks(60),
                                    scaleLabel: {
                                        display: true,
                                        labelString: '金额（元）（k：千   M：百万   G：十亿）',
                                        padding: {
                                            top: 0,
                                            bottom: 40,
                                        }
                                    }
                                },
                            ],
                        },
                        elements: {
                            rectangle: {
                                backgroundColor: ({dataIndex, dataset: {data}}) => _.get(data[dataIndex], 'point.color'),
                            },
                        },
                        tooltips: {
                            callbacks: {
                                label({value, index, yLabel, datasetIndex}, {datasets}){
                                    let {label, data, $type} = datasets[datasetIndex];
                                    return `${is($type) ? _.get(data[index], 'point.label') : label}: ${value}`;
                                },
                            }
                        },
                        legend: {
                            // a callback that will handle
                            onClick(e, item) {
                                let {$data = {}, $item, datasetIndex} = item, {chart} = this,
                                    meta = chart.getDatasetMeta(datasetIndex),
                                    filter = (data, money) => money.hidden && (data.data = _.map(data.data, m => (_.get(m, 'point.type') === money.type) ? undefined : m));

                                if(is($data.$type)){
                                    let {income, payout} = $data.$legend;
                                    $item.hidden = !$item.hidden;
                                    $data.data = dataList;
                                    filter($data, income);
                                    filter($data, payout);
                                    chart.update();
                                    return ;
                                }

                                // See controller.isDatasetVisible comment
                                meta.hidden = meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;

                                // We hid a dataset ... rerender the chart
                                chart.update();
                            },
                            labels: {
                                generateLabels(chart){
                                    let list = [];
                                    _.each(chart.data.datasets, (m, i) => {
                                        let item = {
                                            text: m.label,
                                            hidden: !chart.isDatasetVisible(i),
                                            lineWidth: 4,
                                            pointStyle: m.pointStyle,
                                            strokeStyle: m.borderColor,
                                            datasetIndex: i,
                                        };
                                        list.push(item);
                                        //添加 收入和支出
                                        if(is(m.$type)){
                                            let {income, payout} = m.$legend;
                                            Object.assign(item, {
                                                text: income.label,
                                                $data: m,
                                                $item: income,
                                                $chart: chart,
                                                lineWidth: 14,
                                                pointStyle: item,
                                                strokeStyle: income.color,
                                            });
                                            let payoutItem = {
                                                ...item,
                                                text: payout.label,
                                                $item: payout,
                                                strokeStyle: payout.color,
                                            };
                                            list.push(payoutItem.pointStyle = payoutItem);
                                        }
                                    });
                                    return list;
                                },
                            },
                        },
                    },
                });
            });
        },
        watch: {
            'data'(){
                this.repaint();
            }
        },
        methods: {
            repaint(){
                let balance = 0, {data} = this, clone = (point, {x, y}) => ({point, x, y}),
                    {RANGE_SIZE, legend: {income, payout}, buildTicks} = MONEY_TYPE,
                    a = 0;
                //清空数据
                dataList.length = labelList.length = balanceList.length = 0;

                //合并收入支出数据
                _.each(data.income, (incomeItem, i) => {
                    let payoutItem = data.payout[i];
                    dataList.push(clone(income, incomeItem), clone(payout, payoutItem));
                    labelList.push(incomeItem.x, payoutItem.x);
                    //计算现金余额
                    balanceList.push(balance += incomeItem.y, balance += payoutItem.y);
                });

                //筛选x轴要显示的标签
                let displayLabelList = [], len = Math.ceil(labelList.length / RANGE_SIZE);
                _.each(Array(RANGE_SIZE), (v, i) => {
                    let label = labelList[i * len];
                    label && displayLabelList.push(label);
                });

                //计算y轴比例
                let max = _.max([_.max(_.map(data.income, 'y')), Math.abs(_.min(_.map(data.payout, 'y'))), _.max(_.map(balanceList, b => Math.abs(b)))]);
                //更新数据
                let {scales} = this.$money.options;
                _.merge(_.get(scales, 'yAxes[0].ticks'), buildTicks(max));
                _.set(scales, 'xAxes[1].labels', displayLabelList);
                this.$money.update();
            }
        },
    }

</script>
