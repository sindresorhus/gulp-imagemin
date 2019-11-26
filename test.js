import {promisify} from 'util';
import fs from 'fs';
import path from 'path';
import imageminPngquant from 'imagemin-pngquant';
import Vinyl from 'vinyl';
import getStream from 'get-stream';
import test from 'ava';
import gulpImagemin from '.';

const readFile = promisify(fs.readFile);

const createFixture = async (plugins, file = 'fixture.png') => {
	const buffer = await readFile(path.join(__dirname, file));
	const stream = gulpImagemin(plugins);

	stream.end(new Vinyl({
		path: path.join(__dirname, file),
		contents: buffer
	}));

	return {buffer, stream};
};

test('minify images', async t => {
	const {buffer, stream} = await createFixture();
	const file = await getStream.array(stream);

	t.true(file[0].contents.length < buffer.length);
});

test('minify JPEG with custom settings', async t => {
	const mozjpegOptions = {
		quality: 30,
		progressive: false,
		smooth: 45
	};
	const {buffer, stream} = await createFixture([gulpImagemin.mozjpeg(mozjpegOptions)], 'fixture.jpg');
	const file = await getStream.array(stream);

	t.true(file[0].contents.length < buffer.length);
});

test('use custom plugins', async t => {
	const {stream} = await createFixture([imageminPngquant()]);
	const compareStream = (await createFixture()).stream;
	const file = await getStream.array(stream);
	const compareFile = await getStream.array(compareStream);

	t.true(file[0].contents.length < compareFile[0].contents.length);
});

test('use custom svgo settings', async t => {
	const svgoOpts = {
		js2svg: {
			indent: 2,
			pretty: true
		}
	};
	const {stream} = await createFixture([gulpImagemin.svgo(svgoOpts)], 'fixture-svg-logo.svg');
	const compareStream = (await createFixture(null, 'fixture-svg-logo.svg')).stream;
	const file = await getStream.array(stream);
	const compareFile = await getStream.array(compareStream);

	t.true(file[0].contents.length > compareFile[0].contents.length);
});

test('skip unsupported images', async t => {
	const stream = gulpImagemin();
	stream.end(new Vinyl({path: path.join(__dirname, 'fixture.bmp')}));
	const file = await getStream.array(stream);

	t.is(file[0].contents, null);
});
