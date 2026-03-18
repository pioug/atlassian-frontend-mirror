import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Button',
		description:
			'A versatile button component with multiple appearances and states for triggering actions. A button triggers an event or action. They let users know what will happen next. Note the root entrypoint of `@atlaskit/button` is deprecated and being replaced with `@atlaskit/button/new`.',
		status: 'general-availability',
		import: {
			name: 'Button',
			package: '@atlaskit/button/new',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use primary buttons for the main action on a page',
			'Limit to one primary button per section',
			'Use compact size for tight spaces',
			'Use subtle buttons for secondary actions',
			'Use danger buttons sparingly for destructive actions',
			'Group related buttons together with ButtonGroup',
			'Use buttons for actions; use links for navigation (different semantics and assistive tech behavior)',
		],
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			'Avoid generic terms like "Submit" or "Click here"',
			'Use sentence case',
			'Keep button labels consistent with surrounding UI (e.g. modal primary button should reflect modal intent)',
			'Use buttons for actions, links for navigation',
			'Only include one primary call to action (CTA) per area',
			"Start with the verb and specify what's being acted on",
			"Don't use punctuation in button labels",
		],
		accessibilityGuidelines: [
			'Always provide meaningful labels for screen readers',
			'Provide loading state announcements for async actions',
		],
		examples: [
			{
				name: 'Disabled',
				description:
					"Set `isDisabled` to disable a button that shouldn't be actionable. The button will appear faded and won't respond to user interaction. Disabled buttons can cause accessibility issues (disabled elements are not in the tab order) so wherever possible, avoid using `isDisabled`. Instead, use [validation](/components/button/usage) or other techniques to show users how to proceed.",
				source: path.resolve(
					__dirname,
					'./examples/constellation/new-button/button/button-disabled.tsx',
				),
			},
			{
				name: 'Danger',
				description:
					'A danger button appears as a final confirmation for a destructive and irreversible action, such as deleting.',
				source: path.resolve(
					__dirname,
					'./examples/constellation/new-button/button/button-danger.tsx',
				),
			},
			{
				name: 'Icon after',
				description: 'Display an icon after the text.',
				source: path.resolve(
					__dirname,
					'./examples/constellation/new-button/button/button-with-icon-after.tsx',
				),
			},
		],
		keywords: ['button', 'action', 'click', 'submit', 'form', 'interactive', 'cta'],
		categories: ['form', 'interaction'],
	},
	{
		name: 'IconButton',
		description:
			'A button that displays only an icon with an optional tooltip. Perfect for toolbar actions, compact interfaces, and when space is limited.',
		status: 'general-availability',
		import: {
			name: 'IconButton',
			package: '@atlaskit/button/new',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for toolbar actions and compact interfaces',
			'Choose icons that clearly represent their function',
			'Group related icon buttons together',
			'Use sparingly to avoid visual clutter',
			'Consider using tooltips for additional context',
			'Always provide a meaningful label for accessibility',
			'The icon should clearly represent the action it performs',
		],
		contentGuidelines: [
			'Use clear, concise, descriptive labels',
			'Use action verbs (e.g., "Edit item", "Delete comment")',
			'Choose icons that are universally understood',
			'Avoid using icons without labels in critical actions',
		],
		examples: [
			{
				name: 'Icon Button',
				description: 'Icon Button example',
				source: path.resolve(__dirname, './examples/ai/icon-button.tsx'),
			},
		],
		keywords: ['button', 'icon', 'action', 'click', 'interactive', 'toolbar'],
		categories: ['form', 'interaction'],
	},
	{
		name: 'SplitButton',
		description:
			'A button that splits into a primary action and a dropdown menu. The main button performs the primary action, while the dropdown arrow reveals additional related actions.',
		status: 'general-availability',
		import: {
			name: 'SplitButton',
			package: '@atlaskit/button/new',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Always must have exactly two children: `Button` and `DropdownMenu` that are related to each other',
			'Use `shouldRenderToParent` on `DropdownMenu` for proper positioning',
			'Make the primary action the most common or important action',
			'Limit dropdown items to avoid overwhelming users',
		],
		contentGuidelines: [
			'Use clear, action-oriented text for the primary button',
			'Keep dropdown item labels concise and descriptive',
			'Use consistent terminology across related actions',
		],
		accessibilityGuidelines: ['Provide descriptive labels for the IconButton trigger'],
		examples: [
			{
				name: 'Split Button',
				description: 'Split Button example',
				source: path.resolve(__dirname, './examples/ai/split-button.tsx'),
			},
		],
		keywords: ['button', 'split', 'dropdown', 'menu', 'action', 'options'],
		categories: ['form', 'interaction'],
	},
	{
		name: 'LinkButton',
		description:
			'A button that renders as an anchor tag for navigation. Combines the visual appearance of a button with the semantic behavior of a link.',
		status: 'general-availability',
		import: {
			name: 'LinkButton',
			package: '@atlaskit/button/new',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation actions that change the URL',
			'Use for external links and internal navigation',
			"Consider using regular buttons for actions that don't navigate",
			'Provide clear visual indication of link behavior',
			'Use consistent styling with other buttons when appropriate',
			'Use for navigation actions that should look like buttons but behave like links',
			'Perfect for external links, internal navigation, or any action that changes the URL',
		],
		contentGuidelines: [
			'Use clear, descriptive text that indicates the destination',
			'Be specific about where the link will take the user',
			'Use action-oriented language when appropriate',
			"Avoid generic terms like 'Click here' or 'Learn more'",
		],
		examples: [
			{
				name: 'Link Button',
				description: 'Link Button example',
				source: path.resolve(__dirname, './examples/ai/link-button.tsx'),
			},
		],
		keywords: ['button', 'link', 'navigation', 'href', 'anchor'],
		categories: ['form', 'navigation', 'interaction'],
	},
	{
		name: 'ButtonGroup',
		description:
			'A component for grouping related buttons together with consistent spacing and alignment.',
		status: 'general-availability',
		import: {
			name: 'ButtonGroup',
			package: '@atlaskit/button/button-group',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for related actions that belong together',
			'Group buttons that perform similar or complementary actions',
			'Maintain consistent spacing and alignment',
			'Consider the visual hierarchy within the group',
			"Don't group unrelated actions together",
			'Use when you have multiple related actions that should be visually grouped',
			'Provides consistent spacing and alignment between buttons',
		],
		contentGuidelines: [
			'Ensure button labels are consistent in tone and style',
			'Use parallel structure for related actions',
			'Keep labels concise but descriptive',
			'Consider the order of actions within the group',
		],
		examples: [
			{
				name: 'Button Group',
				description: 'Button Group example',
				source: path.resolve(__dirname, './examples/ai/button-group.tsx'),
			},
		],
		keywords: ['button', 'group', 'container', 'layout', 'spacing'],
		categories: ['form', 'layout', 'interaction'],
	},
	{
		name: 'Button (Legacy)',
		description:
			'Legacy button component (deprecated). Use Button from @atlaskit/button/new instead.',
		status: 'intent-to-deprecate',
		import: {
			name: 'Button',
			package: '@atlaskit/button',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use the new Button component from @atlaskit/button/new instead',
			'Migrate existing usage to the new Button API',
			'Consider this component deprecated',
		],
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			"Avoid generic terms like 'Submit' or 'Click here'",
		],
		accessibilityGuidelines: [
			'Always provide meaningful labels for screen readers',
			'Provide loading state announcements for async actions',
		],
		examples: [
			{
				name: '99 Button Old Button',
				description: '99 Button Old Button example',
				source: path.resolve(__dirname, './examples/99-button-old-button.tsx'),
			},
		],
		keywords: ['button', 'legacy', 'deprecated', 'action', 'click', 'submit', 'form'],
		categories: ['form', 'interaction'],
	},
];

export default documentation;
