const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const terserPlugin = require('terser-webpack-plugin');

const DIST_DIR = path.join(__dirname, 'dist');

module.exports = merge(baseConfig, {
	output: {
		path: DIST_DIR,
		filename: 'static/js/[name].[hash].js',
		chunkFilename: 'static/js/[name].[hash].js',
		publicPath: '/',
	},
	mode: 'none',
	devtool: 'hidden-source-map',
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false,
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
		minimizer: [new terserPlugin()],
	},
});
