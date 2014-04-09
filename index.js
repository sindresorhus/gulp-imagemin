'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var concat = require('concat-stream');
var assign = require('object-assign');
var prettyBytes = require('pretty-bytes');
var chalk = require('chalk');
var imagemin = require('image-min');

var log = gutil.log.bind(gutil, 'gulp-imagemin:');

module.exports = function (options) {
	options = assign({}, options || {});

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		options.ext = path.extname(file.path).toLowerCase();

		if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(options.ext) === -1) {
			log('Skipping unsupported image ' + chalk.blue(file.relative));
			this.push(file);
			return cb();
		}

		var size;
		file.pipe(concat(function (data) {
			size = data.length
		}));

		file.pipe(imagemin(options))
			.pipe(concat(function (data) {
				var newSize = data.length;
				var message;

				if (newSize === 0) {
					message = 'could not be optimized';
				}
				else if (newSize < size) {
					// replace file contents with optimized data
					file.contents = data;
					message = 'saved ' + prettyBytes(size - newSize);
				}
				else {
					message = 'already optimized';
				}

				log(chalk.green('✔ ') + file.relative + chalk.gray(' (' + message + ')'));

				this.push(file);
				cb();
			}.bind(this)));
	});
};
