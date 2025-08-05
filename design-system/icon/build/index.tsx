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
import utilityIconMetadata from '../icons_raw/metadata-utility';
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
	 * Re-running this step re-generates all icons and triggers a large number of platform/product snapshot tests.
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
		iconType: 'core',
		metadata: coreIconMetadata,
		legacyMetadata: legacyMetadata,
		migrationMap: migrationMap,
	};

	await buildIconsNew(configCore).then((icons) => {
		const iconDocs = createIconDocsNew(
			icons,
			'@atlaskit/icon',
			'core',
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
			'core',
			coreIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/deprecated-core.tsx'), deprecatedDocs);
	});

	/**
	 * The updated icon build process for the new icons under `@atlaskit/icon/utility/*`
	 */
	const configUtility: NewIconBuildConfig = {
		srcDir: path.resolve(root, 'icons_raw/utility'),
		processedDir: path.resolve(root, 'svgs/utility'),
		destDir: path.resolve(root, 'utility'),
		maxWidth: 12,
		maxHeight: 12,
		glob: '**/*.svg',
		packageName: '@atlaskit/icon',
		baseIconEntryPoint: '@atlaskit/icon/base-new',
		iconType: 'utility',
		metadata: utilityIconMetadata,
		legacyMetadata: legacyMetadata,
		migrationMap: migrationMap,
	};

	await buildIconsNew(configUtility).then((icons) => {
		const iconDocs = createIconDocsNew(
			icons,
			'@atlaskit/icon',
			'utility',
			synonyms,
			['icon'],
			utilityIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/metadata-utility.tsx'), iconDocs);

		const deprecatedDocs = createDeprecatedIconDocs(
			icons,
			'@atlaskit/icon',
			'utility',
			utilityIconMetadata,
			migrationMap,
		);

		fs.outputFile(path.resolve(root, 'src/deprecated-utility.tsx'), deprecatedDocs);

		// Generate VR tests
		const [vrExampleCore, vrTestCore] = createVRTest(
			coreIconMetadata,
			'../../../../..',
			50,
			'core',
		);
		fs.outputFile(
			path.resolve(root, 'src/components/__tests__/vr-tests/examples/all-core-icons.tsx'),
			vrExampleCore,
		);
		fs.outputFile(
			path.resolve(root, 'src/components/__tests__/vr-tests/all-core-icons.test.vr.tsx'),
			vrTestCore,
		);

		const [vrExampleUtility, vrTestUtility] = createVRTest(
			utilityIconMetadata,
			'../../../../..',
			50,
			'utility',
		);
		fs.outputFile(
			path.resolve(root, 'src/components/__tests__/vr-tests/examples/all-utility-icons.tsx'),
			vrExampleUtility,
		);
		fs.outputFile(
			path.resolve(root, 'src/components/__tests__/vr-tests/all-utility-icons.test.vr.tsx'),
			vrTestUtility,
		);
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
