/**
 * Structured MCP docs for `@atlaskit/media-card`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/media-card',
		packagePath,
		packageJson,
		overview:
			'Card component for displaying media files (images, video, documents) with loading, error, and progress states.',
	},
	components: [
		{
			name: 'Card',
			description: 'The main component for displaying media files as cards.',
			status: 'general-availability',
			import: {
				name: 'Card',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `Card` to display media files in a grid or list.',
				'Use a card when people need a visual preview or file-level actions; use an inline card when the file belongs within sentence text.',
			],
			accessibilityGuidelines: [
				'Give image cards meaningful alternate text when the preview conveys information, and ensure any custom card actions have clear accessible names.',
				'Provide adjacent status text when a surrounding workflow needs people to distinguish loading, failure, and ready states.',
			],
			contentGuidelines: [
				'Use the file name or a concise description to identify each attachment; do not rely on the preview alone to communicate which file is shown.',
				'Keep fallback and error copy near the card, and explain the next useful action when the host can retry or replace the file.',
			],
			keywords: ['media', 'card', 'file preview', 'attachment', 'image', 'video'],
			categories: ['media'],
			examples: [
				{
					name: 'File card flow',
					description:
						'Render a host-identified file with its name, preview text, viewer, and download action.',
					source: `${packagePath}/examples/ai/card.tsx`,
				},
			],
		},
		{
			name: 'MediaInlineCard',
			description:
				'Renders a compact media file reference within surrounding text. Use it for inline attachment mentions rather than a standalone preview card.',
			status: 'general-availability',
			import: {
				name: 'MediaInlineCard',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Place inline media references in the text flow where users need to recognize or open a file without a full card preview.',
				'When media metadata may not include a file name, provide `fallbackMediaNameFetcher` so the reference can still identify the file.',
			],
			examples: [
				{
					name: 'Inline media reference',
					description:
						'Show a host-identified media file inline, with a host-provided fallback filename resolver.',
					source: `${packagePath}/examples/ai/media-inline-card.tsx`,
				},
			],
			keywords: ['media', 'inline card', 'attachment', 'file reference'],
			categories: ['media'],
		},
		{
			name: 'CardSync',
			description:
				'Renders a media card synchronously when the host needs the card module immediately. Use the standard `Card` export for the lazy-loaded experience.',
			status: 'general-availability',
			import: {
				name: 'CardSync',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use CardSync when your app needs immediate rendering. Otherwise use Card, which loads its media implementation on demand.',
			],
			examples: [
				{
					name: 'Synchronous media card',
					description: 'Pass the host media client configuration and file identifier to CardSync.',
					source: `${packagePath}/examples/ai/card-sync.tsx`,
				},
			],
			keywords: ['media card', 'synchronous card', 'attachment preview'],
			categories: ['media'],
		},
		{
			name: 'CardPlaceholder',
			description: 'Reserves the card footprint before a media card begins loading.',
			status: 'general-availability',
			import: {
				name: 'CardPlaceholder',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a placeholder to reserve space before the media card loads, and pass the same dimensions as the final card to prevent the layout from shifting.',
			],
			accessibilityGuidelines: [
				'Pair the visual placeholder with host-provided status text when loading progress matters to users.',
			],
			examples: [
				{
					name: 'Media card loading states',
					description:
						'Compare the placeholder, loading, and error visuals with host-provided labels and retry handling.',
					source: `${packagePath}/examples/ai/card-static-states.tsx`,
				},
			],
			keywords: ['media placeholder', 'attachment loading', 'card skeleton'],
			categories: ['media'],
		},
		{
			name: 'CardLoading',
			description: 'Shows a visual loading treatment while media card content is being prepared.',
			status: 'general-availability',
			import: {
				name: 'CardLoading',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			accessibilityGuidelines: [
				'Expose loading status in nearby host content when the visual treatment alone is not sufficient.',
			],
			examples: [
				{
					name: 'Media card loading states',
					description:
						'Compare the placeholder, loading, and error visuals with host-provided labels and retry handling.',
					source: `${packagePath}/examples/ai/card-static-states.tsx`,
				},
			],
			keywords: ['media loading', 'attachment progress', 'card loading'],
			categories: ['media'],
		},
		{
			name: 'CardError',
			description: 'Shows the media card error visual when a preview cannot be displayed.',
			status: 'general-availability',
			import: {
				name: 'CardError',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show with an explanation of the error and an available retry or recovery action.',
			],
			accessibilityGuidelines: [
				'Do not use the error icon as the only explanation; provide nearby text that identifies the problem and any recovery action.',
			],
			examples: [
				{
					name: 'Media card loading states',
					description:
						'Compare the placeholder, loading, and error visuals with host-provided labels and retry handling.',
					source: `${packagePath}/examples/ai/card-static-states.tsx`,
				},
			],
			keywords: ['media error', 'attachment error', 'card fallback'],
			categories: ['media'],
		},
	],
};

export default documentation;
