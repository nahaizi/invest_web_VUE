const config =                          require('./webpack.product.config');
const Webpack =                         require('webpack');
const EmptyLoader =                     require('./plugin/EmptyLoader');
const {IEHtmlWebpackPlugin} =           require('./plugin/HtmlWebpackPlugin');
const {vue, plugins, babelLoaderIE11} = require('./index');

const {path} = config.output;

module.exports = {
    ...config,
    module: {
        rules: [
            vue.loader,
            babelLoaderIE11,
            {
                test: /\.(s?css|jpg|jpeg|png|gif|ico|svg)$/,
                loader: EmptyLoader.loader,
            }
        ],
    },
    plugins: [
        ...plugins,
        new Webpack.DefinePlugin({
            IS_IE: true,
        }),
        new IEHtmlWebpackPlugin({
            path,
            template: `${path}/index.html`
        })
    ]
};
