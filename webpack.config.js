var HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template:   __dirname + '/app/index.html',
    filename:   'index.html',
    inject:     'body'
});

module.exports = {
    entry: __dirname + '/app/index.js',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    output: {
        filename: 'transformed.js',
        path: __dirname + '/build'
    },
    devServer: {
        contentBase: './build',
        hot: true
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};