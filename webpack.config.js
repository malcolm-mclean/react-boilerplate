'use strict';
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_PATH = '/';

module.exports = {
	entry: {
		main: SRC_DIR + '/index.tsx',
	},
	output: {
		path: DIST_DIR,
		filename: 'static/js/[name].[hash].js',
		chunkFilename: 'static/js/[name].[hash].js',
		publicPath: '/'
	},
	resolve: {
		extensions: [
			'.ts',
			'.tsx',
			'.js',
			'.json',
			'.svg'
		]
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
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
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: 'css-loader' },
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/fonts/[name].[hash].[ext]',
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
							name: 'static/img/[name].[ext]',
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
		},
		minimizer: [new TerserPlugin()]
	},
	devServer: {
		contentBase: DIST_DIR,
		compress: true,
		hot: true,
		progress: true,
		port: 8080,
		open: true,
		watchOptions: {
			ignored: /node_modules/
		}
	},
	plugins: [
		new htmlWebpackPlugin({
			inject: true,
			template: 'src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.[hash].css'
		}),
		new webpack.HotModuleReplacementPlugin()
	]
};