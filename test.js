import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import imageminPngquant from 'imagemin-pngquant';
import Vinyl from 'vinyl';
import test from 'ava';
import gulpImagemin, {mozjpeg, svgo, webp} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createFixture = async (plugins, file = 'fixture.png') => {
	const buffer = await fs.readFile(path.join(__dirname, file));
	const stream = gulpImagemin(plugins);

	stream.end(new Vinyl({
		path: path.join(__dirname, file),
		contents: buffer,
	}));

	return {buffer, stream};
};

test('minify images', async t => {
	const {buffer, stream} = await createFixture();
	const file = await stream.toArray();

	t.true(file[0].contents.length < buffer.length);
});

test('minify JPEG with custom settings', async t => {
	const mozjpegOptions = {
		quality: 30,
		progressive: false,
		smooth: 45,
	};
	const {buffer, stream} = await createFixture([mozjpeg(mozjpegOptions)], 'fixture.jpg');
	const file = await stream.toArray();

	t.true(file[0].contents.length < buffer.length);
});

test('minify WebP with custom settings', async t => {
	const webpOptions = {
		quality: 2,
		metadata: ['exif'],
	};
	const {buffer, stream} = await createFixture([webp(webpOptions)], 'fixture.webp');
	const file = await stream.toArray();

	t.true(file[0].contents.length < buffer.length);
});

test('use custom plugins', async t => {
	const {stream} = await createFixture([imageminPngquant()]);
	const {stream: compareStream} = await createFixture();
	const file = await stream.toArray();
	const compareFile = await compareStream.toArray();

	t.true(file[0].contents.length < compareFile[0].contents.length);
});

test('use custom svgo settings', async t => {
	const svgoOptions = {
		js2svg: {
			indent: 2,
			pretty: true,
		},
	};
	const {stream} = await createFixture([svgo(svgoOptions)], 'fixture-svg-logo.svg');
	const {stream: compareStream} = await createFixture(null, 'fixture-svg-logo.svg');
	const file = await stream.toArray();
	const compareFile = await compareStream.toArray();

	t.true(file[0].contents.length > compareFile[0].contents.length);
});

test('skip unsupported images', async t => {
	const stream = gulpImagemin();
	stream.end(new Vinyl({path: path.join(__dirname, 'fixture.bmp')}));
	const file = await stream.toArray();

	t.is(file[0].contents, null);
});
