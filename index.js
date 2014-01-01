'use strict';
var path = require('path');
var fs = require('graceful-fs');
var map = require('map-stream');
var gutil = require('gulp-util');
var imagemin = require('image-min');
var filesize = require('filesize');
var tempWrite = require('temp-write');

module.exports = function (options) {
	return map(function (file, cb) {
		tempWrite(file.contents, path.extname(file.path), function (err, tempFile) {
			if (err) {
				return cb(new Error('gulp-imagemin: ' + err));
			}

			// workaround: https://github.com/kevva/image-min/issues/8
			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new Error('gulp-imagemin: ' + err));
				}

				var origSize = stats.size;

				imagemin(tempFile, tempFile, options, function (data) {
					fs.readFile(tempFile, function (err, data) {
						if (err) {
							return cb(new Error('gulp-imagemin: ' + err));
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
