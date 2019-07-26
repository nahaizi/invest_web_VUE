const fs =                      require('fs');
const config =                  require('./webpack.product.config');
const formatModules =           require('webpack-dashboard/utils/format-modules');
const DashboardPlugin =         require('webpack-dashboard/plugin');

const dashJson = {};

module.exports = {
    ...config,
    optimization: {
        minimize: false,
        namedModules: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        ...config.plugins,
        new DashboardPlugin(arr => {
            arr.forEach(d => {
                if(d.type === 'sizes'){
                    var {assets} = d.value;
                    dashJson.Assets = Object.keys(assets).map(name => ({name, size: assets[name].meta.full}));
                    dashJson.Modules = Object.keys(assets).reduce((memo, name) => Object.assign({}, memo, {[name]: formatModules(assets[name].files)}), {});
                    fs.writeFile('C:\\Users\\lhan\\Desktop\\moduleAnlys\\anlys.js', `var anlys = ${JSON.stringify(dashJson)}`, 'utf8', err => {
                        if(err){
                            throw err;
                        }
                        console.log('dashboard done');
                    });
                }
            });
        })
    ],
};
