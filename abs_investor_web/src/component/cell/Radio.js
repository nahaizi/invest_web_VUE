import Radio        from '../svg/Radio';

export default {
    functional: true,
    render: c => c('div', {staticClass: 'flex-avg'}, [c(Radio, {props: {size: '15px', startColor: '#52A060', endColor: '#2C6952'}})]),
}
