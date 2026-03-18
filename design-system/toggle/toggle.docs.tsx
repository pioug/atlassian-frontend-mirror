import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Toggle',
		description: 'A toggle is used to view or switch between enabled or disabled states.',
		status: 'general-availability',
		import: {
			name: 'Toggle',
			package: '@atlaskit/toggle',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for binary on/off states',
			"Provide clear labels that describe the toggle's function",
			'Use appropriate default states',
			'Consider immediate vs. delayed state changes',
			'Use consistent toggle behavior across the interface',
		],
		contentGuidelines: [
			'Write clear, descriptive labels',
			'Use action-oriented language when appropriate',
			'Ensure labels clearly indicate what the toggle controls',
			'Use consistent terminology across toggles',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all toggles',
			'Use appropriate ARIA attributes for toggle state',
			'Ensure keyboard navigation support',
			'Provide clear visual feedback for state changes',
			"Use descriptive labels that explain the toggle's purpose",
		],
		examples: [
			{
				name: 'Toggle',
				description: 'Toggle example',
				source: path.resolve(__dirname, './examples/ai/toggle.tsx'),
			},
		],
		keywords: ['toggle', 'switch', 'on-off', 'enabled', 'disabled', 'state'],
		categories: ['forms-and-input'],
	},
];

export default documentation;
