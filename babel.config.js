module.exports = {
	presets: [
		'@babel/preset-typescript',
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'entry'
			}
		],
		'@babel/preset-react'
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
