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
		path: __dirname + '/fixture.png',
		contents: fs.readFileSync('fixture.png')
	}));
});

it('should skip unsupported images', function (cb) {
	var stream = imagemin();
	var mockBuffer = new Buffer('unsupported');

	stream.on('data', function (file) {
		assert.strictEqual(file.contents, mockBuffer);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.bmp',
		contents: mockBuffer
	}));
});

it('should skip empty files', function (cb) {
	var stream = imagemin();

	stream.on('data', function (file) {
		assert.strictEqual(file.contents, null);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.bmp'
	}));
});

it('should not log when in silent mode', function (cb) {
	var oldLog = gutil.log;

	gutil.log = function () {
		oldLog.apply(gutil, arguments);
		assert(false, "Should not have called gutil.log");
	}

	var stream = imagemin({ silent : true });

	stream.on('end', function (file) {
		gutil.log = oldLog;
		cb();
	});

	// Supported file
	stream.write(new gutil.File({
		path: __dirname + '/fixture.png',
		contents: fs.readFileSync('fixture.png')
	}));

	// Unsupported file
	stream.write(new gutil.File({
		path: __dirname + '/fixture.bmp',
		contents: new Buffer('mocked')
	}));

	stream.end();
});
