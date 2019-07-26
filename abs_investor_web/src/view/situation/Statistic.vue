<template>
    <div class="s-statistic flex-avg f-between">
        <div><canvas ref="stock" width="500" height="500"/></div>
        <div><canvas ref="assets" width="500" height="500"/></div>
    </div>
</template>

<script>

    import ChartLoader, {OPTIONS}       from 'util/chart';
    import {COLUMNS, findColumns}       from 'common/constant';

    let columns = COLUMNS.situation.statistic;

    const UNIT = ['', '万', '亿', '兆'], UNIT_STEP = 4, STEP = [1, 2, 5], AXES_STEP = 4,
        options = {
            layout: {
                padding: {
                    top: 0,
                    left: 0,
                    right: 10,
                    bottom: 20,
                },
            },
        },
        gridLines = {
            tickMarkLength: -5,
        },
        yAxes = {
            tickMarkLength: 20,
            rightTickMarkLength: 20,
        },
        lineMap = {
            stock: findColumns('acbd', columns),
            assets: findColumns('efgh', columns),
        },
        percentCallback = v => `${v * 100}%`;

    export default {
        data: () => ({$stock: undefined, $assets: undefined}),
        props: {data: Object},
        mounted(){

            ChartLoader.then(Chart => {

                this.$stock = new Chart(this.$refs.stock, OPTIONS.line({
                    type: 'curve',
                    title: '各级证券偿付图',
                    xAxes: {
                        gridLines,
                    },
                    yAxes: {
                        ...yAxes,
                        yTitle: '剩余本金占比',
                        ticks: {
                            step: AXES_STEP,
                            stepSize: .25,
                            callback: percentCallback,
                        },
                    },
                    lines: lineMap.stock,
                }, {
                    ...options,
                    tooltips: {
                        callbacks: {
                            label: ({yLabel, datasetIndex}, {datasets}) => `${_.get(datasets[datasetIndex], 'label')}: ${percentCallback(yLabel)}`,
                        }
                    }
                }));

                this.$assets = new Chart(this.$refs.assets, OPTIONS.line({
                    type: 'curve',
                    title: '资产池偿付走势图',
                    xAxes: {
                        gridLines,
                    },
                    yAxes: {
                        ...yAxes,
                        yTitle: '剩余本金(亿元)',
                        ticks: {
                            step: AXES_STEP,
                            stepSize: 10,
                        },
                        rightTicks: {
                            step: AXES_STEP,
                            stepSize: .02,
                            callback: percentCallback,
                        },
                    },
                    lines: lineMap.assets,
                }, options));

            });

        },
        methods: {
            getUnit(){
                let val = _.max(_.map(_.map(this.data.assets, v => _.maxBy(v, 'y')), 'y')), i = 0;
                for (; 0 < val;){
                    for(let s of STEP){
                        let max = Math.pow(10, i) * s;
                        if(val < max){
                            return {max, pow: i};
                        }
                    }
                    i++;
                }
            },
            getLostAssetsAxes(){
                let max = _.max(_.map(_.get(this.data.assets, columns.h.prop), 'y')) || 0;
                //8% 20% 40%
                let steps = [.08, .2, .4];
                for (let s of steps){
                    if(max < s){
                        return s;
                    }
                }
                return _.last(steps);
            }
        },
        watch: {
            'data'(){
                //update data
                let {data} = this;
                _.each(lineMap, (lines, type) => {
                    let chart = this[`$${type}`];
                    _.each(lines, ({prop}, i) => {
                        _.set(chart.data, `datasets[${i}].data`, _.get(data, [type, prop], []));
                    });
                    _.set(chart.data, `labels`, _.map(_.get(data, [type, lines[0].prop]), 'x'));
                    let {max = 0, pow = 0} = this.getUnit();
                    if(type === 'assets'){
                        let {scales} = chart.config.options, index = Math.floor(pow / UNIT_STEP), laaMax = this.getLostAssetsAxes();
                        //设置资产偿付图左边坐标
                        _.set(scales, 'yAxes[3].label', `剩余本金(${UNIT[index]}元)`);
                        _.merge(_.get(chart.config.options.scales, 'yAxes[0].ticks'), {
                            max,
                            stepSize: max / AXES_STEP,
                            callback: v => v / Math.pow(10, index * UNIT_STEP),
                        });
                        //设置资产偿付图右边坐标
                        _.merge(_.get(chart.config.options.scales, 'yAxes[2].ticks'), {
                            max: laaMax,
                            stepSize: laaMax / AXES_STEP,
                        });
                    }
                    chart.update();
                });
            }
        },
    }

</script>

<style lang="scss">
    @import "../../../assets/variable";
    .s-statistic{
        border: 1px solid $borderColor;
        padding: 15px;
    }
</style>
