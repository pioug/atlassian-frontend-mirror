import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import makeDir from 'mkdirp';

import format from '@af/formatting/sync';

import styleSheet from '../src';

const writeFile = promisify(fs.writeFile);
const SRC = path.join(__dirname, '..', 'src');

async function buildCSSReset() {
	try {
		makeDir.sync(SRC);
		const output = format(styleSheet, 'css');
		await writeFile(path.join(SRC, 'bundle.css'), output);
	} catch (err) {
		console.error(`Failed to build css-reset due to ${err}`);
	}
}

buildCSSReset().then(() => {
	console.log('successfully build css-reset');
});
