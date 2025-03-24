import pkgDir from 'pkg-dir';

import generateComponents from './generators/generate-components';
import generateEntrypoint from './generators/generate-entrypoint';
import generateExample from './generators/generate-example';

const root = pkgDir.sync();

const entrypointsDirectory = 'entry-points';
const rawDirectory = 'logos_raw';
const uiNewDirectory = 'ui';

console.log('Building logo assets...');

if (!root) {
	throw new Error('Could not find root directory');
} else {
	// Create React components for each logo
	const assets = generateComponents(root, rawDirectory, uiNewDirectory);

	// Create entrypoints for each logo
	generateEntrypoint(assets, root, entrypointsDirectory, uiNewDirectory);

	// Generate list for use in examples
	generateExample(assets, root);
}

console.log('Done!');
