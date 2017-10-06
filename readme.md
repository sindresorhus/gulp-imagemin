# gulp-imagemin [![Build Status](https://travis-ci.org/sindresorhus/gulp-imagemin.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-imagemin) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Minify PNG, JPEG, GIF and SVG images with [imagemin](https://github.com/imagemin/imagemin)

*Issues with the output should be reported on the imagemin [issue tracker](https://github.com/imagemin/imagemin/issues).*

---

<p align="center"><b>🔥 Want to strengthen your core JavaScript skills and master ES6?</b><br>I would personally recommend this awesome <a href="https://ES6.io/friend/AWESOME">ES6 course</a> by Wes Bos.</p>

---


## Install

```
$ npm install --save-dev gulp-imagemin
```


## Usage

### Basic

```js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('default', () =>
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);
```

### Custom plugin options

```js
…
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
…
```

Note that you may come across an older, implicit syntax. In versions < 3, the same was written like this:

```js
…
.pipe(imagemin({
	interlaced: true,
	progressive: true,
	optimizationLevel: 5,
	svgoPlugins: [{removeViewBox: true}]
}))
…
```

### Custom plugin options and custom `gulp-imagemin` options

```js
…
.pipe(imagemin([
	imagemin.svgo({plugins: [{removeViewBox: true}]})
], {
	verbose: true
}))
…
```


<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/tmkVF4Qm7RNE8e9RVwnim6gU/sindresorhus/gulp-imagemin'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/tmkVF4Qm7RNE8e9RVwnim6gU/sindresorhus/gulp-imagemin.svg' />
</a>


## API

Comes bundled with the following **lossless** optimizers:

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — *Compress GIF images*
- [jpegtran](https://github.com/imagemin/imagemin-jpegtran) — *Compress JPEG images*
- [optipng](https://github.com/imagemin/imagemin-optipng) — *Compress PNG images*
- [svgo](https://github.com/imagemin/imagemin-svgo) — *Compress SVG images*

These are bundled for convenience and most users will not need anything else.

### imagemin([plugins], [options])

Unsupported files are ignored.

#### plugins

Type: `Array`<br>
Default: `[imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use. This will overwrite the default plugins. Note that the default plugins comes with good defaults and should be sufficient in most cases. See the individual plugins for supported options.

#### options

Type: `Object`

##### verbose

Type: `boolean`<br>
Default: `false`

Enabling this will log info on every image passed to `gulp-imagemin`:

```
gulp-imagemin: ✔ image1.png (already optimized)
gulp-imagemin: ✔ image2.png (saved 91 B - 0.4%)
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
