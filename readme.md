# gulp-imagemin [![Build Status](https://travis-ci.org/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-imagemin)

> Minify PNG, JPEG, GIF and SVG images with [imagemin](https://github.com/imagemin/imagemin)

*Issues with the output should be reported on the imagemin [issue tracker](https://github.com/imagemin/imagemin/issues).*


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

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — *Compress GIF images*
- [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) — *Compress JPEG images*
- [optipng](https://github.com/imagemin/imagemin-optipng) — *Compress PNG images*
- [svgo](https://github.com/imagemin/imagemin-svgo) — *Compress SVG images*

### imagemin([plugins], [options])

Unsupported files are ignored.

#### plugins

Type: `array`<br>
Default: `[imagemin.gifsicle(), imagemin.mozjpeg(), imagemin.optipng({optimizationLevel: 3}), imagemin.svgo({multipass: true})]`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use with imagemin. This will overwrite the default plugins. Note that the default plugins comes with good default options and should be sufficient in most cases.

#### options

##### verbose

Type: `boolean`<br>
Default: `false`

Output more detailed information.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
