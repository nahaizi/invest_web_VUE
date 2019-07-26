const percent = value => isNaN(parseFloat(value)) ? undefined : (parseFloat(value) * 100).toFixed(2);

export default {
    percent,
}
