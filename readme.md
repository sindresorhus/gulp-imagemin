# [gulp](http://gulpjs.com)-imagemin [![Build Status](https://travis-ci.org/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-imagemin)

> Minify PNG, JPEG and GIF images with [image-min](https://github.com/kevva/image-min)

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

gulp.task('default', function () {
	gulp.src('src/image.png')
		.pipe(imagemin())
		.pipe(gulp.dest('dist'));
});
```


## API

### imagemin(options)

See the image-min [options](https://github.com/kevva/image-min#options).


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
