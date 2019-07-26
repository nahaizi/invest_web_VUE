// import {STATUS}     from 'components/constants';

let STATUS;

export default {
    functional: true,
    render(createElement, {props: {value, type}, parent}){
        let enums = Object.assign({}, STATUS, parent.$store.getters.dictionary);
        return createElement('span', _.get(enums[type.enumClass], value));
    }
}
