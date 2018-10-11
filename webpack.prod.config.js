const config = require('./webpack.config.js');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

config.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production")
    }
  })
);

config.module.loaders.push (
  {
    test: /\.css$/,
    loader: 
      [{
        loader: 'css-loader',
        query: {
          modules: true
        }
      }]
  }
)

module.exports = config;
