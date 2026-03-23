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
	{
		name: 'BreadcrumbsItem',
		description:
			'An individual breadcrumb item within the breadcrumb trail. Each item can be a link (with href) or plain text for the current page.',
		status: 'general-availability',
		import: {
			name: 'BreadcrumbsItem',
			package: '@atlaskit/breadcrumbs',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use within Breadcrumbs wrapper to define each step in the hierarchy',
			'Use href for navigable items; omit href for the current page',
			'Support iconBefore and iconAfter for contextual indicators',
			'Use truncationWidth when items may be long to prevent overflow',
		],
		contentGuidelines: [
			'Use page or section titles for the text prop',
			'Keep labels concise but meaningful',
			'Use consistent naming conventions across the breadcrumb trail',
		],
		accessibilityGuidelines: [
			'Provide meaningful text for screen readers',
			'Ensure link targets are descriptive',
		],
		examples: [
			{
				name: 'Breadcrumbs Item',
				description: 'BreadcrumbsItem example',
				source: path.resolve(__dirname, './examples/constellation/breadcrumbs-default.tsx'),
			},
		],
		keywords: ['breadcrumbs', 'item', 'navigation', 'link', 'hierarchy'],
		categories: ['navigation'],
	},
];

export default documentation;
