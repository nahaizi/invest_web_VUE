const config =                  require('../webpack.config');
const Webpack =                 require('webpack');
const {babelLoaderIE11} =       require('./index');

module.exports = {
    ...config,
    module: {
        rules: [
            ...config.module.rules.filter(r => r.use !== 'babel-loader'),
            babelLoaderIE11,
        ]
    },
    plugins: [
        new Webpack.DefinePlugin({
            IS_IE: true,
        }),
        ...config.plugins,
    ]
};
