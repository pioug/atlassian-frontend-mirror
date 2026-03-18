import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'InlineEdit',
		description: 'A component for inline editing of text content.',
		status: 'general-availability',
		import: {
			name: 'InlineEdit',
			package: '@atlaskit/inline-edit',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for inline text editing',
			'Provide clear edit state indicators',
			'Handle save and cancel actions',
			'Consider validation requirements',
		],
		contentGuidelines: [
			'Use clear, descriptive text content',
			'Provide helpful placeholder text',
			'Use appropriate validation messages',
			'Keep content concise but meaningful',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Provide clear edit state indicators',
			'Use appropriate ARIA attributes',
			'Consider keyboard navigation',
		],
		examples: [
			{
				name: 'Inline Edit',
				description: 'Inline Edit example',
				source: path.resolve(__dirname, './examples/ai/inline-edit.tsx'),
			},
		],
		keywords: ['inline', 'edit', 'editable', 'text', 'input'],
		categories: ['form'],
	},
];

export default documentation;
