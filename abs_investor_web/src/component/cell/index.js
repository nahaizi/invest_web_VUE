import Tip          from './Tip';
import Date         from './Date';
import Enum         from './Enum';
import Radio        from './Radio';
import Anchor       from './Anchor';
import Default      from './Default';
import Percent      from './Percent';
import Currency     from './Currency';

let components = {
    Tip,
    Date,
    Enum,
    Radio,
    Anchor,
    Default,
    Percent,
    Currency,
};

export default {
    props: {
        data: Object,
        field: Object,
        empty: {
            type: String,
            default: '-'
        }
    },
    functional: true,
    render: (createElement, {props: {data = {}, empty, field}, children}) => {
        return createElement(
            components[_.get(field, 'type', 'Default')],
            {props: {...field, value: _.get(data, field.prop, empty), data, empty}},
            children
        )
    }
}
