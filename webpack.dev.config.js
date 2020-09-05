'use strict';
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');

const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_PATH = '/';

module.exports = merge(baseConfig, {
	output: {
		path: DIST_DIR,
		filename: 'static/js/[name].[hash].js',
		chunkFilename: 'static/js/[name].[hash].js',
		publicPath: PUBLIC_PATH,
	},
	devtool: 'eval-source-map',
	mode: 'development',
	devServer: {
		contentBase: DIST_DIR,
		compress: true,
		hot: true,
		progress: true,
		port: 8080,
		open: true,
		historyApiFallback: true,
		watchOptions: {
			ignored: /node_modules/,
		},
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
});
