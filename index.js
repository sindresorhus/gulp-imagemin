'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
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

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
			return cb();
		}

		if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(path.extname(file.path).toLowerCase()) === -1) {
			if (options.verbose) {
				gutil.log('gulp-imagemin: Skipping unsupported image ' + chalk.blue(file.relative));
			}

			this.push(file);
			return cb();
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

		imagemin.optimize(function (err, data) {
			if (err) {
				this.emit('error', new gutil.PluginError('gulp-imagemin:', err, {fileName: file.path}));
				return cb();
			}

			var originalSize = file.contents.length;
			var optimizedSize = data.contents.length;
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

			file.contents = data.contents;
			this.push(file);

			cb();
		}.bind(this));
	}, function (cb) {
		var percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		var msg = 'Minified ' + totalFiles + ' ';

		msg += totalFiles === 1 ? 'image' : 'images';
		msg += chalk.gray(' (saved ' + prettyBytes(totalSavedBytes) + ' - ' + percent.toFixed(1).replace(/\.0$/, '') + '%)');

		gutil.log('gulp-imagemin:', msg);
		cb();
	});
};
