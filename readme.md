# [gulp](https://github.com/wearefractal/gulp)-imagemin [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-imagemin.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-imagemin)

> Minify PNG, JPEG and GIF images with [image-min](https://github.com/kevva/image-min)

*Issues with the output should be reported on the image-min [issue tracker](https://github.com/kevva/image-min/issues).*


## Install

Install with [npm](https://npmjs.org/package/gulp-imagemin)

```
npm install --save-dev gulp-imagemin
```


## Example

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

MIT © [Sindre Sorhus](http://sindresorhus.com)
