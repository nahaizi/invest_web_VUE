import Home                     from 'api/home';

export default {
    actions: {
        fetchProjects: Home.projects,
        fetchMain: (c, id) => Home.main(id),
        fetchAssets: (c, id) => Home.assets(id),
        fetchAssetsItem: (c, {pId, id}) => Home.assetsItem(pId, id),
        fetchDocument: (c, id) => Home.document(id),
    }
}
