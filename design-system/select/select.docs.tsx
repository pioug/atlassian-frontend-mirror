import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Select',
		description:
			'Select allows users to make a single selection or multiple selections from a list of options.',
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
	{
		name: 'AsyncSelect',
		description:
			'A select component that loads options asynchronously. Use when options are fetched from an API or loaded on demand.',
		status: 'general-availability',
		import: {
			name: 'AsyncSelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for options loaded from API or async data',
			'Provide clear loading states while fetching',
			'Cache options when users search repeatedly',
		],
		keywords: ['select', 'async', 'dropdown', 'form', 'api'],
		categories: ['form'],
	},
	{
		name: 'CreatableSelect',
		description:
			'A select that allows users to create new options. Use when users can add custom values not in the predefined list.',
		status: 'general-availability',
		import: {
			name: 'CreatableSelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when users need to add custom options',
			'Validate new values before creation',
		],
		keywords: ['select', 'creatable', 'dropdown', 'form', 'custom'],
		categories: ['form'],
	},
	{
		name: 'PopupSelect',
		description:
			'A select that opens in a popup overlay. Use when the select needs to render in a portal or overlay context.',
		status: 'general-availability',
		import: {
			name: 'PopupSelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when select must render in overlay/portal',
			'Consider z-index and layering with modals',
			'Ensure proper focus management',
		],
		keywords: ['select', 'popup', 'dropdown', 'overlay', 'portal'],
		categories: ['form'],
	},
	{
		name: 'CheckboxSelect',
		description:
			'A multi-select with checkbox indicators for each option. Use when multiple selections need explicit visual confirmation.',
		status: 'general-availability',
		import: {
			name: 'CheckboxSelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for multi-select when checkbox affordance improves clarity',
		],
		keywords: ['select', 'checkbox', 'multi', 'dropdown', 'form'],
		categories: ['form'],
	},
	{
		name: 'RadioSelect',
		description:
			'A single-select with radio indicators for each option. Use when radio-style selection affordance is needed.',
		status: 'general-availability',
		import: {
			name: 'RadioSelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for single-select when radio affordance improves clarity',
		],
		keywords: ['select', 'radio', 'single', 'dropdown', 'form'],
		categories: ['form'],
	},
	{
		name: 'CountrySelect',
		description: 'A select pre-configured for country selection with country data.',
		status: 'general-availability',
		import: {
			name: 'CountrySelect',
			package: '@atlaskit/select',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for country selection in forms',
			'Provides built-in country options and search',
		],
		keywords: ['select', 'country', 'dropdown', 'form', 'localization'],
		categories: ['form'],
	},
];

export default documentation;
