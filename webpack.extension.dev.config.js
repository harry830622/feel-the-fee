const path = require('path');
const { merge } = require('webpack-merge');

const base = require('./webpack.extension.base.config');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist-extension'),
    publicPath: '/',
  },
});
