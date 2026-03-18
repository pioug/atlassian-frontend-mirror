import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Select',
		description: 'A flexible select component for single and multi-selection.',
		status: 'general-availability',
		import: {
			name: 'Select',
			package: '@atlaskit/select',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for choosing one or more from a list; common in forms and inline edit',
			'Use a visible label for the field—do not use placeholder as the only label (placeholder disappears and is not accessible)',
			'Use logical order (e.g. most selected first, numeric)',
			'Do not overwhelm with too many options',
			'Enable search for long option lists',
			'Consider loading states for async data',
			'Avoid alphabetical ordering (not localizable); use logical order for translatable option lists',
		],
		contentGuidelines: [
			'Write clear, descriptive option labels',
			'Use consistent terminology across options',
			'Keep option text concise but meaningful',
			'Group related options only when all items are groupable; use well-known categories or for disambiguation (e.g. Portland ME vs OR); no group of one',
		],
		accessibilityGuidelines: [
			'Use labels and helper text for the field—do not use placeholder as label (disappears on focus, not accessible)',
			'Clear control is removed from tab order; keyboard users clear selection via Delete',
			'Provide clear labels for all selects',
			'Ensure keyboard navigation with arrow keys',
			'Support screen reader announcements',
		],
		examples: [
			{
				name: 'Default',
				description: 'The default select appearance.',
				source: path.resolve(__dirname, './examples/constellation/select-appearance-default.tsx'),
			},
		],
		keywords: ['select', 'dropdown', 'form', 'input', 'options', 'choice', 'picker'],
		categories: ['form'],
	},
];

export default documentation;
