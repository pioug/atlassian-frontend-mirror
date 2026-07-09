import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'PageHeader',
			description: 'A component for page headers.',
			status: 'general-availability',
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=82097-75325',
			},
			import: {
				name: 'PageHeader',
				package: '@atlaskit/page-header/page-header',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for consistent page header layout',
				'Include breadcrumbs for navigation context',
				'Provide relevant page actions',
				'Use appropriate header hierarchy',
			],
			contentGuidelines: [
				'Use clear, descriptive page titles',
				'Provide meaningful breadcrumb labels',
				'Use action-oriented button text',
				'Keep header content focused',
			],
			accessibilityGuidelines: [
				'Provide clear page titles',
				'Use appropriate heading hierarchy',
				'Ensure breadcrumb navigation is accessible',
				'Provide clear action labels',
			],
			examples: [
				{
					name: 'Page Header',
					description: 'Page Header example',
					source: path.resolve(__dirname, './examples/ai/page-header.tsx'),
				},
			],
			keywords: ['page', 'header', 'title', 'breadcrumbs', 'actions'],
			categories: ['layout'],
		},
	],
};

export default documentation;
