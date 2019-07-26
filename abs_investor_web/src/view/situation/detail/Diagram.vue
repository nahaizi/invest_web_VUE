<template>
    <div class="ld flex-avg f-between">
        <div><canvas ref="sit" width="500" height="530"/></div>
        <div><canvas ref="rate" width="500" height="530"/></div>
    </div>
</template>

<script>

    import ChartLoader, {OPTIONS}           from 'util/chart';
    import {COLUMNS, findColumns}           from 'common/constant';

    let columns = COLUMNS.situation.sit;

    export default {
        data: () => ({$sit: undefined, $rate: undefined}),
        props: {data: Object},
        mounted(){

            let {sit, rate} = this.data, max = this.getMaxAxesValue(sit),
                mergeOptions = opts => OPTIONS.line(_.merge({
                    legendLabel: {
                        lineWidth: 2,
                        pointStyle: 'lineCircle',
                    },
                    xAxes: {
                        ticks: {
                            fontSize: 14,
                        },
                    },
                    yAxes: {
                        hasAxes: true,
                    },
                }, opts));

            ChartLoader.then(Chart => {

                this.$sit = new Chart(this.$refs.sit, mergeOptions({
                    title: '情景参数',
                    lines: this.getLines(sit, 'bcd'),
                    xAxes: {
                        labels: _.map(sit, columns.a.prop),
                    },
                    yAxes: {
                        xTitle: '期',
                        rightTickMarkLength: 20,
                        ticks: {
                            //最大值[25%, 50%]
                            stepSize: max / 5,
                        },
                    },
                }));

                this.$rate = new Chart(this.$refs.rate, mergeOptions({
                    title: '利率参数',
                    lines: this.getLines(rate, 'f'),
                    xAxes: {
                        labels: _.map(rate, columns.e.prop),
                        ticks: {
                            labelOffset: 60,
                        },
                    },
                    yAxes: {
                        xTitle: '年',
                        ticks: {
                            stepSize: .03,
                        },
                    },
                }));

            });

        },
        methods: {
            getLines(data, fields){
                return _.map(findColumns(fields, columns), ({label, prop, borderColor}) => ({
                    data: _.map(data, prop),
                    label,
                    borderColor,
                }));
            },
            getMaxAxesValue(list){
                let {b, c, d} = columns, max = _.max(_.map(list, item => _.max([b, c, d].map(({prop}) => item[prop])))) || 0;
                return max < .5 ? .25 : .5;
            }
        },
    }

</script>

<style lang="scss">

</style>
