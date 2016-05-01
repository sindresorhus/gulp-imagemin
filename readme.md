# gulp-imagemin [![Build Status](https://travis-ci.org/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-imagemin)

> Minify PNG, JPEG, GIF and SVG images with [imagemin](https://github.com/kevva/imagemin)

*Issues with the output should be reported on the imagemin [issue tracker](https://github.com/kevva/imagemin/issues).*


## Install

```
$ npm install --save-dev gulp-imagemin
```


## Usage

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('default', () => {
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});
```


## API

Comes bundled with the following **lossless** optimizers:

- [gifsicle](https://github.com/kevva/imagemin-gifsicle) — *Compress GIF images*
- [mozjpeg](https://github.com/kevva/imagemin-mozjpeg) — *Compress JPEG images*
- [optipng](https://github.com/kevva/imagemin-optipng) — *Compress PNG images*
- [svgo](https://github.com/kevva/imagemin-svgo) — *Compress SVG images*

### imagemin([plugins], [options])

Unsupported files are ignored.

#### plugins

Type: `array`
Default: `[imageminGifsicle(), imageminMozjpeg(), imageminOptipng({optimizationLevel: 3}), imageminSvgo({multipass: true})]`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use with imagemin. This will overwrite the default plugins.

#### options

##### verbose

Type: `boolean`  
Default: `false`

Output more detailed information.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
