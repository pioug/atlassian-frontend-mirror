import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import buildIcons, {
	buildNew as buildIconsNew,
	createDeprecatedIconDocs,
	createIconDocs,
	createIconDocsNew,
	createVRTest,
	type IconBuildConfig,
	type NewIconBuildConfig,
} from '@af/icon-build-process';

import coreIconMetadata from '../icons_raw/metadata-core';
import legacyMetadata from '../src/metadata';
import migrationMap from '../src/migration-map';
import { recommendedSmallIcons } from '../src/recommended-small';
import synonyms from '../utils/synonyms';

async function main() {
	const root = pkgDir.sync();

	if (!root) {
		throw new Error('Root directory was not found');
	}

	/**
	 * The legacy icon build process. A past SVGO update disabled this process and slightly changed the SVG output.
	 * Re-running this step re-generates all icons and triggers a large number of platform/app snapshot tests.
	 *
	 * To avoid unnecessary churn, this step is switched off, and any updates to the old icon set can be done piecemeal.
	 */

	const config: IconBuildConfig = {
		srcDir: path.resolve(root, 'svgs_raw'),
		processedDir: path.resolve(root, 'svgs'),
		destDir: path.resolve(root, 'glyph'),
		maxWidth: 24,
		maxHeight: 24,
		glob: '**/*.svg',
		baseIconEntryPoint: '@atlaskit/icon/base',
		newIconsDir: path.resolve(root, 'icons_raw'),
		migrationMap,
		isDeprecated: true,
	};
	await buildIcons(config).then((icons) => {
		const iconDocs = createIconDocs(icons, '@atlaskit/icon', synonyms, ['icon', 'core']);
		return fs.outputFile(path.resolve(root, 'src/metadata.tsx'), iconDocs);
	});

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
		packageName: '@atlaskit/icon',
		baseIconEntryPoint: '@atlaskit/icon/base-new',
		metadata: coreIconMetadata,
		legacyMetadata: legacyMetadata,
		migrationMap: migrationMap,
	};

	await buildIconsNew(configCore).then((icons) => {
		const iconDocs = createIconDocsNew(
			icons,
			'@atlaskit/icon',
			synonyms,
			['icon'],
			coreIconMetadata,
			migrationMap,
			recommendedSmallIcons,
		);

		fs.outputFile(path.resolve(root, 'src/metadata-core.tsx'), iconDocs);

		const deprecatedDocs = createDeprecatedIconDocs(
			icons,
			'@atlaskit/icon',
			coreIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/deprecated-core.tsx'), deprecatedDocs);
	});
	// Generate VR tests
	const [vrExampleCore, vrTestCore] = createVRTest(coreIconMetadata, '../../../../..', 50);
	fs.outputFile(
		path.resolve(root, 'src/components/__tests__/vr-tests/examples/all-core-icons.tsx'),
		vrExampleCore,
	);
	fs.outputFile(
		path.resolve(root, 'src/components/__tests__/vr-tests/all-core-icons.test.vr.tsx'),
		vrTestCore,
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
