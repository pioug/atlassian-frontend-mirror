/**
 * Structured MCP docs for `@atlaskit/mention`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/mention',
		packagePath,
		packageJson,
		overview:
			'React components for displaying user and team mentions. It includes support for mention items, lists, and pickers with integration for profile cards and presence.',
	},
	components: [
		{
			name: 'Mention',
			description: 'A component for displaying a single mention.',
			status: 'general-availability',
			import: {
				name: 'Mention',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `Mention` to render a user or team reference in existing content; keep the supplied display text meaningful and recognizable.',
				'Provide a real click handler only when the mention is actionable, and make the resulting action clear to users.',
				'For searchable selection, use `MentionPicker` with the product’s authenticated provider.',
			],
			keywords: ['mention', 'user', 'team'],
			categories: ['elements'],
			examples: [
				{
					name: 'Mention display and list',
					description:
						'Render mention chips and selectable mention lists with a host-provided resource provider.',
					source: `${packagePath}/examples/ai/mention-display.tsx`,
				},
			],
		},
		{
			name: 'MentionPicker',
			description: 'A component that provides a searchable picker for mentions.',
			status: 'general-availability',
			import: {
				name: 'MentionPicker',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `MentionPicker` to allow users to select a user or team to mention.',
				'Pass the product’s authenticated `MentionProvider` to fetch and manage mention data.',
				'Connect the picker to a labelled text input and handle the selected mention in the app.',
			],
			keywords: ['mention', 'picker', 'select'],
			categories: ['elements'],
			examples: [
				{
					name: 'Host-backed mention picker',
					description:
						'Connect a labelled search input to a host-provided mention provider and handle selection.',
					source: `${packagePath}/examples/ai/mention-picker.tsx`,
				},
			],
		},
		{
			name: 'MentionItem',
			description: 'A selectable row for one user or team mention in a mention menu.',
			status: 'general-availability',
			import: {
				name: 'MentionItem',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `MentionItem` inside a results list; the app still needs to filter results and manage keyboard selection.',
				'Provide a recognizable name and useful secondary detail so people can distinguish similar results.',
			],
			keywords: ['mention', 'menu', 'result'],
			categories: ['elements'],
			examples: [
				{
					name: 'Mention display and list',
					description: 'Render a selectable mention result.',
					source: `${packagePath}/examples/ai/mention-display.tsx`,
				},
			],
		},
		{
			name: 'MentionList',
			description: 'A selectable list of mention results.',
			status: 'general-availability',
			import: {
				name: 'MentionList',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `MentionList` for results the app already has, and update the list when the search text changes.',
				'For typeahead, connect the list to a labelled search field and handle the selected mention in the app.',
			],
			keywords: ['mention', 'list', 'results'],
			categories: ['elements'],
			examples: [
				{
					name: 'Mention display and list',
					description: 'Render a selectable list of mention results.',
					source: `${packagePath}/examples/ai/mention-display.tsx`,
				},
			],
		},
		{
			name: 'ResourcedMention',
			description:
				'A mention chip that can resolve its display name and highlight state through a mention provider.',
			status: 'general-availability',
			import: {
				name: 'ResourcedMention',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the mention provider that knows this ID, and keep it in the same account context so the displayed name belongs to the intended person.',
			],
			keywords: ['mention', 'resource', 'display'],
			categories: ['elements'],
			examples: [
				{
					name: 'Mention display and list',
					description: 'Resolve a mention through a host-provided provider.',
					source: `${packagePath}/examples/ai/mention-display.tsx`,
				},
			],
		},
		{
			name: 'ResourcedMentionList',
			description: 'A mention-results list populated from a mention provider.',
			status: 'general-availability',
			import: {
				name: 'ResourcedMentionList',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the current search text and provider for the signed-in account. Handle selection in the search field, and pass fetch failures through `resourceError` so the app can explain what happened.',
			],
			keywords: ['mention', 'resource', 'search'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Mention display and list',
					description: 'Render provider-backed mention results.',
					source: `${packagePath}/examples/ai/mention-display.tsx`,
				},
			],
		},
	],
};

export default documentation;
