const path = require('path');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const through = require('through2-concurrent');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');
const imagemin = require('imagemin');
const plur = require('plur');

const PLUGIN_NAME = 'gulp-imagemin';
const defaultPlugins = ['gifsicle', 'jpegtran', 'optipng', 'svgo'];

const loadPlugin = (plugin, ...args) => {
	try {
		return require(`imagemin-${plugin}`)(...args);
	} catch (error) {
		log(`${PLUGIN_NAME}: Couldn't load default plugin "${plugin}"`);
	}
};

const exposePlugin = plugin => (...args) => loadPlugin(plugin, ...args);

const getDefaultPlugins = () =>
	defaultPlugins.reduce((plugins, plugin) => {
		const instance = loadPlugin(plugin);

		if (!instance) {
			return plugins;
		}

		return plugins.concat(instance);
	}, []);

module.exports = (plugins, options) => {
	if (typeof plugins === 'object' && !Array.isArray(plugins)) {
		options = plugins;
		plugins = null;
	}

	options = {
		// TODO: Remove this when Gulp gets a real logger with levels
		verbose: process.argv.includes('--verbose'),
		...options
	};

	const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

	let totalBytes = 0;
	let totalSavedBytes = 0;
	let totalFiles = 0;

	return through.obj({
		maxConcurrency: 8
	}, (file, encoding, callback) => {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		if (!validExtensions.includes(path.extname(file.path).toLowerCase())) {
			if (options.verbose) {
				log(`${PLUGIN_NAME}: Skipping unsupported image ${chalk.blue(file.relative)}`);
			}

			callback(null, file);
			return;
		}

		const use = plugins || getDefaultPlugins();

		(async () => {
			try {
				const data = await imagemin.buffer(file.contents, {use});
				const originalSize = file.contents.length;
				const optimizedSize = data.length;
				const saved = originalSize - optimizedSize;
				const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
				const savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
				const msg = saved > 0 ? savedMsg : 'already optimized';

				if (saved > 0) {
					totalBytes += originalSize;
					totalSavedBytes += saved;
					totalFiles++;
				}

				if (options.verbose) {
					log(`${PLUGIN_NAME}:`, chalk.green('✔ ') + file.relative + chalk.gray(` (${msg})`));
				}

				file.contents = data;
				callback(null, file);
			} catch (error) {
				callback(new PluginError(PLUGIN_NAME, error, {fileName: file.path}));
			}
		})();
	}, callback => {
		const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		let msg = `Minified ${totalFiles} ${plur('image', totalFiles)}`;

		if (totalFiles > 0) {
			msg += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
		}

		log(`${PLUGIN_NAME}:`, msg);
		callback();
	});
};

module.exports.gifsicle = exposePlugin('gifsicle');
module.exports.jpegtran = exposePlugin('jpegtran');
module.exports.optipng = exposePlugin('optipng');
module.exports.svgo = exposePlugin('svgo');
