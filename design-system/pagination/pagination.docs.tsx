import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Pagination',
			description: 'A component for pagination controls.',
			status: 'general-availability',
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=13916-66923',
			},
			import: {
				name: 'Pagination',
				package: '@atlaskit/pagination/pagination',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for navigating through paged content',
				'Provide clear page indicators',
				'Consider total page count display',
				'Use appropriate page limits',
			],
			contentGuidelines: [
				'Use clear page labels',
				'Provide meaningful navigation text',
				'Use consistent pagination terminology',
				'Consider page context information',
			],
			accessibilityGuidelines: [
				'Provide clear page navigation labels',
				'Use appropriate ARIA labels for pagination',
				'Ensure keyboard navigation support',
				'Announce page changes to screen readers',
			],
			examples: [
				{
					name: 'Pagination',
					description: 'Pagination example',
					source: path.resolve(__dirname, './examples/ai/pagination.tsx'),
				},
			],
			keywords: ['pagination', 'pages', 'navigation', 'paging', 'controls'],
			categories: ['navigation'],
		},
	],
};

export default documentation;
