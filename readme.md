# [gulp](http://gulpjs.com)-imagemin [![Build Status](https://travis-ci.org/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-imagemin)

> Minify PNG, JPEG, GIF and SVG images with [image-min](https://github.com/kevva/image-min)

*Issues with the output should be reported on the image-min [issue tracker](https://github.com/kevva/image-min/issues).*


## Install

```bash
$ npm install --save-dev gulp-imagemin
```

On OS X you're recommended to increase the [ulimit](http://superuser.com/a/443168/6877) as it's ridiculously low by default: `ulimit -S -n 2048`


## Usage

```js
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

gulp.task('default', function () {
	return gulp.src('src/image.png')
		.pipe(imagemin({
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('dist'));
});
```


## API

### imagemin(options)

#### use

Type: `Array`  
Default: `null`

Accepts an Array of [plugins](https://npmjs.org/keyword/imageminplugin) to use with image-min.

See the image-min documentation for more [options](https://github.com/kevva/image-min#plugins).


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
