import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Textarea',
		description: 'A textarea is a multiline text input control for longer text content.',
		status: 'general-availability',
		import: {
			name: 'Textarea',
			package: '@atlaskit/textarea',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for long-form, multi-line text in forms',
			'Expandable height; label and optional helper text',
			'Do not use placeholder for critical info—use label or helper text',
			'Use TextField for short, single-line input',
		],
		contentGuidelines: [
			'Label as noun string (e.g. "Description" not "Modal title + Description")',
			'Use helper text to clarify; do not put critical info in placeholder',
			'Provide appropriate error messages',
			'Consider content length and formatting',
		],
		accessibilityGuidelines: [
			'Ensure label is associated with the textarea',
			'Do not use placeholder for critical info—use label or helper (search exception only with icon + accessible label)',
			'Provide clear labels for all textareas',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		examples: [
			{
				name: 'Textarea',
				description: 'Textarea example',
				source: path.resolve(__dirname, './examples/ai/textarea.tsx'),
			},
		],
		keywords: ['textarea', 'input', 'form', 'text', 'multiline', 'input', 'field'],
		categories: ['forms-and-input'],
	},
];

export default documentation;
