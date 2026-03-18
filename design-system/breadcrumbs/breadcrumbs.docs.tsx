import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Breadcrumbs',
		description: 'A navigation component showing the current page hierarchy.',
		status: 'general-availability',
		import: {
			name: 'Breadcrumbs',
			package: '@atlaskit/breadcrumbs',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for orientation; supplement main nav, do not replace it',
			'Hierarchy from top to current; each item is a link',
			'Place top left, above page title; use when user lands from external or on large/hierarchical sites',
			'Do not overwhelm; in-app avoid topmost level unless sidebar is collapsed',
		],
		contentGuidelines: [
			'Use page or section titles for items',
			'Keep labels concise but meaningful',
			'Use consistent naming conventions',
		],
		accessibilityGuidelines: [
			'Ensure separator contrast; separators are not announced to screen readers',
			'Collapsed state = single item (e.g. "Show more breadcrumbs")',
			'Use isNavigation={false} when breadcrumbs are not main nav (e.g. search results) to reduce assistive tech noise',
			'Provide clear navigation labels',
			'Use appropriate ARIA landmarks',
			'Ensure keyboard navigation support',
			'Provide clear path context',
		],
		examples: [
			{
				name: 'Breadcrumbs',
				description: 'Breadcrumbs example',
				source: path.resolve(__dirname, './examples/ai/breadcrumbs.tsx'),
			},
		],
		keywords: ['breadcrumbs', 'navigation', 'hierarchy', 'path', 'location'],
		categories: ['navigation'],
	},
];

export default documentation;
