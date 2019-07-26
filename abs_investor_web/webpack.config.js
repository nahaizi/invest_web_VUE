const path =                    require('path');
const Webpack =                 require('webpack');
const VueLoaderPlugin =         require('vue-loader/lib/plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');
const MiniCssExtractPlugin =    require('mini-css-extract-plugin');

const distPath = path.join(__dirname, './dist'), port = 3000;

module.exports = {
    mode: 'development',
    entry: './main.js',
    devtool: 'source-map',
    context: path.resolve(__dirname, './src'),
    output: {
        path: distPath,
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[hash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
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
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@': path.resolve('src'),
            '@assets': path.resolve(__dirname, 'assets'),
        },
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules',
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new Webpack.ProvidePlugin({
            _: 'lodash',
        }),
        new Webpack.DefinePlugin({
            IS_IE: false,
        }),
        new HtmlWebpackPlugin({
            path: distPath,
            template: './index.dev.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: 'vendor-[hash].css'
        }),
    ],
    devServer: {
        port,
        host: '0.0.0.0',
        open: `http://localhost:${port}`,
        stats: {
            hash: false,
            builtAt: false,
            version: false,
            modules: false,
            children: false,
            entrypoints: false,
            colors: {
                green: '\u001b[32m',
                yellow: '\u001b[32m',
            }
        },
        proxy: {
            '/': {
                target: 'https://abst.glpfin.com',
                changeOrigin: true
            }
        },
        inline: true,
        compress: false,
        disableHostCheck: true,
        historyApiFallback: true,
    }
};
