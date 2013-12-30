'use strict';
var path = require('path');
var crypto = require('crypto');
var fs = require('graceful-fs');
var tmpDir = require('os').tmpdir();
var es = require('event-stream');
var gutil = require('gulp-util');
var imagemin = require('image-min');
var filesize = require('filesize');

function randDir() {
	var uid = [process.pid, Date.now(), Math.floor(Math.random() * 1000000)].join('-');
	return crypto.createHash('md5').update(uid).digest('hex');
}

module.exports = function (options) {
	return es.map(function (file, cb) {
		var dest = path.join(tmpDir, randDir(), path.basename(file.path));

		imagemin(file.path, dest, options, function (data) {
			var size = data.sizeRaw;

			fs.readFile(dest, function (err, data) {
				if (err) {
					return cb(new Error('gulp-imagemin: ' + err));
				}

				file.contents = data;

				var saved = data.length - size;
				var savedMsg = saved > 0 ? 'saved ' + filesize(saved, {round: 1}) : 'already optimized';

				gutil.log('gulp-imagemin:', gutil.colors.green('✔ ') + file.relative + gutil.colors.gray(' (' + savedMsg + ')'));

				cb(null, file);
			});
		});
	});
};
