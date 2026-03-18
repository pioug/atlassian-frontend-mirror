import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Form',
		description: 'A component for building forms with validation and state management.',
		status: 'general-availability',
		import: {
			name: 'Form',
			package: '@atlaskit/form',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when users need to provide and submit information (settings, create work item)',
			'Use with textfield, select, radio, checkbox and other form controls',
			'Structure: title, description, required legend, asterisk, helper text, labels above fields, character counter where needed, sections, footer with primary/secondary actions',
			'Provide clear field labels and instructions',
			'Mark required fields with asterisk (*)',
			'Provide specific error messages',
		],
		contentGuidelines: [
			'Use clear, concise labels',
			'Use labels and helper text for critical info—not placeholder alone (exception: search with icon + label)',
			'Provide specific error messages',
			'Use consistent terminology',
			'Always include a visible label (exception: search fields)',
			'Match field length to intended content length',
		],
		accessibilityGuidelines: [
			'Autofocus the first field when appropriate',
			'Use visible labels for all fields (search is the exception)',
			'Never disable the submit button—use validation and instructions so users know how to proceed',
			'Support autofill tokens and persist form state on refresh where appropriate',
			'Use inline validation with clear instructions',
			'Provide clear labels for all form fields',
			'Ensure keyboard navigation between fields',
			'Mark required fields clearly',
		],
		examples: [
			{
				name: 'Form',
				description: 'Form example',
				source: path.resolve(__dirname, './examples/ai/form.tsx'),
			},
		],
		keywords: ['form', 'validation', 'field', 'input', 'submit', 'state'],
		categories: ['form'],
	},
];

export default documentation;
