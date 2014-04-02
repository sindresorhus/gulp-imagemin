'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var concat = require('concat-stream');
var sbuff = require('simple-bufferstream');
var assign = require('object-assign');
var prettyBytes = require('pretty-bytes');
var chalk = require('chalk');
var imagemin = require('image-min');

module.exports = function (options) {
	options = assign({}, options || {});

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
			return cb();
		}

		options.ext = path.extname(file.path).toLowerCase();

		if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(options.ext) === -1) {
			gutil.log('gulp-imagemin: Skipping unsupported image ' + chalk.blue(file.relative));
			this.push(file);
			return cb();
		}

		sbuff(file.contents)
			.pipe(imagemin(options))
			.pipe(concat(function (data) {
				var origSize = file.contents.length;
				var saved = origSize - data.length;
				var savedMsg = saved > 0 ? 'saved ' + prettyBytes(saved) : 'already optimized';

				gutil.log('gulp-imagemin:', chalk.green('✔ ') + file.relative + chalk.gray(' (' + savedMsg + ')'));

				file.contents = data;
				this.push(file);
				cb();
			}.bind(this)));
	});
};
