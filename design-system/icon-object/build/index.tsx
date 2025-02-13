import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import format from '@af/formatting/sync';
import { build, createIconDocs, tidy } from '@af/icon-build-process';
import type { IconBuildConfig } from '@af/icon-build-process';
import { createSignedArtifact } from '@atlassian/codegen';

import { getIconObjectJSX, iconObjectMapping } from './utils';

const root = pkgDir.sync();

const config16: IconBuildConfig = {
	srcDir: path.resolve(root!, 'svgs_raw'),
	processedDir: path.resolve(root!, 'svgs'),
	destDir: path.resolve(root!, 'src', 'artifacts', 'glyph-legacy'),
	maxWidth: 16,
	maxHeight: 16,
	glob: '**/16.svg',
	size: 'small',
	baseIconEntryPoint: '@atlaskit/icon/base',
	outputSource: true,
	isColorsDisabled: true,
};

const config24: IconBuildConfig = {
	srcDir: path.resolve(root!, 'svgs_raw'),
	processedDir: path.resolve(root!, 'svgs'),
	destDir: path.resolve(root!, 'src', 'artifacts', 'glyph-legacy'),
	maxWidth: 24,
	maxHeight: 24,
	glob: '**/24.svg',
	size: 'medium',
	baseIconEntryPoint: '@atlaskit/icon/base',
	outputSource: true,
	isColorsDisabled: true,
};

// Create legacy icons and docs
tidy(config16)
	.then(() => Promise.all([build(config16), build(config24)]))
	.then(([sixteen, twentyfour]) => {
		const allIcons = [...sixteen, ...twentyfour];
		const iconDocs = createIconDocs(allIcons, '@atlaskit/icon-object', {}, [
			'object',
			'icon-object',
		]);

		console.log('@atlaskit-icon-object built');

		return fs.outputFile(path.resolve(root!, 'src/metadata.tsx'), iconDocs);
	});

// For each size (16px and 24px) and each iconObjectMapping, create a new JSX file
// based on the function getIconObjectJSX and write it to the format ./glyph/{name}/{size}.jsx
Object.entries(iconObjectMapping).forEach(([name, iconObject]) => {
	// empty existing folder
	fs.emptyDirSync(path.resolve(root!, 'src', 'artifacts', 'glyph', name));
	(['16', '24'] as const).forEach((size) => {
		const iconObjectJSX = getIconObjectJSX(
			name,
			iconObject.icon,
			iconObject.appearance,
			size,
			iconObject.packageName,
		);
		// create file if it doesn't exist
		fs.ensureFileSync(path.resolve(root!, 'src', 'artifacts', 'glyph', name, `${size}.tsx`));
		// write new content
		fs.writeFileSync(
			path.resolve(root!, 'src', 'artifacts', 'glyph', name, `${size}.tsx`),
			createSignedArtifact(format(iconObjectJSX, 'tsx'), 'yarn build:icon-glyphs'),
		);
	});
});
