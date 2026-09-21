import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Button',
			description:
				'A versatile button component with multiple appearances and states for triggering actions. A button triggers an event or action. They let users know what will happen next.',
			status: 'general-availability',
			import: {
				name: 'Button',
				package: '@atlaskit/button/default/button',
				type: 'default',
				packagePath,
				packageJson,
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
					source: `${packagePath}/examples/constellation/new-button/button/button-disabled.tsx`,
				},
				{
					name: 'Danger',
					description:
						'A danger button appears as a final confirmation for a destructive and irreversible action, such as deleting.',
					source: `${packagePath}/examples/constellation/new-button/button/button-danger.tsx`,
				},
				{
					name: 'Icon after',
					description: 'Display an icon after the text.',
					source: `${packagePath}/examples/constellation/new-button/button/button-with-icon-after.tsx`,
				},
			],
			designSource: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-81007-1077',
				figmaNodeId: '81007:1077',
			},
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
				package: '@atlaskit/button/icon/button',
				type: 'default',
				packagePath,
				packageJson,
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
					source: `${packagePath}/examples/ai/icon-button.tsx`,
				},
			],
			keywords: ['button', 'icon', 'action', 'click', 'interactive', 'toolbar'],
			categories: ['form', 'interaction'],
		},
		{
			name: 'LinkIconButton',
			description:
				'An icon-only button that helps people navigate to a common link or page location.',
			status: 'general-availability',
			import: {
				name: 'LinkIconButton',
				package: '@atlaskit/button/icon/link',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for navigation or other actions that change the page URL or location',
				'Use an existing system icon with a clear, commonly understood meaning',
				'Use a link button with a text label when the icon alone would be ambiguous',
			],
			contentGuidelines: [
				'Always provide a clear and specific label for tooltips and screen readers',
				'Use sentence case for labels',
				'Specify the object being acted on where possible, such as "Edit page" instead of "Edit"',
			],
			accessibilityGuidelines: [
				'Always provide a meaningful label; it is rendered as visually hidden content for assistive technologies',
				'Avoid disabling buttons where possible',
			],
			examples: [
				{
					name: 'Link Icon Button',
					description: 'Link Icon Button example',
					source: `${packagePath}/examples/constellation/new-button/link-icon-button/link-icon-button.tsx`,
				},
			],
			keywords: ['button', 'icon', 'link', 'navigation', 'href', 'anchor'],
			categories: ['form', 'navigation', 'interaction'],
		},
		{
			name: 'SplitButton',
			description:
				'A button that splits into a primary action and a dropdown menu. The main button performs the primary action, while the dropdown arrow reveals additional related actions.',
			status: 'general-availability',
			import: {
				name: 'SplitButton',
				package: '@atlaskit/button/split-button/split-button',
				type: 'named',
				packagePath,
				packageJson,
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
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=51849-5001',
			},
			examples: [
				{
					name: 'Split Button',
					description: 'Split Button example',
					source: `${packagePath}/examples/ai/split-button.tsx`,
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
				package: '@atlaskit/button/link',
				type: 'default',
				packagePath,
				packageJson,
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
					source: `${packagePath}/examples/ai/link-button.tsx`,
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
				packagePath,
				packageJson,
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
					source: `${packagePath}/examples/ai/button-group.tsx`,
				},
			],
			keywords: ['button', 'group', 'container', 'layout', 'spacing'],
			categories: ['form', 'layout', 'interaction'],
		},
	],
};

export default documentation;
