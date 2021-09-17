const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        build: ['core-js/stable', 'regenerator-runtime/runtime', './src/renderer/main.js']
    },
    output: {
        path: path.resolve(__dirname, './src/renderer/build'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(gif|jpg|png|svg|ico|eot|woff|woff2|pdf|txt)$/,
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, './src/renderer'),
                    name: '[path][name].[ext]?[fullhash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/renderer')
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new VueLoaderPlugin()
    ],
    externals: ['better-sqlite3'],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            })
        ]
    },
    performance: {
        hints: false
    }
}
