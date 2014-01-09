'use strict';
var path = require('path');
var fs = require('graceful-fs');
var gutil = require('gulp-util');
var through = require('through');
var filesize = require('filesize');
var tempWrite = require('temp-write');
var imagemin = require('image-min');

module.exports = function (options) {
	return through(function (file) {
		if (file.isNull()) {
			return this.queue(file);
		}

		if (file.isStream()) {
			return this.emit('error', new gutil.PluginError('gulp-imagemin', 'Streaming not supported'));
		}

		if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(path.extname(file.path)) === -1) {
			gutil.log('gulp-imagemin: Skipping unsupported image ' + gutil.colors.blue(file.relative));
			return this.queue(file);
		}

		var self = this;

		tempWrite(file.contents, path.extname(file.path), function (err, tempFile) {
			if (err) {
				return self.emit('error', new gutil.PluginError('gulp-imagemin', err));
			}

			// workaround: https://github.com/kevva/image-min/issues/8
			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return self.emit('error', new gutil.PluginError('gulp-imagemin', err));
				}

				var origSize = stats.size;

				imagemin(tempFile, tempFile, options, function (data) {
					fs.readFile(tempFile, function (err, data) {
						if (err) {
							return self.emit('error', new gutil.PluginError('gulp-imagemin', err));
						}

						var saved = origSize - data.length;
						var savedMsg = saved > 0 ? 'saved ' + filesize(saved, {round: 1}) : 'already optimized';

						gutil.log('gulp-imagemin:', gutil.colors.green('✔ ') + file.relative + gutil.colors.gray(' (' + savedMsg + ')'));

						file.contents = data;
						self.queue(file);
					});
				});
			});
		});
	});
};
