module.exports = {
	plugins: [
		'@babel/plugin-transform-modules-commonjs',
	],
	presets: [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: {version: '3.6', proposals: true},
				targets: {node: 'current'},
			},
		],
	],
};
