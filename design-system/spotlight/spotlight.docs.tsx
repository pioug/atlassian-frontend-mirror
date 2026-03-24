import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'SpotlightCard',
		description:
			'A spotlight introduces users to points of interest, from focused messages to multi-step tours.',
		status: 'open-beta',
		import: {
			name: 'SpotlightCard',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for onboarding, feature discovery, or highlighting UI',
			'Keep content to a single step when possible; max three steps for tours',
			'Always include a dismiss control as the first focusable element',
			'Use primary and secondary actions for buttons or links as needed',
		],
		accessibilityGuidelines: [
			'Dismiss control must be first focusable element',
			'Ensure spotlight content is understandable in seconds',
		],
		examples: [
			{
				name: 'Spotlight Card',
				description: 'Spotlight example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'onboarding', 'feature', 'discovery', 'card'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightHeader',
		description: 'Header section of a spotlight card. Contains the headline and controls.',
		status: 'open-beta',
		import: {
			name: 'SpotlightHeader',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Contains the headline and dismiss/control area'],
		examples: [
			{
				name: 'Spotlight Header',
				description: 'SpotlightHeader example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'header'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightBody',
		description: 'Main content area of a spotlight card.',
		status: 'open-beta',
		import: {
			name: 'SpotlightBody',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		examples: [
			{
				name: 'Spotlight Body',
				description: 'SpotlightBody example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'body', 'content'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightFooter',
		description: 'Footer section of a spotlight card. Contains action buttons or links.',
		status: 'open-beta',
		import: {
			name: 'SpotlightFooter',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Contains primary and secondary action buttons or links'],
		examples: [
			{
				name: 'Spotlight Footer',
				description: 'SpotlightFooter example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'footer', 'actions'],
		categories: ['navigation'],
	},
	{
		name: 'PopoverProvider',
		description:
			'Context provider for positioning spotlight content. Wrap with PopoverTarget and PopoverContent.',
		status: 'open-beta',
		import: {
			name: 'PopoverProvider',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Wraps the target element and spotlight content for positioning'],
		examples: [
			{
				name: 'Popover Provider',
				description: 'PopoverProvider example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'popover', 'provider', 'positioning'],
		categories: ['navigation'],
	},
	{
		name: 'PopoverContent',
		description: 'Renders the spotlight card content. Use with PopoverProvider and PopoverTarget.',
		status: 'open-beta',
		import: {
			name: 'PopoverContent',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Placement is static—choose placement that prevents overflow'],
		examples: [
			{
				name: 'Popover Content',
				description: 'PopoverContent example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'popover', 'content', 'positioning'],
		categories: ['navigation'],
	},
	{
		name: 'PopoverTarget',
		description:
			'The element the spotlight is positioned relative to. Use with PopoverProvider and PopoverContent.',
		status: 'open-beta',
		import: {
			name: 'PopoverTarget',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Wrap the UI element the spotlight points to'],
		examples: [
			{
				name: 'Popover Target',
				description: 'PopoverTarget example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'popover', 'target', 'positioning'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightDismissControl',
		description:
			'Required close/dismiss button for spotlight cards. Must be the first focusable element.',
		status: 'open-beta',
		import: {
			name: 'SpotlightDismissControl',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Required for all spotlights—must be the first focusable element for accessibility',
		],
		accessibilityGuidelines: ['Must be first focusable element for proper focus order'],
		examples: [
			{
				name: 'Spotlight Dismiss Control',
				description: 'SpotlightDismissControl example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'dismiss', 'close', 'control'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightHeadline',
		description: 'The headline/title of a spotlight card. Use within SpotlightHeader.',
		status: 'open-beta',
		import: {
			name: 'SpotlightHeadline',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Keep headlines concise and understandable in seconds'],
		examples: [
			{
				name: 'Spotlight Headline',
				description: 'SpotlightHeadline example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'headline', 'title'],
		categories: ['navigation'],
	},
	{
		name: 'SpotlightActions',
		description: 'Container for spotlight footer action buttons or links.',
		status: 'open-beta',
		import: {
			name: 'SpotlightActions',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Container for primary and secondary action buttons or links'],
		examples: [
			{
				name: 'Spotlight Actions',
				description: 'SpotlightActions example',
				source: path.resolve(__dirname, './examples/constellation/actions.tsx'),
			},
		],
		keywords: ['spotlight', 'actions', 'footer', 'buttons'],
		categories: ['navigation'],
	},
];

export default documentation;
