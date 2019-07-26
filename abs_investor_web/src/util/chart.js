let chart,
    axesColor = '#8F8E8E',
    PointStyle = {
        lineCircle({ctx, radius, x, y, rotation, drawPoint}) {
            let {PI} = Math, circleRadius = 5;

            //draw line
            drawPoint(ctx, 'line', radius, x, y, rotation);

            //draw circle
            ctx.clearRect(x - circleRadius, y - ctx.lineWidth, 2 * circleRadius, 2 * circleRadius);
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, 2 * PI);
            ctx.stroke();
        },
        money({ctx, radius, x, y, rotation, drawPoint, item}){
            //draw line
            drawPoint(ctx, 'line', radius, x, y, rotation);
            //draw cross line
            let {$item: {label, hidden}, $chart: {config: {options}}} = item;
            if(hidden){
                let xLeft = 14, {legend: {labels: {fontSize}}, defaultFontColor} = options,
                    textWidth = label.length * fontSize;
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = defaultFontColor;
                ctx.moveTo(x + xLeft, y);
                ctx.lineTo(x + xLeft + textWidth, y);
                ctx.stroke();
                ctx.restore();
            }
        }
    },
    lineConfig = {
        type: {
            line: {
                fill: false,
                lineTension: 0,
                borderWidth: 2,
                pointRadius: 2.5,
                pointBackgroundColor: 'white',
            },
            curve: {
                fill: false,
                pointStyle: 'line',
                pointRadius: 0,
                borderWidth: 2,
                borderColor: '#C36865',
            },
        },
        getTicks: ticks => ({
            min: 0,
            max: ticks.stepSize * (ticks.step || 5),
            ...ticks,
        }),
    };

export const OPTIONS = {
    line(config, options){

        let id = 'yAxesId',
            {getTicks} = lineConfig,
            {type = 'line', title, xAxes, yAxes, lines, legendLabel} = config,
            {ticks, hasAxes, xTitle, yTitle, rightTicks, tickMarkLength = 5, rightTickMarkLength} = yAxes,
            yAxesLabel = {
                id,
                ticks: getTicks(ticks),
                gridLines: {
                    drawBorder: false,
                    tickMarkLength,
                }
            },
            yAxesList = [yAxesLabel];

        if(hasAxes){
            yAxesList.unshift({
                ticks: {
                    ...yAxesLabel.ticks,
                    display: false,
                },
                gridLines: {
                    color: axesColor,
                    drawTicks: false,
                    drawBorder: true,
                    drawOnChartArea: false,
                },
            });
        }
        if(!_.isUndefined(rightTickMarkLength)){
            yAxesList.push({
                position: 'right',
                ticks: {
                    ...yAxesLabel.ticks,
                    display: false,
                },
                gridLines: {
                    drawOnChartArea: false,
                    tickMarkLength: rightTickMarkLength,
                }
            });
        }
        if(rightTicks){
            yAxesList.push({
                ticks: getTicks(rightTicks),
                position: 'right',
                gridLines: {
                    display: false,
                },
            });
        }
        if(!_.isUndefined(xTitle)){
            yAxesList.push({
                type: 'category',
                labels: ['', xTitle],
                position: 'right',
                gridLines: {
                    display: false,
                },
            });
        }
        if(!_.isUndefined(yTitle)){
            yAxesList.push({
                type: 'yAxesTitle',
                label: yTitle,
            });
        }

        return {
            type: 'line',
            data: {
                datasets: _.map(lines, label => ({
                    yAxisID: id,
                    ...lineConfig.type[type],
                    ...label,
                }))
            },
            options: {
                title: {text: title, display: true},
                legend: {
                    labels: {
                        generateLabels(chart){
                            return _.map(chart.data.datasets, (m, i) => ({
                                text: m.label,
                                hidden: !chart.isDatasetVisible(i),
                                lineDash: m.pointStyle === 'dash' ? [8, 4] : [],
                                lineWidth: 4,
                                pointStyle: 'line',
                                strokeStyle: m.borderColor,
                                datasetIndex: i,
                                ...legendLabel,
                            }));
                        },
                    },
                },
                scales: {
                    xAxes: [{
                        type: 'category',
                        labels: xAxes.labels,
                        ticks: {
                            padding: 12 - _.get(xAxes.gridLines, 'tickMarkLength', tickMarkLength),
                            ...xAxes.ticks,
                        },
                        gridLines: {
                            tickMarkLength,
                            drawOnChartArea: false,
                            ...xAxes.gridLines,
                        },
                    }],
                    yAxes: yAxesList,
                },
                ...options,
            },
        };

    }
};

export default import(/* webpackChunkName: "chart.js" */'chart.js/dist/Chart.bundle').then(({default: Chart}) => {
    if(!chart){

        let {defaults, scaleService, canvasHelpers} = Chart;
        //config
        let {scale, global} = defaults;
        Object.assign(scale.ticks, {
            padding: 20,
        });
        Object.assign(scale.gridLines, {
            color: '#CAC8C8',
            drawBorder: false,
            zeroLineColor: axesColor,
        });
        Object.assign(global, {
            responsive: false,
            defaultFontSize: 16,
            defaultFontColor: '#888',
            defaultFontFamily: `'Microsoft YaHei', '微软雅黑', ${global.defaultFontFamily}`,
        });
        Object.assign(global.title, {
            padding: 40,
            fontSize: 18,
            fontColor: '#333',
            fontStyle: 'normal',
        });
        Object.assign(global.legend, {
            position: 'bottom',
            labels: {
                ...global.legend.labels,
                padding: 30,
                fontSize: 14,
                usePointStyle: true,
            },
        });

        //extend
        scaleService.registerScaleType('yAxesTitle',
            scaleService.getScaleConstructor('category').extend({
                draw() {
                    let ctx = this.chart.ctx, {top, right} = this, {label, fontSize = 14} = this.options;
                    ctx.save();
                    ctx.font = `${fontSize}px ${global.defaultFontFamily}`;
                    ctx.fillStyle = global.defaultFontColor;
                    ctx.textBaseline = "bottom";
                    // change origin
                    ctx.translate(right, top - global.title.padding);
                    // rotate text
                    ctx.fillText(label, 0, 0);
                    ctx.restore();
                }
            })
        );

        //add pointStyle
        let {drawPoint} = canvasHelpers;
        canvasHelpers.drawPoint = (ctx, style, radius, x, y, rotation) => {
            let method = _.get(style, '$data.$type', style);
            PointStyle[method] ? PointStyle[method]({ctx, radius, x, y, rotation, item: style, drawPoint}) : drawPoint(ctx, style, radius, x, y, rotation)
        }

    }
    return chart = Chart;
});
