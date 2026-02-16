import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { createAllIconsFile, getIconObjectJSX, iconObjectMapping } from './utils';

const root = pkgDir.sync();

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

// Generate all-icons.tsx file
const iconNames = Object.keys(iconObjectMapping);
const allIconsContent = createAllIconsFile(iconNames);
fs.writeFileSync(
	path.resolve(root!, 'src', 'all-icons.tsx'),
	createSignedArtifact(format(allIconsContent, 'tsx'), 'yarn build:icon-glyphs'),
);
