var HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template:   __dirname + '/app/index.html',
    filename:   'index.html',
    inject:     'body'
});

module.exports = {
    entry: ['./app/index.js'],
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
        path: path.join(__dirname, '/build'),
        publicPath: '/',
        filename: 'transformed.js'
    },
    devServer: {
        contentBase: './build',
        hot: true
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};