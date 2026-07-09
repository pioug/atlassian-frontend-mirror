import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'TextField',
			description: 'A single-line text input component.',
			status: 'general-availability',
			import: {
				name: 'TextField',
				package: '@atlaskit/textfield/text-field',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for single-line text in forms, modals, search, cards',
				'Label is required (above input); helper text optional',
				'Do not use placeholder for critical info—use label or helper text (search exception: search icon + accessible label)',
				'Consider character limits and validation',
			],
			contentGuidelines: [
				'Write clear, short labels',
				'Use helper text for examples/formatting; keep helper visible after input',
				'Provide appropriate error messages',
				'Consider content length and formatting',
			],
			accessibilityGuidelines: [
				'Use visible label or proper association; do not use placeholder for critical info—use label or helper (search is exception with icon + accessible label)',
				'Do not nest interactive elements (causes focus issues)',
				'Custom validation: validate onBlur; use error container with aria-live="polite" and aria-relevant/aria-atomic for dynamic announcements',
				'Provide clear labels for all textfields',
				'Provide keyboard navigation support',
				'Indicate required fields clearly',
				'Use appropriate error states and messaging',
			],
			examples: [
				{
					name: 'Textfield',
					description: 'Textfield example',
					source: path.resolve(__dirname, './examples/ai/textfield.tsx'),
				},
			],
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=13076-28181',
				figmaNodeId: '13076:28181',
			},
			keywords: ['textfield', 'input', 'form', 'text', 'field', 'single-line'],
			categories: ['form'],
		},
	],
};

export default documentation;
