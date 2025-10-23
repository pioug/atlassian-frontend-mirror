import pkgDir from 'pkg-dir';

import generateComponents from './generators/generate-components';
import generateExample from './generators/generate-example';
import generateRawIcons from './generators/generate-raw-icons';

const root = pkgDir.sync();

const sourceDirectory = 'logos_raw';
const uiNewDirectory = 'artifacts/logo-components';
const rawIconsDirectory = 'artifacts/raw-icons';

console.log('Building logo assets...');

if (!root) {
	throw new Error('Could not find root directory');
} else {
	// Create React components for each logo
	const assets = generateComponents(root, sourceDirectory, uiNewDirectory);

	// Generate list for use in examples
	generateExample(root, assets);

	// Generate raw export
	generateRawIcons(root, sourceDirectory, rawIconsDirectory);
}

console.log('Done!');
