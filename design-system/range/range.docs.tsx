import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Range',
		description: 'A component for selecting a value from a range of values.',
		status: 'general-availability',
		import: {
			name: 'Range',
			package: '@atlaskit/range',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for selecting numeric values within a range',
			'Provide clear min/max boundaries',
			'Use appropriate step increments',
			'Consider showing current value',
		],
		contentGuidelines: [
			'Use clear range labels',
			'Provide meaningful min/max labels',
			'Show current value when helpful',
			'Use consistent range terminology',
		],
		accessibilityGuidelines: [
			'Provide clear labels for range inputs',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation support',
			'Provide value announcements for screen readers',
		],
		examples: [
			{
				name: 'Range',
				description: 'Range example',
				source: path.resolve(__dirname, './examples/ai/range.tsx'),
			},
		],
		keywords: ['range', 'slider', 'input', 'form', 'value', 'selection'],
		categories: ['form'],
	},
];

export default documentation;
