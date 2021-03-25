module.exports = {
	presets: [
		'@babel/preset-typescript',
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'entry',
				corejs: '3'
			}
		],
		[
			'@babel/preset-react',
			{
				runtime: 'automatic'
			}
		]
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		[
			'babel-plugin-jsx-remove-data-test-id',
			{
				attributes: 'data-test'
			}
		]
	]
};
