'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2-concurrent');
const plur = require('plur');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');
const imagemin = require('imagemin');
const defaultPlugins = [];
try {
	defaultPlugins.push(require('imagemin-gifsicle')());
} catch (er) {}
try {
	defaultPlugins.push(require('imagemin-jpegtran')());
} catch (er) {}
try {
	defaultPlugins.push(require('imagemin-optipng')());
} catch (er) {}
try {
	defaultPlugins.push(require('imagemin-svgo')());
} catch (er) {}

module.exports = (plugins, opts) => {
	if (typeof plugins === 'object' && !Array.isArray(plugins)) {
		opts = plugins;
		plugins = null;
	}

	opts = Object.assign({
		// TODO: remove this when gulp get's a real logger with levels
		verbose: process.argv.indexOf('--verbose') !== -1
	}, opts);

	const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

	let totalBytes = 0;
	let totalSavedBytes = 0;
	let totalFiles = 0;

	return through.obj((file, enc, cb) => {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
			return;
		}

		if (validExts.indexOf(path.extname(file.path).toLowerCase()) === -1) {
			if (opts.verbose) {
				gutil.log(`gulp-imagemin: Skipping unsupported image ${chalk.blue(file.relative)}`);
			}

			cb(null, file);
			return;
		}

		const use = plugins || defaultPlugins;

		imagemin.buffer(file.contents, {use})
			.then(data => {
				const originalSize = file.contents.length;
				const optimizedSize = data.length;
				const saved = originalSize - optimizedSize;
				const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
				const savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
				const msg = saved > 0 ? savedMsg : 'already optimized';

				totalBytes += originalSize;
				totalSavedBytes += saved;
				totalFiles++;

				if (opts.verbose) {
					gutil.log('gulp-imagemin:', chalk.green('✔ ') + file.relative + chalk.gray(` (${msg})`));
				}

				file.contents = data;
				cb(null, file);
			})
			.catch(err => {
				cb(new gutil.PluginError('gulp-imagemin:', err, {fileName: file.path}));
			});
	}, cb => {
		const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		let msg = `Minified ${totalFiles} ${plur('image', totalFiles)}`;

		if (totalFiles > 0) {
			msg += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
		}

		gutil.log('gulp-imagemin:', msg);
		cb();
	});
};
