import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Tabs',
		description:
			'Tabs are used to organize content by grouping similar information on the same page.',
		status: 'general-availability',
		import: {
			name: 'Tabs',
			package: '@atlaskit/tabs',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to organize related content on the same page without navigating away',
			'Use for concise content or content users access regularly',
			'Limit the number of tabs to avoid overcrowding',
			'Keep tab labels concise and descriptive',
			'Use consistent tab ordering and grouping',
			'Consider responsive behavior for many tabs',
		],
		contentGuidelines: [
			'Write clear, descriptive tab labels',
			'Group related content logically',
			'Use consistent naming conventions',
			'Ensure tab content is relevant and complete',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation between tabs',
			'Use appropriate ARIA attributes for tab panels',
			'Provide clear focus indicators',
			'Announce tab changes to screen readers',
			'Ensure tab content is accessible',
		],
		examples: [
			{
				name: 'Tabs',
				description: 'Tabs example',
				source: path.resolve(__dirname, './examples/ai/tabs.tsx'),
			},
		],
		keywords: ['tabs', 'navigation', 'content', 'organization', 'grouping'],
		categories: ['navigation'],
	},
];

export default documentation;
