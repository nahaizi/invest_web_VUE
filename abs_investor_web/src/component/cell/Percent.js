import filters      from 'common/filter';

export default {
    functional: true,
    render(createElement, {props: {data, prop, empty}}){
        let val = filters.percent(data[prop]);
        return createElement('span', val ? `${val}%` : empty);
    }
}
