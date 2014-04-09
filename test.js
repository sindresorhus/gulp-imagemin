'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var imagemin = require('./index');

it('should minify an image buffer', function (cb) {
	this.timeout(40000);

	var stream = imagemin();
	var contents = fs.readFileSync('fixture.png');
	var size = contents.length;

	stream.on('data', function (file) {
		var newSize = file.contents.length;

		assert(newSize < size, newSize + ' < ' + size);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.png',
		contents: contents
	}));
});

it('should minify an image stream', function (cb) {
	this.timeout(40000);

	var stream = imagemin();
	var contents = fs.createReadStream('fixture.png');

	stream.on('data', function (file) {
		assert.notStrictEqual(file.contents, contents);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.png',
		contents: contents
	}));
});

it('should skip null files', function (cb) {
	var stream = imagemin();

	stream.on('data', function (file) {
		assert.strictEqual(file.contents, null);
		cb();
	});

	stream.write(new gutil.File());
});

it('should skip unsupported images', function (cb) {
	var stream = imagemin();
	var contents = new Buffer(0);

	stream.on('data', function (file) {
		assert.strictEqual(file.contents, contents);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.bmp',
		contents: contents
	}));
});
