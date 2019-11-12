# gulp-imagemin [![Build Status](https://travis-ci.com/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.com/sindresorhus/gulp-imagemin) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

> Minify PNG, JPEG, GIF and SVG images with [`imagemin`](https://github.com/imagemin/imagemin)

*Issues with the output should be reported on the [`imagemin` issue tracker](https://github.com/imagemin/imagemin/issues).*


## Install

```
$ npm install --save-dev gulp-imagemin
```


## Usage

### Basic

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

exports.default = () => (
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);
```

### Custom plugin options

```js
// …
.pipe(imagemin([
	imagemin.gifsicle({interlaced: true}),
	imagemin.jpegtran({progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
	})
]))
// …
```

Note that you may come across an older, implicit syntax. In versions < 3, the same was written like this:

```js
// …
.pipe(imagemin({
	interlaced: true,
	progressive: true,
	optimizationLevel: 5,
	svgoPlugins: [
		{
			removeViewBox: true
		}
	]
}))
// …
```

### Custom plugin options and custom `gulp-imagemin` options

```js
// …
.pipe(imagemin([
	imagemin.svgo({
		plugins: [
			{
				removeViewBox: true
			}
		]
	})
], {
	verbose: true
}))
// …
```


## API

Comes bundled with the following **lossless** optimizers:

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — *Compress GIF images*
- [jpegtran](https://github.com/imagemin/imagemin-jpegtran) — *Compress JPEG images*
- [optipng](https://github.com/imagemin/imagemin-optipng) — *Compress PNG images*
- [svgo](https://github.com/imagemin/imagemin-svgo) — *Compress SVG images*

These are bundled for convenience and most users will not need anything else.

### imagemin(plugins?, options?)

Unsupported files are ignored.

#### plugins

Type: `Array`<br>
Default: `[imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use. This will overwrite the default plugins. Note that the default plugins comes with good defaults and should be sufficient in most cases. See the individual plugins for supported options.

#### options

Type: `object`

##### verbose

Type: `boolean`<br>
Default: `false`

Enabling this will log info on every image passed to `gulp-imagemin`:

```
gulp-imagemin: ✔ image1.png (already optimized)
gulp-imagemin: ✔ image2.png (saved 91 B - 0.4%)
```

##### silent

Type: `boolean`<br>
Default: `false`

Don't log the number of images that have been minified.

You can also enable this from the command-line with the `--silent` flag if the option is not already specified.
