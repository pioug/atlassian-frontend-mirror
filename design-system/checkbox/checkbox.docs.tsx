import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Checkbox',
		description:
			'A checkbox is an input control that allows a user to select one or more options from a number of choices.',
		status: 'general-availability',
		import: {
			name: 'Checkbox',
			package: '@atlaskit/checkbox',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for multiple choice selections from a list, or for explicit confirmation (e.g. settings)',
			'Use indeterminate state when some but not all children in a group are selected',
			'Group related checkboxes logically',
			'Provide clear labels for each option',
			'Consider default states carefully',
			'Use Radio for single selection; Dropdown for compact single choice; Toggle for on/off',
		],
		contentGuidelines: [
			'Write short, descriptive labels; no punctuation after labels',
			'Use consistent language across related options',
			'Avoid negative phrasing when possible',
			'Group related options together',
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid checkbox state',
			'Do not use disabled if the control must stay in tab order; use validation and error message so screen reader users hear why and how to proceed',
			'Ensure proper labeling for all checkboxes',
			'Use clear, descriptive labels that explain the choice',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		examples: [
			{
				name: 'Checkbox',
				description: 'Checkbox example',
				source: path.resolve(__dirname, './examples/ai/checkbox.tsx'),
			},
		],
		keywords: ['checkbox', 'input', 'form', 'selection', 'choice', 'option', 'multiple'],
		categories: ['forms-and-input'],
	},
];

export default documentation;
