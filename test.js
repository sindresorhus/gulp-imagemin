'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var imagemin = require('./index');

it('should minify images', function (cb) {
	var stream = imagemin();

	stream.on('data', function (file) {
		assert(file.contents.length < fs.statSync('fixture.png').size);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.png'
	}));
});
