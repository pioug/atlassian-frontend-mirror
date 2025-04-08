import path from 'path';

import fs from 'fs-extra';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { Assets } from '../utils';

export default function generateExample(assets: Assets, root: string | undefined) {
	// Create example utils file with rows of all assets
	const exampleUsage = `import React from 'react';

${Object.entries(assets)
	.map(([name, asset]) => {
		const capitalisedName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		const imports: string[] = [];
		if (asset.icon) {
			imports.push(`${capitalisedName}Icon`);
		}
		if (asset.logo) {
			imports.push(`${capitalisedName}Logo`);
		}
		return `import { ${imports.join(', ')} } from '@atlaskit/temp-nav-app-icons/${name}';`;
	})
	.join('\n')}

import { AppIconProps, AppLogoProps } from '../../src/utils/types';

export const rows: Array<{
name: string;
Icon12: React.ComponentType<AppIconProps>;
Icon16: React.ComponentType<AppIconProps>;
Icon20: React.ComponentType<AppIconProps>;
Icon24: React.ComponentType<AppIconProps>;
Icon32: React.ComponentType<AppIconProps>;
Logo: React.ComponentType<AppLogoProps> | null;
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
	Icon12: (props) => <${capitalisedName}Icon {...props} size="12" ${labelProp} />,
	Icon16: (props) => <${capitalisedName}Icon {...props} size="16" ${labelProp} />,
	Icon20: (props) => <${capitalisedName}Icon {...props} size="20" ${labelProp} />,
	Icon24: (props) => <${capitalisedName}Icon {...props} size="24" ${labelProp} />,
	Icon32: (props) => <${capitalisedName}Icon {...props} size="32" ${labelProp} />,
	Logo: ${asset.logo ? `(props) => <${capitalisedName}Logo {...props} />` : 'null'},
}`;
	})
	.join(',\n  ')}
];`;
	fs.ensureFileSync(path.resolve(root!, 'examples', 'utils', 'all-components.tsx'));
	fs.writeFileSync(
		path.resolve(root!, 'examples', 'utils', 'all-components.tsx'),
		createSignedArtifact(
			format(exampleUsage, 'tsx'),
			'yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos',
		),
	);
}
