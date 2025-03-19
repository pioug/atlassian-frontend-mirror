import path from 'path';

import fs from 'fs-extra';
import pkgDir from 'pkg-dir';
import { optimize } from 'svgo';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getLogoJSX, svgoConfig, transformSVG } from './utils';

const root = pkgDir.sync();

const assets: Record<string, { logo?: boolean; icon?: boolean }> = {};

const entrypointsDirectory = 'entry-points';
const rawDirectory = 'logos_raw';
const uiNewDirectory = 'ui';

console.log('Building logo assets...');

// empty existing folder
fs.emptyDirSync(path.resolve(root!, 'src', uiNewDirectory));

// For each type of logo or icon, create a new JSX file
(['logo', 'icon'] as const).forEach((type) => {
	// Fetch the list of logos or icons
	const glyphs = fs
		.readdirSync(path.resolve(root!, rawDirectory, type))
		.filter((fileName) => path.extname(fileName) === '.svg');

	// For each logo or icon, create a new JSX file
	glyphs.forEach((fileName) => {
		console.log(`Building ${type} ${fileName}...`);
		const svg = transformSVG(
			fs.readFileSync(path.resolve(root!, rawDirectory, type, fileName), 'utf-8'),
			type,
			fileName.replace('.svg', ''),
		);

		// @ts-ignore
		const svgoResult = optimize(svg, svgoConfig);

		if (!('data' in svgoResult)) {
			throw new Error('SVGO failure');
		}
		const optimisedSvg = svgoResult.data;

		const name = fileName.replace('.svg', '');

		const jsx = getLogoJSX(name, type, optimisedSvg);
		// create file if it doesn't exist
		fs.ensureFileSync(path.resolve(root!, 'src', uiNewDirectory, name, `${type}.tsx`));
		// write new content
		fs.writeFileSync(
			path.resolve(root!, 'src', uiNewDirectory, name, `${type}.tsx`),
			createSignedArtifact(
				format(jsx, 'tsx'),
				'yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos',
			),
		);

		assets[name] = { ...assets[name], [type]: true };
	});
});

// Create entrypoints file in each directory
fs.emptyDirSync(path.resolve(root!, 'src', entrypointsDirectory));
Object.keys(assets).forEach((name) => {
	const componentName = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');

	const exportStatements = [
		assets[name].icon
			? `export { ${componentName}Icon } from '../${uiNewDirectory}/${name}/icon';`
			: '',
		assets[name].logo
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

// Create example utils file with rows of all assets
const exampleUsage = `import React from 'react';

${Object.keys(assets)
	.map((name) => {
		const capitalisedName = name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		const imports: string[] = [];
		if (assets[name].icon) {
			imports.push(`${capitalisedName}Icon`);
		}
		if (assets[name].logo) {
			imports.push(`${capitalisedName}Logo`);
		}
		return `import { ${imports.join(', ')} } from '@atlaskit/temp-nav-app-icons/${name}';`;
	})
	.join('\n')}

import { AppIconProps, AppLogoProps } from '../../src/utils/types';

export const rows: Array<{
	name: string;
	Icon20: React.ComponentType<AppIconProps>;
	Icon24: React.ComponentType<AppIconProps>;
	Icon32: React.ComponentType<AppIconProps>;
	Logo: React.ComponentType<AppLogoProps> | null;
}> = [
	${Object.keys(assets)
		.map((name) => {
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
		Icon20: (props: any) => <${capitalisedName}Icon {...props} size="20" ${labelProp} />,
		Icon24: (props: any) => <${capitalisedName}Icon {...props} size="24" ${labelProp} />,
		Icon32: (props: any) => <${capitalisedName}Icon {...props} size="32" ${labelProp} />,
		Logo: ${assets[name].logo ? `() => <${capitalisedName}Logo />` : 'null'},
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

console.log('Done!');
