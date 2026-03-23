import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'InlineEdit',
		description:
			'An inline edit displays a custom input component that switches between reading and editing on the same page.',
		status: 'general-availability',
		import: {
			name: 'InlineEdit',
			package: '@atlaskit/inline-edit',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when you need custom input components or layout',
			'Use InlineEditableTextfield for standard text field use cases',
			'Provide clear edit state indicators',
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
	{
		name: 'InlineEditableTextfield',
		description:
			'An inline editable text field displays a text field that switches between reading and editing on the same page.',
		status: 'general-availability',
		import: {
			name: 'InlineEditableTextfield',
			package: '@atlaskit/inline-edit',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for existing content in a text field that may need tweaking',
			'Use where multiple items on a page can be edited at once',
			'Don\'t use if the main function of the screen is editing—use a text area instead',
			'Use InlineEdit when you need custom input components',
		],
		contentGuidelines: [
			'Use concise, sentence case labels',
			'Customise placeholder text for empty state',
			'Keep labels descriptive of the field',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management between read and edit states',
			'Provide clear save/cancel controls',
			'Use appropriate ARIA attributes',
		],
		examples: [
			{
				name: 'Inline Editable Textfield',
				description: 'InlineEditableTextfield example',
				source: path.resolve(__dirname, './examples/constellation/inline-editable-textfield-default.tsx'),
			},
		],
		keywords: ['inline', 'edit', 'editable', 'textfield', 'text', 'input'],
		categories: ['form'],
	},
];

export default documentation;
