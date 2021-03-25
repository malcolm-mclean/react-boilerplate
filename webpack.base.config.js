/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_PATH = '/';

module.exports = {
	entry: {
		main: SRC_DIR + '/index.tsx'
	},
	output: {
		path: DIST_DIR,
		filename: 'static/js/[name].[chunkhash].js',
		chunkFilename: 'static/js/[name].[chunkhash].js',
		publicPath: PUBLIC_PATH
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json', '.svg'],
		alias: {
			fonts: path.resolve(__dirname, SRC_DIR, 'fonts'),
			images: path.resolve(__dirname, SRC_DIR, 'images'),
			styles: path.resolve(__dirname, SRC_DIR, 'styles')
		}
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/i,
				include: SRC_DIR,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: miniCssExtractPlugin.loader,
						options: {
							esModule: false
						}
					},
					{ loader: 'css-loader' },
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.(woff(2?)|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/fonts/[name].[chunkhash].[ext]',
							publicPath: PUBLIC_PATH
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/img/[name].[chunkhash].[ext]',
							publicPath: PUBLIC_PATH
						}
					}
				]
			}
		]
	},
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
		}
	},
	plugins: [
		new htmlWebpackPlugin({
			inject: true,
			template: 'src/index.html'
		}),
		new miniCssExtractPlugin({
			filename: 'static/css/[name].[chunkhash].css'
		})
	]
};
