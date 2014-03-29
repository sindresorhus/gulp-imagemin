'use strict';
var path = require('path');
var gutil = require('gulp-util');
var map = require('map-stream');
var filesize = require('filesize');
var imagemin = require('image-min');
var extend = require('xtend')
var concat = require('concat-stream');

module.exports = function (options) {
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
		}

		var opts = extend(options);
		if (!opts.ext) {
			opts.ext = path.extname(file.path).toLowerCase();
		}

		if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(opts.ext) === -1) {
			gutil.log('gulp-imagemin: Skipping unsupported image ' + gutil.colors.blue(file.relative));
			return cb(null, file);
		}

		var im = imagemin(opts)
			.pipe(concat({encoding: 'buffer'}, function(data) {
				var origSize = file.contents.length;
				var saved = origSize - data.length;
				var savedMsg = saved > 0 ? 'saved ' + filesize(saved, {round: 1}) : 'already optimized';

				gutil.log('gulp-imagemin:', gutil.colors.green('✔ ') + file.relative + gutil.colors.gray(' (' + savedMsg + ')'));

				file.contents = data;
				cb(null, file);
			}))

		im.write(file);
		im.end();
	});
};
