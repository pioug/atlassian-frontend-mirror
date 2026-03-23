import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'InlineDialog',
		description:
			'A component opened by user action (e.g. click) for further info or actions for a section—not crucial to the whole page.',
		status: 'intent-to-deprecate',
		import: {
			name: 'InlineDialog',
			package: '@atlaskit/inline-dialog',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Trigger by user action (e.g. click); do not open automatically',
			'Use for section-level info or actions, not page-critical content',
			'Keep content concise; only one inline dialog open at a time',
			'Good for feature discovery and contextual controls',
			'Anatomy: trigger, window, controls (buttons, checkboxes, text fields)',
			'Use Inline message for alerts; Flag for confirmations; Modal for complex or long content',
		],
		contentGuidelines: [
			'Use clear, concise dialog content',
			'Provide meaningful dialog titles',
			'Keep content focused and relevant',
			'Use appropriate dialog sizing',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Provide clear dialog labels',
			'Use appropriate ARIA attributes',
			'Consider keyboard navigation',
		],
		examples: [
			{
				name: 'Inline Dialog',
				description: 'Inline Dialog example',
				source: path.resolve(__dirname, './examples/ai/inline-dialog.tsx'),
			},
		],
		keywords: ['dialog', 'inline', 'popup', 'overlay', 'tooltip'],
		categories: ['overlay'],
	},
];

export default documentation;
