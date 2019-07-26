import Situation                from 'api/situation';

export default {
    namespaced: true,
    actions: {
        fetchList: (c, id) => Situation.list(id),
        fetchItem: (c, pId, id) => Situation.item(pId, id),
    }
}
