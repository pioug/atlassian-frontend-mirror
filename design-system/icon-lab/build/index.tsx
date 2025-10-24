import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import {
	buildNew as buildIconsNew,
	createDeprecatedIconDocs,
	createIconDocsNew,
	createVRTest,
	type NewIconBuildConfig,
} from '@af/icon-build-process';

import coreIconMetadata from '../icons_raw/metadata-core';
import migrationMap from '../src/migration-map';

async function main() {
	const root = pkgDir.sync();

	if (!root) {
		throw new Error('Root directory was not found');
	}

	/**
	 * The updated icon build process for the new icons under `@atlaskit/icon/core/*`
	 */
	const configCore: NewIconBuildConfig = {
		srcDir: path.resolve(root, 'icons_raw/core'),
		processedDir: path.resolve(root, 'svgs/core'),
		destDir: path.resolve(root, 'core'),
		maxWidth: 24,
		maxHeight: 24,
		glob: '**/*.svg',
		packageName: '@atlaskit/icon-lab',
		baseIconEntryPoint: '@atlaskit/icon/base-new',
		metadata: coreIconMetadata,
		migrationMap: migrationMap,
	};

	await buildIconsNew(configCore).then((icons) => {
		const iconDocs = createIconDocsNew(
			icons,
			'@atlaskit/icon-lab',
			{},
			['icon', 'icon-lab'],
			coreIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/metadata-core.tsx'), iconDocs);

		const deprecatedDocs = createDeprecatedIconDocs(
			icons,
			'@atlaskit/icon-lab',
			coreIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/deprecated-core.tsx'), deprecatedDocs);

		// Generate VR tests
		const [vrExampleCore, vrTestCore] = createVRTest(coreIconMetadata, '../../../..', 50, true);
		fs.outputFile(
			path.resolve(root, 'src/__tests__/vr-tests/examples/all-core-icons.tsx'),
			vrExampleCore,
		);
		fs.outputFile(
			path.resolve(root, 'src/__tests__/vr-tests/all-core-icons.test.vr.tsx'),
			vrTestCore,
		);
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
