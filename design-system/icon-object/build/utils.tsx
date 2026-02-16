export const iconObjectMapping: Record<
	string,
	{ icon: string; appearance: string; packageName: string; objectName: string }
> = {
	blog: {
		icon: 'quotation-mark',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'blog',
	},
	branch: {
		icon: 'branch',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'branch',
	},
	bug: {
		icon: 'bug',
		appearance: 'redBold',
		packageName: 'icon',
		objectName: 'bug',
	},
	calendar: {
		icon: 'calendar',
		appearance: 'redBold',
		packageName: 'icon',
		objectName: 'calendar',
	},
	changes: {
		icon: 'changes',
		appearance: 'orangeBold',
		packageName: 'icon',
		objectName: 'changes',
	},
	code: {
		icon: 'angle-brackets',
		appearance: 'purpleBold',
		packageName: 'icon',
		objectName: 'code',
	},
	commit: {
		icon: 'commit',
		appearance: 'orangeBold',
		packageName: 'icon',
		objectName: 'commit',
	},
	epic: {
		icon: 'epic',
		appearance: 'purpleBold',
		packageName: 'icon',
		objectName: 'epic',
	},
	improvement: {
		icon: 'arrow-up',
		appearance: 'greenBold',
		packageName: 'icon',
		objectName: 'improvement',
	},
	incident: {
		icon: 'incident',
		appearance: 'redBold',
		packageName: 'icon',
		objectName: 'incident',
	},
	issue: {
		icon: 'work-item',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'work-item',
	},
	'new-feature': {
		icon: 'add',
		appearance: 'greenBold',
		packageName: 'icon',
		objectName: 'new-feature',
	},
	page: {
		icon: 'page',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'page',
	},
	problem: {
		icon: 'problem',
		appearance: 'redBold',
		packageName: 'icon',
		objectName: 'problem',
	},
	'pull-request': {
		icon: 'pull-request',
		appearance: 'greenBold',
		packageName: 'icon',
		objectName: 'pull-request',
	},
	question: {
		icon: 'question-circle',
		appearance: 'purpleBold',
		packageName: 'icon',
		objectName: 'question',
	},
	story: {
		icon: 'story',
		appearance: 'greenBold',
		packageName: 'icon',
		objectName: 'story',
	},
	subtask: {
		icon: 'subtasks',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'subtask',
	},
	task: {
		icon: 'task',
		appearance: 'blueBold',
		packageName: 'icon',
		objectName: 'task',
	},
	'page-live-doc': {
		icon: 'page-live-doc',
		appearance: 'magentaBold',
		packageName: 'icon-lab',
		objectName: 'page-live-doc',
	},
};

export const getIconObjectJSX = (
	name: string,
	icon: string,
	appearance: string,
	size: '16' | '24',
	packageName: string,
) => {
	// convert name to PascalCase from kebab-case
	const componentName = `${name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')}${size}Icon`;

	const objectName = iconObjectMapping[name].objectName;

	// Determine the new component import path based on size using objectName
	const newComponentPath =
		size === '16' ? `@atlaskit/object/${objectName}` : `@atlaskit/object/tile/${objectName}`;

	return `import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/${packageName}/core/${icon}';
import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '${newComponentPath}';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * __${size}px \`${name}\` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const ${componentName}: {
    ({ label, testId, }: Omit<GlyphProps, "primaryColor" | "secondaryColor" | "size">): React.JSX.Element;
    displayName: string;
} = ({
	label,
	testId,
}) => {
	// Feature flag to migrate to new object package
	if (fg('platform_dst_icon_object_to_object') || fg('platform_dst_icon_object_to_object_stage2')) {
		// Map props based on size: 16px -> object (medium), 24px -> tile (small)
		return ${
			size === '16'
				? '<NewObjectComponent label={label} testId={testId} size="medium" />'
				: '<NewObjectComponent label={label} testId={testId} size="small" />'
		}
	}

	return (
		<IconTile
			icon={NewIcon}
			appearance="${appearance}"
			size="${size}"
			label={label}
			testId={testId}
		/>
	);
};

${componentName}.displayName = '${componentName}';

export default ${componentName};
`;
};

export const createAllIconsFile = (iconNames: string[]) => {
	// Generate all import statements and sort them alphabetically by full path
	const allImports = iconNames
		.flatMap((name) => [
			{
				path: `./artifacts/glyph/${name}/16`,
				statement: `import ${name
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join('')}16Icon from './artifacts/glyph/${name}/16';`,
				componentName: `${name
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join('')}16Icon`,
			},
			{
				path: `./artifacts/glyph/${name}/24`,
				statement: `import ${name
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join('')}24Icon from './artifacts/glyph/${name}/24';`,
				componentName: `${name
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join('')}24Icon`,
			},
		])
		.sort((a, b) => a.path.localeCompare(b.path));

	const imports = allImports.map((item) => item.statement).join('\n');

	// Generate export array with all icons in the same order as imports
	const iconExports = allImports.map((item) => item.componentName).join(',\n\t');

	return `import type { GlyphProps } from '@atlaskit/icon/types';

${imports}

export const allIcons: {
    ({ label, testId, }: Omit<GlyphProps, "primaryColor" | "secondaryColor" | "size">): React.JSX.Element;
    displayName: string;
}[] = [
	${iconExports},
];
`;
};
