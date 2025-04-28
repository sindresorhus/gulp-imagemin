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
		console.error(`${PLUGIN_NAME}: Could not load default plugin \`${pluginName}\`: ${error.message}`);
		return null; // Return null to skip faulty plugins
	}
};

const exposePlugin = async plugin => (...arguments_) => loadPlugin(plugin, ...arguments_);

const getDefaultPlugins = async () => {
	const plugins = await Promise.all(defaultPlugins.map(async plugin => {
		if (plugin === 'gifsicle') {
			return loadPlugin('gifsicle', {interlaced: true, optimizationLevel: 2});
		}

		if (plugin === 'mozjpeg') {
			return loadPlugin('mozjpeg', {quality: 90, progressive: true});
		}

		if (plugin === 'optipng') {
			return loadPlugin('optipng', {optimizationLevel: 3}); // Safer level
		}

		if (plugin === 'svgo') {
			return loadPlugin('svgo', {
				plugins: [{
					name: 'preset-default',
					params: {
						overrides: {
							removeViewBox: false,
						},
					},
				}],
			});
		}

		return null;
	}));
	return plugins.filter(plugin => plugin !== null); // Filter out failed plugins
};

const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg']);

export default function gulpImagemin(plugins, options) {
	if (typeof plugins === 'object' && !Array.isArray(plugins)) {
		options = plugins;
		plugins = undefined;
	}

	options = {
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

		const localPlugins = Array.isArray(plugins)
			? await Promise.all(plugins)
			: await getDefaultPlugins();

		// Filter out any null plugins (failed to load)
		const validPlugins = localPlugins.filter(plugin => plugin !== null);

		if (validPlugins.length === 0) {
			console.warn(`${PLUGIN_NAME}: No valid plugins loaded for ${file.relative}, skipping optimization`);
			return file;
		}

		try {
			const data = await imagemin.buffer(file.contents, {plugins: validPlugins});
			const originalSize = file.contents.length;
			const optimizedSize = data.length;

			// Basic integrity check: Ensure the optimized file is not empty or unreasonably small
			if (optimizedSize < 100) {
				console.warn(`${PLUGIN_NAME}: Optimized image ${file.relative} is suspiciously small (${optimizedSize} bytes), skipping`);
				return file;
			}

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
		} catch (error) {
			console.error(`${PLUGIN_NAME}: Error optimizing ${file.relative}: ${error.message}`);
			// Skip optimization and return the original file to avoid corruption
			return file;
		}

		return file;
	}, {
		async * onFinish() {
			if (!options.silent) {
				const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
				let message = `Minified ${totalFiles} ${plur('image', totalFiles)}`;

				if (totalFiles > 0) {
					message += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
				}

				console.log(`${PLUGIN_NAME}:`, message);
			}

			yield; // Satisfy generator requirement
		},
	});
}

export const gifsicle = await exposePlugin('gifsicle');
export const mozjpeg = await exposePlugin('mozjpeg');
export const optipng = await exposePlugin('optipng');
export const svgo = await exposePlugin('svgo');
