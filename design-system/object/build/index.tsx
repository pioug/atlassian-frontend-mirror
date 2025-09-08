import path from 'path';

import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import pkgDir from 'pkg-dir';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

const root = pkgDir.sync();

type Color =
	| 'lime'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'teal'
	| 'blue'
	| 'purple'
	| 'magenta';

type Mapping = Record<
	string,
	{
		icon: string;
		color: Color;
		packageName: 'icon' | 'icon-lab';
	}
>;

const OBJECT_MAP: Mapping = {
	'new-feature': { icon: 'add', color: 'green', packageName: 'icon' },
	'page-live-doc': { icon: 'page-live-doc', color: 'magenta', packageName: 'icon-lab' },
	'pull-request': { icon: 'pull-request', color: 'green', packageName: 'icon' },
	blog: { icon: 'quotation-mark', color: 'blue', packageName: 'icon' },
	branch: { icon: 'branch', color: 'blue', packageName: 'icon' },
	bug: { icon: 'bug', color: 'red', packageName: 'icon' },
	calendar: { icon: 'calendar', color: 'red', packageName: 'icon' },
	changes: { icon: 'changes', color: 'yellow', packageName: 'icon' },
	code: { icon: 'angle-brackets', color: 'purple', packageName: 'icon' },
	commit: { icon: 'commit', color: 'yellow', packageName: 'icon' },
	epic: { icon: 'epic', color: 'purple', packageName: 'icon' },
	improvement: { icon: 'arrow-up', color: 'green', packageName: 'icon' },
	incident: { icon: 'incident', color: 'red', packageName: 'icon' },
	issue: { icon: 'work-item', color: 'blue', packageName: 'icon' },
	page: { icon: 'page', color: 'blue', packageName: 'icon' },
	problem: { icon: 'problem', color: 'red', packageName: 'icon' },
	question: { icon: 'question-circle', color: 'purple', packageName: 'icon' },
	story: { icon: 'story', color: 'green', packageName: 'icon' },
	subtask: { icon: 'subtasks', color: 'blue', packageName: 'icon' },
	task: { icon: 'task', color: 'blue', packageName: 'icon' },
	whiteboard: { icon: 'whiteboard', color: 'teal', packageName: 'icon' },
};

const toPascalCase = (kebab: string) => upperFirst(camelCase(kebab));

const getComponentSource = (
	name: string,
	icon: string,
	color: Color,
	packageName: 'icon' | 'icon-lab',
) => {
	const componentName = toPascalCase(name);
	const defaultLabel = startCase(name);

	return `import React from 'react';

import IconComponent from '@atlaskit/${packageName}/core/${icon}';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function ${componentName}Object({ label = ${JSON.stringify(defaultLabel)}, size, testId }: ObjectProps) {
	return (
		<ObjectBase
			label={label}
			size={size}
			testId={testId}
			icon={IconComponent}
			color={token('color.icon.accent.${color}')}
		/>
	);
}
`;
};

const getObjectTileComponentSource = (
	name: string,
	icon: string,
	color: Color,
	packageName: 'icon' | 'icon-lab',
) => {
	const componentName = toPascalCase(name);
	const defaultLabel = startCase(name);

	return `import React from 'react';

import IconComponent from '@atlaskit/${packageName}/core/${icon}';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function ${componentName}ObjectTile({ label = ${JSON.stringify(defaultLabel)}, size, testId, isBold }: ObjectTileProps) {
	return (
		<ObjectTileBase
			label={label}
			size={size}
			testId={testId}
			isBold={isBold}
			icon={IconComponent}
			color={isBold ? token('color.icon') : token('color.icon.accent.${color}')}
			backgroundColor={isBold ? 'color.background.accent.${color}.subtle' : undefined}
		/>
	);
}
`;
};

const componentsDir = path.resolve(root!, 'src', 'components', 'object', 'components');
const allObjectsFile = path.resolve(root!, 'src', 'components', 'object', 'all-objects.tsx');

const objectTileComponentsDir = path.resolve(
	root!,
	'src',
	'components',
	'object-tile',
	'components',
);
const allObjectTilesFile = path.resolve(
	root!,
	'src',
	'components',
	'object-tile',
	'all-object-tiles.tsx',
);

async function run() {
	// Generate Object components
	await fs.ensureDir(componentsDir);
	await fs.emptyDir(componentsDir);

	// Generate each object component file
	await Promise.all(
		Object.entries(OBJECT_MAP).map(async ([name, meta]) => {
			const outFile = path.resolve(componentsDir, `${name}.tsx`);
			const src = getComponentSource(name, meta.icon, meta.color, meta.packageName);
			await fs.outputFile(outFile, createSignedArtifact(format(src, 'tsx'), 'yarn build-glyphs'));
		}),
	);

	// Generate all-objects file exporting an array of all components
	const importNames = Object.keys(OBJECT_MAP)
		.sort() // Sort the kebab-case names first
		.map((name) => `${toPascalCase(name)}Object`);

	const allObjectsImports = Object.keys(OBJECT_MAP)
		.sort() // Sort the kebab-case names first
		.map((name) => `import ${toPascalCase(name)}Object from './components/${name}';`)
		.join('\n');

	const allObjectsSource = `${allObjectsImports}\n\nexport const allObjects = [${importNames.join(', ')}];\n`;

	await fs.outputFile(
		allObjectsFile,
		createSignedArtifact(format(allObjectsSource, 'tsx'), 'yarn build-glyphs'),
	);

	// eslint-disable-next-line no-console
	console.log('Object components generated');

	// Generate Object Tile components
	await fs.ensureDir(objectTileComponentsDir);
	await fs.emptyDir(objectTileComponentsDir);

	// Generate each object tile component file
	await Promise.all(
		Object.entries(OBJECT_MAP).map(async ([name, meta]) => {
			const outFile = path.resolve(objectTileComponentsDir, `${name}.tsx`);
			const src = getObjectTileComponentSource(name, meta.icon, meta.color, meta.packageName);
			await fs.outputFile(outFile, createSignedArtifact(format(src, 'tsx'), 'yarn build-glyphs'));
		}),
	);

	// Generate all-object-tiles file exporting an array of all components
	const objectTileImportNames = Object.keys(OBJECT_MAP)
		.sort() // Sort the kebab-case names first
		.map((name) => `${toPascalCase(name)}ObjectTile`);

	const allObjectTilesImports = Object.keys(OBJECT_MAP)
		.sort() // Sort the kebab-case names first
		.map((name) => `import ${toPascalCase(name)}ObjectTile from './components/${name}';`)
		.join('\n');

	const allObjectTilesSource = `${allObjectTilesImports}\n\nexport const allObjectTiles = [${objectTileImportNames.join(', ')}];\n`;

	await fs.outputFile(
		allObjectTilesFile,
		createSignedArtifact(format(allObjectTilesSource, 'tsx'), 'yarn build-glyphs'),
	);

	// eslint-disable-next-line no-console
	console.log('Object Tile components generated');
}

run();
