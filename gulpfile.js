const {makeCommon} = require('common-exports');

const convertCommon = () => makeCommon(
	'./index.mjs',
	'cjs',
	{
		copyResources: {
			'node_modules/mozjpeg/index.js': [
				{
					src: 'node_modules/mozjpeg/package.json',
					dest: 'cjs/node_modules/mozjpeg/package.json',
					updateContent: content => content.replace('\n\t"type": "module",', ''),
				},
				{
					src: 'node_modules/mozjpeg/vendor',
					dest: 'cjs/node_modules/mozjpeg/vendor',
				},
			],
		},
		customChanges: {
			'node_modules/imagemin-mozjpeg/node_modules/execa/lib/kill.js': [
				{
					updateContent: content => content.replace('import onExit from \'signal-exit\';', 'import { onExit } from \'signal-exit\';'),
				},
			],
			'./index.mjs': [
				{
					updateContent: content => content.replace(
						'export const gifsicle = await exposePlugin(\'gifsicle\');\n'
						+ 'export const mozjpeg = await exposePlugin(\'mozjpeg\');\n'
						+ 'export const optipng = await exposePlugin(\'optipng\');\n'
						+ 'export const svgo = await exposePlugin(\'svgo\');',
						'export const gifsicle = exposePlugin(\'gifsicle\');\n'
						+ 'export const mozjpeg = exposePlugin(\'mozjpeg\');\n'
						+ 'export const optipng = exposePlugin(\'optipng\');\n'
						+ 'export const svgo = exposePlugin(\'svgo\');',
					),
				},
			],
		},
	},
);

exports.convertCommon = convertCommon;
