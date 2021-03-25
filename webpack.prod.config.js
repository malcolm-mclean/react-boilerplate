/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const terserPlugin = require('terser-webpack-plugin');

const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_PATH = '/';

module.exports = merge(baseConfig, {
	output: {
		path: DIST_DIR,
		filename: 'static/js/[name].[chunkhash].js',
		chunkFilename: 'static/js/[name].[chunkhash].js',
		publicPath: PUBLIC_PATH
	},
	mode: 'production',
	devtool: 'hidden-source-map',
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false,
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all'
				}
			}
		},
		minimizer: [new terserPlugin()]
	}
});
