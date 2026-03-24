import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'DropdownMenu',
		description: 'A dropdown menu component for displaying contextual actions and options.',
		status: 'general-availability',
		import: {
			name: 'DropdownMenu',
			package: '@atlaskit/dropdown-menu',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for 5–15 items; navigation or command (action on selection)',
			'Avoid truncation—check max width; avoid truncated labels',
			'Nested menu: maximum two layers',
			'In a modal, use shouldRenderToParent for correct focus and screen reader behavior',
			'Disabled triggers are not supported (see Button a11y)',
			'Use Select for search/select; Checkbox for multiple from list; Radio for short single choice',
		],
		contentGuidelines: [
			'Logical order (e.g. most selected first); group with uppercase section title',
			'Use verbs for actions, nouns for links; no articles; single line per item',
			'Use clear, descriptive menu item labels',
			'Keep menu item text concise',
			'Group related actions logically',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: [
			'Avoid truncation—ensure max width does not cut off labels',
			'Focus lock when open; keyboard open should focus first item',
			'Nested menu: maximum two layers',
			'In modal use shouldRenderToParent for focus and voicing',
			'Provide clear labels for dropdown triggers',
			'Ensure keyboard navigation with arrow keys',
			'Use appropriate ARIA attributes',
		],
		examples: [
			{
				name: 'Dropdown Menu',
				description: 'Dropdown Menu example',
				source: path.resolve(__dirname, './examples/ai/dropdown-menu.tsx'),
			},
		],
		keywords: ['dropdown', 'menu', 'actions', 'options', 'popup', 'contextual'],
		categories: ['navigation', 'interaction'],
	},
	{
		name: 'DropdownItem',
		description:
			'A dropdown item populates the dropdown menu with items. Use for links or actions; every item must be inside a DropdownItemGroup. Can also be used as the trigger for a nested submenu.',
		status: 'general-availability',
		import: {
			name: 'DropdownItem',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use inside DropdownMenu with DropdownItemGroup (required parent)',
			'Use for links (href) or actions (onClick); verbs for actions, nouns for links; no articles; single line per item',
			'For a nested submenu: use as the trigger (pass triggerRef and trigger props, use elemAfter e.g. chevron); keep to maximum two layers',
		],
		contentGuidelines: [
			'Use clear, descriptive menu item labels',
			'Keep menu item text concise',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: [
			'Avoid truncation—ensure max width does not cut off labels',
			'Ensure keyboard navigation with arrow keys',
		],
		examples: [
			{
				name: 'Dropdown Menu',
				description: 'Dropdown Menu with DropdownItem example',
				source: path.resolve(__dirname, './examples/ai/dropdown-menu.tsx'),
			},
		],
		keywords: ['dropdown', 'menu', 'item', 'action', 'link', 'menuitem'],
		categories: ['navigation', 'interaction'],
	},
	{
		name: 'DropdownItemGroup',
		description:
			'Wrapping element for dropdown menu items. Use to group related items; optional short uppercase title (e.g. "Edit page", "Tools") separates sections.',
		status: 'general-availability',
		import: {
			name: 'DropdownItemGroup',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use inside DropdownMenu to group related items',
			'Use short, uppercase title to describe the group',
			'Nested menu: maximum two layers',
		],
		contentGuidelines: [
			'Group related actions logically',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: ['Provide clear group titles', 'Nested menu: maximum two layers'],
		examples: [
			{
				name: 'Dropdown Menu',
				description: 'Dropdown Menu with DropdownItemGroup example',
				source: path.resolve(__dirname, './examples/ai/dropdown-menu.tsx'),
			},
		],
		keywords: ['dropdown', 'menu', 'group', 'section', 'title'],
		categories: ['navigation', 'interaction'],
	},
	{
		name: 'DropdownItemCheckbox',
		description:
			'A dropdown menu item with checkbox selection. Use for multiple selection from a list (e.g. status filters, show/hide toggles).',
		status: 'general-availability',
		import: {
			name: 'DropdownItemCheckbox',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use with DropdownItemCheckboxGroup; control selection with isSelected and onClick',
			'Use for multiple selection from a list or toggles (e.g. categories, column visibility)',
			'Group related checkboxes; use short uppercase title on DropdownItemCheckboxGroup',
		],
		contentGuidelines: ['Use clear, descriptive labels', 'Keep menu item text concise'],
		accessibilityGuidelines: [
			'Ensure keyboard navigation and clear selection state',
			'Use appropriate ARIA attributes',
		],
		examples: [
			{
				name: 'Dropdown Menu',
				description: 'Dropdown Menu with checkbox items example',
				source: path.resolve(__dirname, './examples/ai/dropdown-menu.tsx'),
			},
		],
		keywords: ['dropdown', 'menu', 'checkbox', 'multi-select', 'toggle'],
		categories: ['navigation', 'interaction', 'form'],
	},
	{
		name: 'DropdownItemCheckboxGroup',
		description:
			'Groups DropdownItemCheckbox components for multi-select options within a dropdown menu.',
		status: 'general-availability',
		import: {
			name: 'DropdownItemCheckboxGroup',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to group related DropdownItemCheckbox items',
			'Use for multiple selection from a list',
		],
		contentGuidelines: ['Group related checkboxes logically', 'Use consistent terminology'],
		examples: [
			{
				name: 'Checkbox group',
				description: 'DropdownItemCheckboxGroup with titled section and checkbox items.',
				source: path.resolve(
					__dirname,
					'./examples/constellation/dropdown-item-checkbox-selected.tsx',
				),
			},
		],
		keywords: ['dropdown', 'menu', 'checkbox', 'group', 'multi-select'],
		categories: ['navigation', 'interaction', 'form'],
	},
	{
		name: 'DropdownItemRadio',
		description:
			'A dropdown menu item with radio selection. Use for single selection from a short list (e.g. view mode, sort order).',
		status: 'general-availability',
		import: {
			name: 'DropdownItemRadio',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use with DropdownItemRadioGroup; control selection with isSelected and onClick',
			'Use for single selection from a short list (e.g. views, density)',
			'Group related radio items; use short uppercase title on DropdownItemRadioGroup',
		],
		contentGuidelines: ['Use clear, descriptive labels', 'Keep menu item text concise'],
		accessibilityGuidelines: [
			'Ensure keyboard navigation and clear selection state',
			'Use appropriate ARIA attributes',
		],
		examples: [
			{
				name: 'Dropdown Menu',
				description: 'Dropdown Menu with radio items example',
				source: path.resolve(__dirname, './examples/ai/dropdown-menu.tsx'),
			},
		],
		keywords: ['dropdown', 'menu', 'radio', 'single-select', 'choice'],
		categories: ['navigation', 'interaction', 'form'],
	},
	{
		name: 'DropdownItemRadioGroup',
		description:
			'Groups DropdownItemRadio components for single-select options within a dropdown menu.',
		status: 'general-availability',
		import: {
			name: 'DropdownItemRadioGroup',
			package: '@atlaskit/dropdown-menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to group related DropdownItemRadio items',
			'Use for single selection from a short list',
		],
		contentGuidelines: ['Group related radio items logically', 'Use consistent terminology'],
		examples: [
			{
				name: 'Radio group',
				description: 'DropdownItemRadioGroup with titled section and radio items.',
				source: path.resolve(
					__dirname,
					'./examples/constellation/dropdown-item-radio-selected.tsx',
				),
			},
		],
		keywords: ['dropdown', 'menu', 'radio', 'group', 'single-select'],
		categories: ['navigation', 'interaction', 'form'],
	},
];

export default documentation;
