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
];

export default documentation;
