const buildVuexMutations = state => Object.keys(state).reduce((r, k) => Object.assign(r, {[k]: (s, v) => s[k] = v}), {});


export {
    buildVuexMutations,
}
