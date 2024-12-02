export const iconObjectMapping: Record<string, { icon: string; appearance: string }> = {
	blog: {
		icon: 'quotation-mark',
		appearance: 'blueBold',
	},
	branch: {
		icon: 'branch',
		appearance: 'blueBold',
	},
	bug: {
		icon: 'bug',
		appearance: 'redBold',
	},
	calendar: {
		icon: 'calendar',
		appearance: 'redBold',
	},
	changes: {
		icon: 'changes',
		appearance: 'orangeBold',
	},
	code: {
		icon: 'angle-brackets',
		appearance: 'purpleBold',
	},
	commit: {
		icon: 'commit',
		appearance: 'orangeBold',
	},
	epic: {
		icon: 'epic',
		appearance: 'purpleBold',
	},
	improvement: {
		icon: 'arrow-up',
		appearance: 'greenBold',
	},
	incident: {
		icon: 'incident',
		appearance: 'redBold',
	},
	issue: {
		icon: 'issue',
		appearance: 'blueBold',
	},
	'new-feature': {
		icon: 'add',
		appearance: 'greenBold',
	},
	page: {
		icon: 'page',
		appearance: 'blueBold',
	},
	problem: {
		icon: 'problem',
		appearance: 'redBold',
	},
	'pull-request': {
		icon: 'pull-request',
		appearance: 'greenBold',
	},
	question: {
		icon: 'question-circle',
		appearance: 'purpleBold',
	},
	story: {
		icon: 'story',
		appearance: 'greenBold',
	},
	subtask: {
		icon: 'subtasks',
		appearance: 'blueBold',
	},
	task: {
		icon: 'task',
		appearance: 'blueBold',
	},
};

export const getIconObjectJSX = (
	name: string,
	icon: string,
	appearance: string,
	size: '16' | '24',
) => {
	// convert name to PascalCase from kebab-case
	const componentName = `${name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')}${size}Icon`;

	return `import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/${icon}';
import type { GlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

import IconObjectOld from '../../glyph-legacy/${name}/${size}';

/**
 * __${size}px \`${name}\` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const ${componentName} = ({
	label,
	testId,
}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => {
	if (fg('icon-object-migration')) {
		return (
			<IconTile
				icon={NewIcon}
				appearance="${appearance}"
				size="${size}"
				label={label}
				testId={testId}
				LEGACY_fallbackComponent={<IconObjectOld label={label} testId={testId} />}
			/>
		);
	} else {
		return <IconObjectOld label={label} testId={testId} />
	}
};

${componentName}.displayName = '${componentName}';

export default ${componentName};
`;
};
