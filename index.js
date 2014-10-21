'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2-concurrent');
var assign = require('object-assign');
var prettyBytes = require('pretty-bytes');
var chalk = require('chalk');
var Imagemin = require('imagemin');

module.exports = function (options) {
	options = assign({}, options || {});
	options.verbose = process.argv.indexOf('--verbose') !== -1;

	var totalBytes = 0;
	var totalSavedBytes = 0;
	var totalFiles = 0;
	var validExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
			return;
		}

		if (validExts.indexOf(path.extname(file.path).toLowerCase()) === -1) {
			if (options.verbose) {
				gutil.log('gulp-imagemin: Skipping unsupported image ' + chalk.blue(file.relative));
			}

			cb(null, file);
			return;
		}

		var imagemin = new Imagemin()
			.src(file.contents)
			.use(Imagemin.gifsicle({interlaced: options.interlaced}))
			.use(Imagemin.jpegtran({progressive: options.progressive}))
			.use(Imagemin.optipng({optimizationLevel: options.optimizationLevel}))
			.use(Imagemin.svgo({plugins: options.svgoPlugins || []}));

		if (options.use) {
			options.use.forEach(imagemin.use.bind(imagemin));
		}

		imagemin.run(function (err, files) {
			if (err) {
				cb(new gutil.PluginError('gulp-imagemin:', err, {fileName: file.path}));
				return;
			}

			var originalSize = file.contents.length;
			var optimizedSize = files[0].contents.length;
			var saved = originalSize - optimizedSize;
			var percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
			var savedMsg = 'saved ' + prettyBytes(saved) + ' - ' + percent.toFixed(1).replace(/\.0$/, '') + '%';
			var msg = saved > 0 ? savedMsg : 'already optimized';

			totalBytes += originalSize;
			totalSavedBytes += saved;
			totalFiles++;

			if (options.verbose) {
				gutil.log('gulp-imagemin:', chalk.green('✔ ') + file.relative + chalk.gray(' (' + msg + ')'));
			}

			file.contents = files[0].contents;
			cb(null, file);
		});
	}, function (cb) {
		var percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		var msg = 'Minified ' + totalFiles + ' ';

		msg += totalFiles === 1 ? 'image' : 'images';
		msg += chalk.gray(' (saved ' + prettyBytes(totalSavedBytes) + ' - ' + percent.toFixed(1).replace(/\.0$/, '') + '%)');

		gutil.log('gulp-imagemin:', msg);
		cb();
	});
};
