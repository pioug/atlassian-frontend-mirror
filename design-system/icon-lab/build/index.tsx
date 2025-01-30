import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import {
	buildNew as buildIcons,
	createDeprecatedIconDocs,
	createIconDocsNew,
	createVRTest,
	type NewIconBuildConfig,
} from '@af/icon-build-process';

import coreIconMetadata from '../icons_raw/metadata-core';
import migrationMap from '../src/migration-map';

const root = pkgDir.sync();

if (!root) {
	throw new Error('Root directory was not found');
}

/**
 * The updated icon build process for the new icons under `@atlaskit/icon/core/*`
 */
const config: NewIconBuildConfig = {
	srcDir: path.resolve(root, 'icons_raw/core'),
	processedDir: path.resolve(root, 'icons_optimised/core'),
	destDir: path.resolve(root, 'core'),
	maxWidth: 24,
	maxHeight: 24,
	glob: '**/*.svg',
	iconType: 'core',
	packageName: '@atlaskit/icon-lab',
	baseIconEntryPoint: '@atlaskit/icon/base-new',
	metadata: coreIconMetadata,
	migrationMap: migrationMap,
};

buildIcons(config).then((icons) => {
	const iconDocs = createIconDocsNew(
		icons,
		'@atlaskit/icon-lab',
		'core',
		{},
		['icon', 'icon-lab', 'core'],
		coreIconMetadata,
		migrationMap,
	);

	fs.outputFile(path.resolve(root, 'src/metadata-core.tsx'), iconDocs);

	const deprecatedDocs = createDeprecatedIconDocs(
		icons,
		'@atlaskit/icon-lab',
		'core',
		coreIconMetadata,
		migrationMap,
	);

	fs.outputFile(path.resolve(root, 'src/deprecated-core.tsx'), deprecatedDocs);

	// Generate VR tests
	const [vrExampleCore, vrTestCore] = createVRTest(coreIconMetadata, '../../../..', 20, 'core');
	fs.outputFile(
		path.resolve(root, 'src/__tests__/vr-tests/examples/all-core-icons.tsx'),
		vrExampleCore,
	);
	fs.outputFile(
		path.resolve(root, 'src/__tests__/vr-tests/all-core-icons.test.vr.tsx'),
		vrTestCore,
	);
});
