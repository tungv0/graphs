const config = require('./webpack.config.js');
const webpack = require('webpack');

const combineLoaders = require('webpack-combine-loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

config.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production")
    }
  })
);

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);

config.plugins.push(
  new ExtractTextPlugin('styles-[hash].css')
);

config.plugins.push (
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
);

config.module.loaders.push (
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      combineLoaders([{
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }])
    )
  }
)

module.exports = config;
