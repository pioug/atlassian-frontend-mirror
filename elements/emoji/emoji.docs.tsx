/**
 * Structured MCP docs for `@atlaskit/emoji`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
	package: {
		package: '@atlaskit/emoji',
		packagePath,
		packageJson,
		overview:
			'React components and utilities for displaying and picking emojis. It includes support for standard emojis, custom emojis, and skin tone variations.',
	},
	components: [
		{
			name: 'Emoji',
			description: 'A component for displaying a single emoji.',
			status: 'general-availability',
			import: {
				name: 'Emoji',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use data from the current emoji provider so custom emoji IDs, names, and images match the product catalog.',
				'Emoji announce their accessible name by default. Set isDecorative when nearby text already gives the same meaning. Use editorEmoji only within editor content, which manages announcements separately.',
				'Give custom emoji a short, descriptive name. Treat uploaded names and images as user content.',
			],
			keywords: ['emoji', 'display'],
			categories: ['elements'],
			examples: [
				{
					name: 'Basic emoji',
					description: 'Interactive inline emoji selection with a local selected state.',
					source: `${packagePath}/examples/ai/basic.tsx`,
				},
			],
		},
		{
			name: 'EmojiPicker',
			description: 'A component that provides a searchable picker for emojis.',
			status: 'general-availability',
			import: {
				name: 'EmojiPicker',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the emoji provider Promise configured for your app. It supplies search results, selection, and skin tone preferences.',
				'Handle onSelection in the app and return focus to the control that opened the picker when it closes. Keep the picker within the surrounding keyboard interaction.',
				'If uploads are enabled, check permissions and enforce the product content policy in the provider. Hiding the upload control does not prevent unauthorized uploads.',
			],
			keywords: ['emoji', 'picker', 'select'],
			categories: ['elements'],
			examples: [
				{
					name: 'Record a picker selection',
					description:
						'An emoji provider supplied by the host and a local accessible selection result.',
					source: `${packagePath}/examples/ai/picker-selection.tsx`,
				},
			],
		},
		{
			name: 'EmojiTypeAhead',
			description: 'A component that provides emoji suggestions based on user input.',
			status: 'general-availability',
			import: {
				name: 'EmojiTypeAhead',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `EmojiTypeAhead` beside the product-owned input that owns the query and text insertion. Forward the component keyboard methods from that input for arrow-key movement, Enter selection, and Escape dismissal.',
				'Keep the active suggestion and input value synchronized, and announce result changes through the input interaction. Do not put the suggestion list in a separate tab stop that interrupts the user’s typing flow.',
			],
			keywords: ['emoji', 'typeahead', 'autocomplete'],
			categories: ['elements'],
			examples: [
				{
					name: 'Standard emoji typeahead',
					description:
						'Legacy demo using deprecated layer constants and local helpers. Use an ADS popup or overlay to manage application layering.',
					source: `${packagePath}/examples/03-standard-emoji-typeahead.tsx`,
				},
				{
					name: 'Typeahead in a message input',
					description:
						'The input owns its value and keyboard commands while the user chooses an emoji.',
					source: `${packagePath}/examples/ai/typeahead-input.tsx`,
				},
			],
		},
		{
			name: 'EmojiPlaceholder',
			description: 'A temporary visual and status label while an emoji resource is loading.',
			status: 'general-availability',
			import: {
				name: 'EmojiPlaceholder',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this only while the emoji is unresolved; replace it with the final emoji so the loading state does not remain announced as content.',
				'Pass the same concise name that will be used by the resolved emoji, so the accessible name does not change unexpectedly when loading completes.',
			],
			keywords: ['emoji', 'placeholder', 'loading'],
			categories: ['elements'],
			examples: [
				{
					name: 'Resolve a loading emoji',
					description: 'Switch between a loading placeholder and resolved emoji with local state.',
					source: `${packagePath}/examples/ai/loading-placeholder.tsx`,
				},
			],
		},
		{
			name: 'ResourcedEmoji',
			description: 'Resolve and display an emoji through the host emoji provider.',
			status: 'general-availability',
			import: {
				name: 'ResourcedEmoji',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use an emoji ID from the provider passed to the component. That provider supplies its name and image for the current product.',
				'Check permissions and apply the product content policy before returning a custom emoji from the provider.',
			],
			keywords: ['emoji', 'resource', 'custom'],
			categories: ['elements'],
			examples: [
				{
					name: 'Switch provider-backed emoji',
					description:
						'Change the requested catalogue entry while keeping lookup in the host provider.',
					source: `${packagePath}/examples/ai/resourced-emoji.tsx`,
				},
			],
		},
		{
			name: 'EmojiUploader',
			description: 'A dialog flow for uploading a custom emoji through an upload-capable provider.',
			status: 'general-availability',
			import: {
				name: 'EmojiUploader',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show only after checking upload permission and configuring a provider with allowUpload enabled.',
				'Validate uploaded names and files and apply the product content policy. Add successful uploads to the provider catalog before showing them as available.',
				'Manage opening, closing, and focus return from the app. If focus lock is disabled, provide equivalent focus management.',
			],
			keywords: ['emoji', 'upload', 'custom'],
			categories: ['elements'],
			examples: [
				{
					name: 'Upload custom emoji',
					description:
						'Mount the uploader with an upload-capable, permission-checked host provider.',
					source: `${packagePath}/examples/ai/uploader.tsx`,
				},
			],
		},
		{
			name: 'EmojiTypeAheadItem',
			description: 'A single suggestion row for a product-owned emoji typeahead interaction.',
			status: 'general-availability',
			import: {
				name: 'EmojiTypeAheadItem',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use within the suggestion list for a text input. Your app manages the query, active option, list roles, and keyboard handling.',
				'Set selected from the active suggestion. Insert the selected emoji into the input using its short name or description.',
			],
			keywords: ['emoji', 'typeahead', 'suggestion'],
			categories: ['elements'],
			examples: [
				{
					name: 'Select a typeahead suggestion',
					description: 'A suggestion row updates local insertion state within a host-owned list.',
					source: `${packagePath}/examples/ai/typeahead-item.tsx`,
				},
			],
		},
	],
};

export default documentation;
