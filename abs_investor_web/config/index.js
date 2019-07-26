const VueLoaderPlugin =     require('vue-loader/lib/plugin');

module.exports = {
    vue: {
        loader: {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                hotReload: false,
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        },
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    babelLoaderIE11: {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: /src|assets|node_module\/element-ui/,
        exclude: /chart.min.js/,
        options: {
            presets: [['@babel/preset-env', {targets: {ie: '10'}}]],
        },
    },
    splitChunks: {
        cacheGroups: {
            commons: {
                test: /node_modules/,
                name: 'vendor',
                chunks: 'all'
            }
        }
    },
};
