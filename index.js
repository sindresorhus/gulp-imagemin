'use strict';
var path = require('path');
var fs = require('graceful-fs');
var gutil = require('gulp-util');
var map = require('map-stream');
var filesize = require('filesize');
var tempWrite = require('temp-write');
var imagemin = require('image-min');

module.exports = function (options) {
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
		}

		if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(path.extname(file.path).toLowerCase()) === -1) {
			gutil.log('gulp-imagemin: Skipping unsupported image ' + gutil.colors.blue(file.relative));
			return cb(null, file);
		}

		tempWrite(file.contents, path.basename(file.path), function (err, tempFile) {
			if (err) {
				return cb(new gutil.PluginError('gulp-imagemin', err));
			}

			// workaround: https://github.com/kevva/image-min/issues/8
			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new gutil.PluginError('gulp-imagemin', err));
				}

				var origSize = stats.size;

				imagemin(tempFile, tempFile, options, function () {
					fs.readFile(tempFile, function (err, data) {
						if (err) {
							return cb(new gutil.PluginError('gulp-imagemin', err));
						}

						var saved = origSize - data.length;
						var savedMsg = saved > 0 ? 'saved ' + filesize(saved, {round: 1}) : 'already optimized';

						gutil.log('gulp-imagemin:', gutil.colors.green('✔ ') + file.relative + gutil.colors.gray(' (' + savedMsg + ')'));

						file.contents = data;
						cb(null, file);
					});
				});
			});
		});
	});
};
