import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import {
	UNSAFE_buildNew as buildIcons,
	UNSAFE_createDeprecatedIconDocs,
	UNSAFE_createIconDocsNew,
	type UNSAFE_NewIconBuildConfig,
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
const config: UNSAFE_NewIconBuildConfig = {
	srcDir: path.resolve(root, 'icons_raw/core'),
	processedDir: path.resolve(root, 'icons_optimised/core'),
	destDir: path.resolve(root, 'core'),
	maxWidth: 24,
	maxHeight: 24,
	glob: '**/*.svg',
	iconType: 'core',
	packageName: '@atlaskit/icon-lab',
	baseIconEntryPoint: '@atlaskit/icon/UNSAFE_base-new',
	metadata: coreIconMetadata,
	migrationMap: migrationMap,
};

buildIcons(config).then((icons) => {
	const iconDocs = UNSAFE_createIconDocsNew(
		icons,
		'@atlaskit/icon-lab',
		'core',
		{},
		['icon', 'icon-lab', 'core'],
		coreIconMetadata,
		migrationMap,
	);

	fs.outputFile(path.resolve(root, 'src/metadata-core.tsx'), iconDocs);

	const deprecatedDocs = UNSAFE_createDeprecatedIconDocs(
		icons,
		'@atlaskit/icon-lab',
		'core',
		coreIconMetadata,
		migrationMap,
	);

	fs.outputFile(path.resolve(root, 'src/deprecated-core.tsx'), deprecatedDocs);
});
