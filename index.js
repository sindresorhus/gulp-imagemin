import path from 'node:path';
import process from 'node:process';
import prettyBytes from 'pretty-bytes';
import chalk from 'chalk';
import imagemin from 'imagemin';
import plur from 'plur';
import {gulpPlugin} from 'gulp-plugin-extras';

const PLUGIN_NAME = 'gulp-imagemin';
const defaultPlugins = ['gifsicle', 'mozjpeg', 'optipng', 'svgo'];

const loadPlugin = async (pluginName, ...arguments_) => {
	try {
		const {default: plugin} = await import(`imagemin-${pluginName}`);
		return plugin(...arguments_);
	} catch (error) {
		console.log('er', error);
		console.log(`${PLUGIN_NAME}: Could not load default plugin \`${pluginName}\``);
	}
};

const exposePlugin = async plugin => (...arguments_) => loadPlugin(plugin, ...arguments_);

const getDefaultPlugins = async () => Promise.all(defaultPlugins.flatMap(plugin => loadPlugin(plugin)));

const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg']);

export default function gulpImagemin(plugins, options) {
	if (typeof plugins === 'object' && !Array.isArray(plugins)) {
		options = plugins;
		plugins = undefined;
	}

	options = {
		// TODO: Remove this when Gulp gets a real logger with levels
		silent: process.argv.includes('--silent'),
		verbose: process.argv.includes('--verbose'),
		...options,
	};

	let totalBytes = 0;
	let totalSavedBytes = 0;
	let totalFiles = 0;

	return gulpPlugin('gulp-imagemin', async file => {
		if (!validExtensions.has(path.extname(file.path).toLowerCase())) {
			if (options.verbose) {
				console.log(`${PLUGIN_NAME}: Skipping unsupported image ${chalk.blue(file.relative)}`);
			}

			return file;
		}

		if (Array.isArray(plugins)) {
			plugins = await Promise.all(plugins);
		}

		const localPlugins = plugins ?? await getDefaultPlugins();
		const data = await imagemin.buffer(file.contents, {plugins: localPlugins});
		const originalSize = file.contents.length;
		const optimizedSize = data.length;
		const saved = originalSize - optimizedSize;
		const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
		const savedMessage = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
		const message = saved > 0 ? savedMessage : 'already optimized';

		if (saved > 0) {
			totalBytes += originalSize;
			totalSavedBytes += saved;
			totalFiles++;
		}

		if (options.verbose) {
			console.log(`${PLUGIN_NAME}:`, chalk.green('✔ ') + file.relative + chalk.gray(` (${message})`));
		}

		file.contents = Buffer.from(data);

		return file;
	}, {
		async * onFinish() { // eslint-disable-line require-yield
			if (!options.silent) {
				const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
				let message = `Minified ${totalFiles} ${plur('image', totalFiles)}`;

				if (totalFiles > 0) {
					message += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
				}

				console.log(`${PLUGIN_NAME}:`, message);
			}
		},
	});
}

export const gifsicle = await exposePlugin('gifsicle');
export const mozjpeg = await exposePlugin('mozjpeg');
export const optipng = await exposePlugin('optipng');
export const svgo = await exposePlugin('svgo');
