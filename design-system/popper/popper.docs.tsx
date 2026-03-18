import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Popper',
		description: 'A component for positioning elements relative to other elements.',
		status: 'general-availability',
		import: {
			name: 'Popper',
			package: '@atlaskit/popper',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for positioning overlays and tooltips',
			'Consider positioning constraints',
			'Handle responsive positioning',
			'Use appropriate z-index management',
		],
		contentGuidelines: [
			'Ensure positioned content is accessible',
			'Use appropriate positioning strategies',
			'Consider content visibility and readability',
		],
		accessibilityGuidelines: [
			'Ensure proper positioning and visibility',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle focus management',
		],
		examples: [
			{
				name: '00 Basic Positioning',
				description: '00 Basic Positioning example',
				source: path.resolve(__dirname, './examples/00-basic-positioning.tsx'),
			},
		],
		keywords: ['popper', 'positioning', 'tooltip', 'popup', 'overlay'],
		categories: ['utility'],
	},
];

export default documentation;
