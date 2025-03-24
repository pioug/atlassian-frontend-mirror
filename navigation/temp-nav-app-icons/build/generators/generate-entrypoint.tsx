import path from 'path';

import fs from 'fs-extra';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { Assets } from '../utils';

/**
 * generates entrypoints for each asset
 * @param assets the list of assets to generate entrypoint files for
 * @param root the root directory
 * @param entrypointsDirectory the directory to store the entrypoints
 * @param uiNewDirectory the directory to store the new ui components
 */
export default function generateEntrypoints(
	assets: Assets,
	root: string,
	entrypointsDirectory: string,
	uiNewDirectory: string,
) {
	Object.entries(assets).forEach(([name, asset]) => {
		const componentName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');

		const exportStatements = [
			asset.icon ? `export { ${componentName}Icon } from '../${uiNewDirectory}/${name}/icon';` : '',
			asset.logo
				? `export { ${componentName}Logo } from '../${uiNewDirectory}/${name}/logo';\n`
				: '\n',
		]
			.filter(Boolean)
			.join('\n');

		fs.ensureFileSync(path.resolve(root!, 'src', entrypointsDirectory, `${name}.tsx`));
		fs.writeFileSync(
			path.resolve(root!, 'src', entrypointsDirectory, `${name}.tsx`),
			createSignedArtifact(
				format(exportStatements, 'tsx'),
				'yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos',
			),
		);
	});
}
