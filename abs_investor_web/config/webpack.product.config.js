const config =                  require('../webpack.config');
const Webpack =                 require('webpack');
const HtmlWebpackPlugin =       require('./plugin/HtmlWebpackPlugin').default;
const CopyWebpackPlugin =       require('copy-webpack-plugin');
const CleanWebpackPlugin =      require('clean-webpack-plugin');
const MiniCssExtractPlugin =    require('./plugin/MiniCssExtractPlusPlugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const {vue, plugins} =          require('./index');
const {output, devServer} =     config;

module.exports = {
    ...config,
    mode: 'production',
    stats: devServer.stats,
    devtool: false,
    externals: {vue: 'Vue', vuex: 'Vuex', lodash: '_', 'vue-router': 'VueRouter', 'element-ui': 'ELEMENT'},
/*    optimization: {
        minimize: false,
        namedModules: true,
    },*/
    module: {
        rules: [
            vue.loader,
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(eot?.+|svg?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
                use: 'file-loader?name=assets/[name].[hash:8].[ext]'
            },
            {
                test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
                use: [
                    // if less than 10Kb, bundle the asset inline, if greater, copy it to the dist/assets
                    // folder using file-loader
                    'url-loader?limit=10240&name=assets/[name].[hash:8].[ext]'
                ],
            }
        ],
    },
    plugins: [
        ...plugins,
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{from: '../assets/vendor.js', to: '../dist/assets'}]),
        new MiniCssExtractPlugin({filename: '[name]-[hash].css'}),
        new OptimizeCSSAssetsPlugin(),
        new Webpack.DefinePlugin({
            IS_IE: false,
        }),
        new HtmlWebpackPlugin({
            path: output.path,
            template: './index.prod.html',
        }),
    ],
};
