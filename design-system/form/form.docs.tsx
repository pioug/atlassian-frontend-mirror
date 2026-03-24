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
	{
		name: 'FormHeader',
		description:
			'The header section of a form, typically containing the title and optional description.',
		status: 'general-availability',
		import: {
			name: 'FormHeader',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use at the top of a form to provide context',
			'Include title and optional description or hint text',
			'Use RequiredAsterisk legend for required field indication',
		],
		contentGuidelines: ['Use clear, descriptive form titles', 'Keep descriptions concise'],
		examples: [
			{
				name: 'Form Header',
				description: 'FormHeader example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'header', 'title', 'description'],
		categories: ['form'],
	},
	{
		name: 'FormFooter',
		description: 'The footer section of a form, typically containing submit and cancel buttons.',
		status: 'general-availability',
		import: {
			name: 'FormFooter',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for primary and secondary actions',
			'Primary button on the right; include Cancel for dismissal',
			'Use align prop for left or right alignment',
		],
		contentGuidelines: [
			'Use action verbs in button labels',
			'Primary button reflects the form action',
		],
		examples: [
			{
				name: 'Form Footer',
				description: 'FormFooter example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'footer', 'actions', 'buttons'],
		categories: ['form'],
	},
	{
		name: 'FormSection',
		description: 'A section within a form that groups related fields together.',
		status: 'general-availability',
		import: {
			name: 'FormSection',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to group related fields logically',
			'Optional title for section heading',
			'Improves form scannability',
		],
		contentGuidelines: ['Use clear section titles when provided', 'Group related fields together'],
		examples: [
			{
				name: 'Form Section',
				description: 'FormSection example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'section', 'group', 'fields'],
		categories: ['form'],
	},
	{
		name: 'Field',
		description:
			'A form field wrapper that provides label, validation, and error handling. Used with any form control via the component prop.',
		status: 'general-availability',
		import: {
			name: 'Field',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for each form input; provide name, label, and component',
			'Use isRequired for required fields',
			'Use validate for validation logic; use helperMessage for instructions',
			'Wrap messages in MessageWrapper with HelperMessage, ErrorMessage, ValidMessage',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide specific error messages',
			'Use helper text for complex fields',
		],
		examples: [
			{
				name: 'Field',
				description: 'Field example',
				source: path.resolve(__dirname, './examples/constellation/form-field-simple.tsx'),
			},
		],
		keywords: ['form', 'field', 'input', 'validation'],
		categories: ['form'],
	},
	{
		name: 'Label',
		description:
			'A label component for form fields. Usually used internally by Field, but can be used standalone.',
		status: 'general-availability',
		import: {
			name: 'Label',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use with Field for field labels',
			'Associate with form controls via htmlFor',
		],
		contentGuidelines: ['Use clear, descriptive labels'],
		examples: [
			{
				name: 'Label',
				description: 'Standalone label associated with a text field via htmlFor / id',
				source: path.resolve(__dirname, './examples/ai/label-standalone.tsx'),
			},
		],
		keywords: ['form', 'label'],
		categories: ['form'],
	},
	{
		name: 'Legend',
		description:
			'A legend component for fieldset groups. Used with Fieldset for grouping related fields.',
		status: 'general-availability',
		import: {
			name: 'Legend',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use with Fieldset to describe a group of fields',
			'Required for accessibility',
		],
		contentGuidelines: ['Use clear, descriptive legend text'],
		examples: [
			{
				name: 'Legend',
				description: 'Legend example',
				source: path.resolve(__dirname, './examples/constellation/form-fieldset.tsx'),
			},
		],
		keywords: ['form', 'legend', 'fieldset'],
		categories: ['form'],
	},
	{
		name: 'HelperMessage',
		description: 'Displays helper or hint text for a form field.',
		status: 'general-availability',
		import: {
			name: 'HelperMessage',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use within MessageWrapper to show instructions or hints',
			'Place below the form control',
			'Use for critical info—not placeholder alone',
		],
		contentGuidelines: ['Provide clear, actionable instructions', 'Keep helper text concise'],
		examples: [
			{
				name: 'Helper Message',
				description: 'HelperMessage example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'helper', 'message', 'hint'],
		categories: ['form'],
	},
	{
		name: 'ErrorMessage',
		description: 'Displays validation error text for a form field.',
		status: 'general-availability',
		import: {
			name: 'ErrorMessage',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use within MessageWrapper when field validation fails',
			'Show specific, actionable error messages',
			'Place below the form control',
		],
		contentGuidelines: ['Provide specific error messages', 'Explain how to fix the error'],
		examples: [
			{
				name: 'Error Message',
				description: 'ErrorMessage example',
				source: path.resolve(__dirname, './examples/constellation/form-field-level-validation.tsx'),
			},
		],
		keywords: ['form', 'error', 'message', 'validation'],
		categories: ['form'],
	},
	{
		name: 'ValidMessage',
		description: 'Displays success or valid state feedback for a form field.',
		status: 'general-availability',
		import: {
			name: 'ValidMessage',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use within MessageWrapper when field passes validation',
			'Show positive feedback (e.g. "Username is available")',
			'Use sparingly to avoid clutter',
		],
		contentGuidelines: ['Keep valid messages concise'],
		examples: [
			{
				name: 'Valid Message',
				description: 'ValidMessage example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'valid', 'message', 'success'],
		categories: ['form'],
	},
	{
		name: 'MessageWrapper',
		description:
			'A wrapper for form field messages (HelperMessage, ErrorMessage, ValidMessage). Manages layout and visibility.',
		status: 'general-availability',
		import: {
			name: 'MessageWrapper',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Wrap HelperMessage, ErrorMessage, and ValidMessage in MessageWrapper',
			'Place below the form control within Field',
		],
		examples: [
			{
				name: 'Message wrapper',
				description: 'MessageWrapper grouping helper, error, and valid messages',
				source: path.resolve(__dirname, './examples/21-messages.tsx'),
			},
		],
		keywords: ['form', 'message', 'wrapper'],
		categories: ['form'],
	},
	{
		name: 'CheckboxField',
		description: 'A form field for checkbox inputs. Wraps Checkbox with form field behavior.',
		status: 'general-availability',
		import: {
			name: 'CheckboxField',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for single or grouped checkbox options',
			'Provide name and value props',
			'Works with Checkbox from @atlaskit/checkbox',
		],
		examples: [
			{
				name: 'Checkbox Field',
				description: 'CheckboxField example',
				source: path.resolve(__dirname, './examples/constellation/form-checkbox-field.tsx'),
			},
		],
		keywords: ['form', 'checkbox', 'field'],
		categories: ['form'],
	},
	{
		name: 'RangeField',
		description: 'A form field for range/slider inputs. Wraps Range with form field behavior.',
		status: 'general-availability',
		import: {
			name: 'RangeField',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for numeric range selection',
			'Provide min, max, and step when needed',
			'Works with Range from @atlaskit/range',
		],
		examples: [
			{
				name: 'Range Field',
				description: 'RangeField example',
				source: path.resolve(__dirname, './examples/constellation/form-range-field.tsx'),
			},
		],
		keywords: ['form', 'range', 'field', 'slider'],
		categories: ['form'],
	},
	{
		name: 'Fieldset',
		description:
			'Groups related form fields with a legend. Use for radio groups or logical groupings.',
		status: 'general-availability',
		import: {
			name: 'Fieldset',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use with Legend to describe the group',
			'Use for radio groups and logical field groupings',
			'Improves accessibility',
		],
		examples: [
			{
				name: 'Fieldset',
				description: 'Fieldset example',
				source: path.resolve(__dirname, './examples/constellation/form-fieldset.tsx'),
			},
		],
		keywords: ['form', 'fieldset', 'group'],
		categories: ['form'],
	},
	{
		name: 'RequiredAsterisk',
		description:
			'Visual indicator for required fields. Renders an asterisk (*) for form accessibility.',
		status: 'general-availability',
		import: {
			name: 'RequiredAsterisk',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use in FormHeader to indicate required fields legend',
			'Or use Field isRequired which handles asterisk automatically',
		],
		contentGuidelines: ['Pair with "Required fields are marked with an asterisk" text'],
		examples: [
			{
				name: 'Required Asterisk',
				description: 'RequiredAsterisk example',
				source: path.resolve(__dirname, './examples/constellation/form-default-complex.tsx'),
			},
		],
		keywords: ['form', 'required', 'asterisk'],
		categories: ['form'],
	},
	{
		name: 'CharacterCounterField',
		description:
			'A form field that includes character count display. Combines Field with CharacterCounter.',
		status: 'general-availability',
		import: {
			name: 'CharacterCounterField',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when character limits matter (e.g. descriptions, summaries)',
			'Provide maxLength for the limit',
			'Shows current count and limit',
		],
		examples: [
			{
				name: 'Character Counter Field',
				description: 'CharacterCounterField example',
				source: path.resolve(__dirname, './examples/constellation/form-character-counter.tsx'),
			},
		],
		keywords: ['form', 'character', 'counter', 'field'],
		categories: ['form'],
	},
	{
		name: 'CharacterCounter',
		description:
			'Displays character count for text inputs. Can be used standalone or with CharacterCounterField.',
		status: 'general-availability',
		import: {
			name: 'CharacterCounter',
			package: '@atlaskit/form',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when displaying character count for text inputs',
			'Provide current length and max length',
			'Use CharacterCounterField for integrated form field experience',
		],
		examples: [
			{
				name: 'Character Counter',
				description: 'CharacterCounter example',
				source: path.resolve(
					__dirname,
					'./examples/constellation/form-character-counter-standalone.tsx',
				),
			},
		],
		keywords: ['form', 'character', 'counter'],
		categories: ['form'],
	},
];

export default documentation;
