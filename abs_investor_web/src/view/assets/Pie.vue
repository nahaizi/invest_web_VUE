<template>
    <div class="pie-c">
        <canvas ref="pie" width="180" height="180"/>
        <div class="p-label">
            <div v-for="item in pieItemList">
                <span class="p-item pointer" :style="{color: item.color}" :class="{active: item.hidden}" @click="toggle(item)">
                    <span class="p-key">{{item.key}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import filters                                  from 'common/filter';
    import ChartLoader                              from 'util/chart';

    const COLORS = [
            'rgb(101,146,221)',
            'rgb(201,68,81)',
            'rgb(162,88,238)',
            'rgb(241,159,77)',
            'rgb(104,232,240)',
            'rgb(127,176,80)',
            'rgb(249,170,121)',
            'rgb(246,201,69)',
            'rgb(77,182,248)',
            'rgb(162,88,238)',
            'rgb(44,105,82)',
            'rgb(198,60,98)',
            'rgb(205,154,91)',
            'rgb(64,131,94)',
            'rgb(99,67,79)',
            'rgb(243,113,92)',
            'rgb(179,109,65)',
            'rgb(43,100,71)',
            'rgb(125,88,134)',
            'rgb(167,87,59)',
            'rgb(223,148,100)',
            'rgb(0,88,49)',
            'rgb(64,28,68)',
            'rgb(170,33,22)',
            'rgb(183,111,64)',
            'rgb(0,108,84)',
            'rgb(71,45,86)',
            'rgb(182,69,51)',
            'rgb(173,139,61)',
            'rgb(55,88,48)',
            'rgb(69,34,74)',
            'rgb(181,67,52)',
            'rgb(222,163,44)',
            'rgb(39,77,61)',
            'rgb(65,20,69)',
            'rgb(133,63,4)',
            'rgb(209,146,63)',
            'rgb(55,88,48)',
            'rgb(75,47,61)',
        ],
        {percent} = filters;

    export default {
        data: () => ({$pie: undefined, pieItemList: []}),
        props: {
            list: Array,
            prop: String,
            label: String,
        },
        mounted(){
            ChartLoader.then(Chart => {
                this.$pie = new Chart(this.$refs.pie, {
                    type: 'doughnut',
                    data:  {
                        labels: [],
                        datasets: [{
                            data: [],
                            borderWidth: 0,
                            backgroundColor: COLORS,
                        }],
                    },
                    options: {
                        legend: {display: false},
                        rotation: -70 * Math.PI / 180,
                        cutoutPercentage: 55,
                        tooltips: {
                            callbacks: {
                                label({index, datasetIndex}, {labels, datasets}) {
                                    return ` ${_.get(datasets[datasetIndex], ['data', index])}%`;
                                }
                            }
                        }
                    }
                });
                this.repaint();
            });
        },
        watch: {
            list(list){
                this.repaint();
            }
        },
        methods: {
            repaint(){
                let {$pie, prop, label, list} = this, values = [], labels = [];
                //set legend item
                this.pieItemList = _.map(list, (m, index) => {
                    let val = m[prop], key = m[label], color = COLORS[index];
                    labels.push(key);
                    values.push(percent(val));
                    return {key, val, index, color, hidden: false};
                });
                //set pie chart
                _.set($pie.data, 'labels', labels);
                _.set($pie.data.datasets, '[0].data', values);
                $pie.update();
            },
            toggle(item){
                let {$pie} = this, legendItem = $pie.getDatasetMeta(0).data[item.index];
                legendItem.hidden = item.hidden = !legendItem.hidden;
                $pie.update();
            }
        },
    }
</script>

<style lang="scss">

    @import "../../../assets/variable";
    .pie-c{
        canvas{
            margin: auto;
        }
        .p-label{
            margin-top: 30px;
            padding-left: 100px;
        }
        .p-item{
            margin: 3px 0;
            display: inline-block;
            position: relative;
            font-size: 14px;
            &:before{
                content: '';
                top: .2em;
                left: -15px;
                width: 15px;
                height: 15px;
                position: absolute;
                background: currentColor;
            }
            &.active .p-key{
                text-decoration: line-through;
            }
        }
        .p-key{
            color: $labelColor;
            margin: 0 20px;
        }
        .p-val{
            color: #333;
        }
    }

</style>
