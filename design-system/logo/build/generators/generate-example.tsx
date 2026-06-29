import path from 'path';

import fs from 'fs-extra';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { type Assets } from '../utils';

/**
 * Generates example utils file with rows of all assets
 * @param root Root directory of package
 * @param assets Assets to generate examples for
 */
export default function generateExample(root: string | undefined, assets: Assets): void {
	// Create example utils file with rows of all assets
	const exampleUsage = `import React from 'react';

/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
${Object.entries(assets)
	.flatMap(([name, asset]) => {
		const capitalisedName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		const importLines: string[] = [];
		if (asset.icon) {
			importLines.push(
				`import { ${capitalisedName}Icon } from '../../../src/artifacts/logo-components/${name}/icon';`,
			);
		}
		if (asset.logo) {
			importLines.push(
				`import { ${capitalisedName}Logo } from '../../../src/artifacts/logo-components/${name}/logo';`,
			);
		}
		if (asset['logo-cs']) {
			importLines.push(
				`import { ${capitalisedName}LogoCS } from '../../../src/artifacts/logo-components/${name}/logo-cs';`,
			);
		}
		return importLines;
	})
	.sort((a, b) => {
		// Extract path from import statement for sorting
		const pathA = a.match(/from '([^']+)'/)?.[1] ?? a;
		const pathB = b.match(/from '([^']+)'/)?.[1] ?? b;
		return pathA.localeCompare(pathB);
	})
	.join('\n')}
	import type { AppIconProps, AppLogoProps } from '../../../src/utils/types';
	/* eslint-enable @atlaskit/platform/use-entrypoints-in-examples */

export const rows: Array<{
name: string;
Icon12: React.ComponentType<AppIconProps> | null;
Icon16: React.ComponentType<AppIconProps> | null;
Icon20: React.ComponentType<AppIconProps> | null;
Icon24: React.ComponentType<AppIconProps> | null;
Icon32: React.ComponentType<AppIconProps> | null;
Logo: React.ComponentType<AppLogoProps> | null;
LogoCS: React.ComponentType<AppLogoProps> | null;
}> = [
${Object.entries(assets)
	.map(([name, asset]) => {
		const capitalisedName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		const displayName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		const needsLabel = ['more-atlassian-apps', 'custom-link'].includes(name);
		const labelProp = needsLabel ? `label="${displayName}"` : '';

		return `{
	name: '${displayName}',
	Icon12: ${asset.icon ? `(props) => <${capitalisedName}Icon {...props} size="12" ${labelProp} />` : 'null'},
	Icon16: ${asset.icon ? `(props) => <${capitalisedName}Icon {...props} size="16" ${labelProp} />` : 'null'},
	Icon20: ${asset.icon ? `(props) => <${capitalisedName}Icon {...props} size="20" ${labelProp} />` : 'null'},
	Icon24: ${asset.icon ? `(props) => <${capitalisedName}Icon {...props} size="24" ${labelProp} />` : 'null'},
	Icon32: ${asset.icon ? `(props) => <${capitalisedName}Icon {...props} size="32" ${labelProp} />` : 'null'},
	Logo: ${asset.logo ? `(props) => <${capitalisedName}Logo {...props} />` : 'null'},
	LogoCS: ${asset['logo-cs'] ? `(props) => <${capitalisedName}LogoCS {...props} />` : 'null'},
}`;
	})
	.join(',\n  ')}
];`;
	fs.ensureFileSync(
		path.resolve(root!, 'examples', 'internal-logo-component', 'utils', 'all-components.tsx'),
	);
	fs.writeFileSync(
		path.resolve(root!, 'examples', 'internal-logo-component', 'utils', 'all-components.tsx'),
		createSignedArtifact(
			format(exampleUsage, 'tsx'),
			'yarn workspace @atlaskit/logo generate:components',
		),
	);
}
