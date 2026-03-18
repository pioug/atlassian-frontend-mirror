import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Avatar',
		description:
			'A component for displaying user avatars with support for images, initials, and status indicators.',
		status: 'general-availability',
		import: {
			name: 'Avatar',
			package: '@atlaskit/avatar',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for user or entity (repo, space). Circle = person; hexagon = agent/AI; square = project/repo/space',
			'Use presence for availability; status for approval/permission states',
			'Use consistent sizing within the same context',
			'Place avatars in logical groupings (e.g., team members)',
			'Use presence indicators sparingly for real-time status only',
			'Provide fallback initials when images fail to load',
			'Always provide meaningful names for accessibility',
			'Use the `name` prop to include alternative text for screen readers',
			'For decorative images, remove the `name` prop or leave it empty so it will be ignored by assistive technologies',
			"Don't use a tooltip with an avatar when it's non-interactive or disabled. The tooltip won't work for keyboard users and screen readers",
		],
		contentGuidelines: [
			'Use full names when possible for better recognition',
			'For companies/projects, use descriptive names',
			"Avoid generic terms like 'User' or 'Admin'",
			'Use consistent naming conventions across your app',
			'Keep names concise but meaningful',
		],
		examples: [
			{
				name: 'Avatar',
				description: 'Avatar example',
				source: path.resolve(__dirname, './examples/ai/avatar.tsx'),
			},
		],
		keywords: ['avatar', 'user', 'profile', 'image', 'presence', 'status', 'representation'],
		categories: ['images', 'data-display'],
	},
	{
		name: 'AvatarItem',
		description:
			'A component that combines an avatar with text content for displaying user information in lists. AvatarItem combines an avatar with primary and secondary text to create a rich user representation in lists and menus. It supports both interactive (clickable) and non-interactive modes, making it perfect for user lists, team members, or any context where you need to display user information with actions.',
		status: 'general-availability',
		import: {
			name: 'AvatarItem',
			package: '@atlaskit/avatar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for displaying user information in lists and menus',
			'Choose between interactive and display-only based on context',
			'Provide clear primary and secondary text hierarchy',
			'Use consistent spacing and alignment within lists',
			'Consider the interaction pattern before implementation',
			'Use AvatarItem when you need to show user information with additional context like names, emails, or status information',
			'Provide clear primary and secondary text',
			'Use meaningful labels for accessibility',
			'Consider the interaction pattern (clickable vs display-only) based on your use case',
		],
		contentGuidelines: [
			'Use clear, descriptive primary text (usually names)',
			'Provide relevant secondary text (emails, roles, etc.)',
			'Keep text concise but informative',
			'Use consistent formatting across similar items',
			'Avoid redundant information between primary and secondary text',
		],
		examples: [
			{
				name: 'Avatar Item',
				description: 'Avatar Item example',
				source: path.resolve(__dirname, './examples/ai/avatar-item.tsx'),
			},
		],
		keywords: ['avatar', 'item', 'list', 'user', 'profile', 'interactive'],
		categories: ['images', 'data-display', 'interaction'],
	},
	{
		name: 'Presence',
		description:
			"A standalone component for displaying user presence indicators. Presence indicators show the current availability status of users. They help other users understand when someone is available for communication and are useful in collaborative applications where knowing someone's availability is important for workflow.",
		status: 'general-availability',
		import: {
			name: 'Presence',
			package: '@atlaskit/avatar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Prefer using `<Avatar presence="…" />` instead of `<Presence presence="…" />`',
			'Use sparingly for real-time status only',
			"Don't overuse as they can create visual clutter",
			'Show presence only when relevant to user workflow',
			'Use consistent presence states across the application',
			'Consider the context and user needs before showing presence',
			'Use presence indicators sparingly for real-time status',
			"Don't overuse them as they can create visual clutter",
			"Only show presence when it's relevant to the user's workflow",
		],
		contentGuidelines: [
			'Use clear, universally understood presence states',
			'Be consistent with presence terminology',
			'Provide clear visual distinction between states',
			'Avoid ambiguous or unclear presence indicators',
		],
		examples: [
			{
				name: 'Presence',
				description: 'Presence example',
				source: path.resolve(__dirname, './examples/ai/presence.tsx'),
			},
		],
		keywords: ['presence', 'status', 'online', 'offline', 'busy', 'focus', 'indicator'],
		categories: ['status', 'data-display'],
	},
	{
		name: 'Status',
		description:
			'A standalone component for displaying status indicators. Status indicators show the approval or permission state of users or entities. They help communicate important state information at a glance and are useful in workflow applications where approval states or permissions are important for user understanding.',
		status: 'general-availability',
		import: {
			name: 'Status',
			package: '@atlaskit/avatar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Prefer using `<Avatar status="…" />` instead of `<Status status="…" />`',
			'Use for approval states, permission levels, or important state information',
			'Make sure the status is relevant and helpful to user workflow',
			'Use consistent status states across the application',
			'Consider the context and user needs before showing status',
			"Don't overuse status indicators to avoid visual clutter",
			'Use status indicators to show approval states, permission levels, or other important state information that affects how users should interact with the entity',
			"Make sure the status is relevant and helpful to the user's workflow",
		],
		contentGuidelines: [
			'Use clear, universally understood status states',
			'Be consistent with status terminology',
			'Provide clear visual distinction between states',
			'Avoid ambiguous or unclear status indicators',
		],
		examples: [
			{
				name: 'Status',
				description: 'Status example',
				source: path.resolve(__dirname, './examples/ai/status.tsx'),
			},
		],
		keywords: ['status', 'approved', 'declined', 'locked', 'indicator', 'permission'],
		categories: ['status', 'data-display'],
	},
	{
		name: 'Skeleton',
		description:
			"A skeleton loading component for avatars that shows a placeholder while content is loading. Skeleton components provide visual feedback during loading states, helping users understand that content is being fetched. Skeleton components should match the size and shape of the actual content they're replacing to prevent layout shifts.",
		status: 'general-availability',
		import: {
			name: 'Skeleton',
			package: '@atlaskit/avatar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use during loading states to maintain layout stability',
			'Match the size and shape of the actual avatar content',
			'Prevent layout shifts by maintaining consistent dimensions',
			'Use for short loading periods (under 3 seconds)',
			'Consider using spinners for longer loading times',
			'Use skeleton avatars when user data is loading to maintain layout stability and provide visual feedback',
			'Match the size and shape of the actual avatar content to prevent layout shifts',
		],
		contentGuidelines: [
			'Keep skeleton content minimal and non-distracting',
			'Use consistent skeleton patterns across similar components',
			'Avoid overly detailed skeleton content',
			'Ensure skeleton content is clearly distinguishable from real content',
		],
		examples: [
			{
				name: 'Skeleton',
				description: 'Skeleton example',
				source: path.resolve(__dirname, './examples/ai/skeleton.tsx'),
			},
		],
		keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'avatar'],
		categories: ['loading', 'data-display'],
	},
	{
		name: 'AvatarContent',
		description:
			'A wrapper component for custom avatar content that provides consistent styling and behavior.',
		status: 'general-availability',
		import: {
			name: 'AvatarContent',
			package: '@atlaskit/avatar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for custom avatar content that needs consistent styling',
			'Wrap custom content to maintain avatar behavior',
			'Ensure custom content follows avatar design principles',
			"Use when standard avatar props don't meet your needs",
		],
		contentGuidelines: [
			'Ensure custom content is appropriate for avatar context',
			'Maintain consistent visual hierarchy',
			'Keep custom content simple and clear',
		],
		examples: [
			{
				name: 'Avatar Content',
				description: 'Avatar Content example',
				source: path.resolve(__dirname, './examples/ai/avatar-content.tsx'),
			},
		],
		keywords: ['avatar', 'content', 'custom', 'children', 'wrapper'],
		categories: ['images', 'data-display'],
	},
];

export default documentation;
