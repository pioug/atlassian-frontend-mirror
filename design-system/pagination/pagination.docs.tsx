import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Pagination',
		description: 'A component for pagination controls.',
		status: 'general-availability',
		import: {
			name: 'Pagination',
			package: '@atlaskit/pagination',
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
];

export default documentation;
