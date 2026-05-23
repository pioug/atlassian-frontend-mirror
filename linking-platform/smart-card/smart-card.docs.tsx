/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Card',
			description:
				'Smart Links enhance URLs into interactive previews, offering a contextualized experience within Atlassian products. They come in inline, block, and embed formats, respecting content permissions and compliance settings.',
			status: 'general-availability',
			import: {
				name: 'Card',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use inline for links in body text; block when you need extra context or a card-style preview; embed when users should engage with the linked content in place.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Use descriptive link text for inline appearance; avoid generic "click here" or the raw URL when possible.',
				'Ensure the card container is keyboard focusable and has a clear accessible name indicating it is a link or preview.',
				'Ensure loading and error states are announced to screen readers (e.g. aria-live or status text).',
			],
			keywords: ['smart-card', 'card', 'smart link', 'inline', 'block', 'embed', 'link', 'preview'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Card (basic)',
					description:
						'Inline, block, and embed appearances shown side by side. Requires staging login to resolve links.',
					source: path.resolve(packagePath, './examples/content/card.tsx'),
				},
				{
					name: 'Card (appearance: block)',
					description:
						'Block appearance — card-style preview with detailed view of the linked material. In the editor this is referred to as the "Card".',
					source: path.resolve(packagePath, './examples/content/block-card.tsx'),
				},
				{
					name: 'Card (appearance: inline)',
					description:
						'Inline appearance — link in text like a hyperlink. Use showHoverPreview for hover preview on inline Smart Links.',
					source: path.resolve(packagePath, './examples/content/inline-card.tsx'),
				},
				{
					name: 'Card (appearance: embed)',
					description:
						'Embed appearance — linked content rendered in place. Requires a resolvable embed URL; not all links support embed.',
					source: path.resolve(packagePath, './examples/content/embed-card.tsx'),
				},
			],
		},
		{
			name: 'HoverCard',
			description:
				'Hover cards can be used as a standalone component to wrap any React component and display information about a supplied URL when the user hovers over the child. Different actions are shown depending on the resource type.',
			status: 'general-availability',
			import: {
				name: 'HoverCard',
				package: '@atlaskit/smart-card/hover-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need a Smart Link preview on hover over a custom trigger (e.g. text, icon). For hover preview on inline Smart Links in body text, use Card with showHoverPreview instead.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Provide a keyboard-accessible way to open the preview (e.g. focus or explicit trigger); do not rely on hover alone.',
				'Ensure the trigger element has an accessible name and role (e.g. link or button).',
				'Ensure the hover card content is announced when shown (e.g. aria-describedby or live region) and can be dismissed via keyboard.',
			],
			keywords: ['smart-card', 'hover card', 'hover', 'preview', 'smart link'],
			categories: ['linking', 'data-display', 'interaction'],
			examples: [
				{
					name: 'Hover card',
					description:
						'HoverCard wrapping a trigger element; shows Smart Link preview on hover. Requires staging login to resolve.',
					source: path.resolve(packagePath, './examples/content/hover-card.tsx'),
				},
			],
		},
		{
			name: 'LinkUrl',
			description:
				'LinkUrl is a plain hyperlink (<a>) with a built-in safety check. Use it when you want to warn users if the link description looks like one URL but the actual destination is different.',
			status: 'general-availability',
			import: {
				name: 'LinkUrl',
				package: '@atlaskit/smart-card/link-url',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the link text might look like one URL but point elsewhere—e.g. user-generated or external links—so users get a warning before navigating.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Use descriptive link text that indicates the destination or action; avoid exposing only the URL when possible.',
				'Ensure the safety-check warning (when link text and destination differ) is announced to screen readers.',
			],
			keywords: ['smart-card', 'link', 'url', 'safety', 'hyperlink'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Link URL',
					description:
						'Link safety: when link text looks like a URL but destination differs (warning) vs when text matches or is plain (no warning).',
					source: path.resolve(packagePath, './examples/content/link-url.tsx'),
				},
			],
		},
		{
			name: 'FlexibleCard',
			description:
				'Flexible Smart Links (FlexibleCard / Flexible UI) is a composable system of data elements inside UI blocks for building custom Smart Link views. It does not affect inline, block, or embed appearance.',
			status: 'general-availability',
			import: {
				name: 'TitleBlock',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need a custom block-style Smart Link layout. Define the layout with blocks first (title, metadata, preview, footer), then add elements inside blocks for granular content.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Use a logical structure (e.g. heading hierarchy) so the card is navigable by assistive tech.',
				'Ensure all interactive elements inside blocks (links, buttons, actions) are focusable and have accessible names.',
			],
			keywords: [
				'smart-card',
				'flexible',
				'flexible card',
				'flexible ui',
				'blocks',
				'elements',
				'composable',
			],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible UI card',
					description:
						'Custom block layout with TitleBlock, PreviewBlock, MetadataBlock, SnippetBlock, and FooterBlock composed inside Card.',
					source: path.resolve(packagePath, './examples/content/flexible-ui-card.tsx'),
				},
			],
		},
		{
			name: 'TitleBlock',
			description:
				'A block component for the Smart Link title row. Used inside FlexibleCard to show title, icon, and optional metadata and actions.',
			status: 'general-availability',
			import: {
				name: 'TitleBlock',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for the main title row of a block Smart Link when you need title, icon, optional subtitle, metadata, or actions in one row.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Ensure the title is exposed as a heading or has an accessible name so it is announced as the primary label for the card.',
				'If the title row icon conveys meaning, give it an accessible name (e.g. aria-label); otherwise mark as decorative.',
			],
			keywords: ['smart-card', 'title block', 'flexible', 'block'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Title block default',
					description:
						'TitleBlock with default props; title and icon come from the resolved link data.',
					source: path.resolve(packagePath, './examples/content/title-block-default.tsx'),
				},
			],
		},
		{
			name: 'MetadataBlock',
			description:
				'A block component that displays a row of metadata elements (e.g. created by, due date, state) in a Smart Link.',
			status: 'general-availability',
			import: {
				name: 'MetadataBlock',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need a single row of metadata (e.g. created by, due date, state) in a block Smart Link.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Ensure metadata is available to screen readers (e.g. not conveyed only by color or icon).',
				'Use a list or group with an accessible name if the metadata row has a specific purpose (e.g. "Contributors", "Dates").',
			],
			keywords: ['smart-card', 'metadata block', 'flexible', 'block', 'metadata'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Metadata block primary',
					description:
						'MetadataBlock with a primary row showing CollaboratorGroup and ModifiedOn elements.',
					source: path.resolve(packagePath, './examples/content/metadata-block-primary.tsx'),
				},
			],
		},
		{
			name: 'PreviewBlock',
			description: 'A block component that displays a preview image or media for the Smart Link.',
			status: 'general-availability',
			import: {
				name: 'PreviewBlock',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the linked resource has a preview image or media and you want to surface it in the block card.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'If the preview image conveys information, provide meaningful alt text; if purely decorative, use alt="" or aria-hidden.',
				'Ensure no critical information is shown only in the preview; duplicate in text or metadata when needed.',
			],
			keywords: ['smart-card', 'preview block', 'flexible', 'block', 'preview', 'image'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Preview block default',
					description: "PreviewBlock showing the resolved link's preview image when available.",
					source: path.resolve(packagePath, './examples/content/preview-block-default.tsx'),
				},
			],
		},
		{
			name: 'FooterBlock',
			description:
				'A block component for the Smart Link footer, typically showing actions (e.g. copy, open, follow).',
			status: 'general-availability',
			import: {
				name: 'FooterBlock',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use at the bottom of a FlexibleCard when you need actions such as copy link, open, or follow.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Give each action button or control an accessible name (e.g. "Copy link", "Open in new tab") so purpose is clear to screen readers.',
				'Ensure actions are keyboard operable and appear in a logical tab order.',
			],
			keywords: ['smart-card', 'footer block', 'flexible', 'block', 'actions'],
			categories: ['linking', 'data-display', 'interaction'],
			examples: [
				{
					name: 'Footer block default',
					description:
						'FooterBlock with default actions (e.g. copy, open, follow) at the bottom of the card.',
					source: path.resolve(packagePath, './examples/content/footer-block-default.tsx'),
				},
			],
		},
		{
			name: 'useSmartLinkEvents',
			description:
				'Hook that returns a SmartLinkEvents object for dispatching analytics events for a given URL. Currently supports insertSmartLink.',
			status: 'general-availability',
			import: {
				name: 'useSmartLinkEvents',
				package: '@atlaskit/smart-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need to fire Smart Link analytics (e.g. insert events) from custom UI that is not the default Card.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Use analytics events to understand usage; ensure event wiring does not change focus, interrupt screen readers, or alter semantics.',
			],
			keywords: ['smart-card', 'hooks', 'analytics', 'useSmartLinkEvents', 'events'],
			categories: ['linking', 'analytics'],
			examples: [
				{
					name: 'Analytics',
					description:
						'Card with AnalyticsListener capturing and displaying Smart Link analytics events (e.g. on click).',
					source: path.resolve(packagePath, './examples/content/analytics.tsx'),
				},
			],
		},
		{
			name: 'useSmartLinkActions',
			description:
				'Hook that extracts and returns actions for a given URL. Relies on Smart Link context; usages must be wrapped in SmartCardProvider or equivalent.',
			status: 'general-availability',
			import: {
				name: 'useSmartLinkActions',
				package: '@atlaskit/smart-card/hooks',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when building custom action UI (buttons, menus) that should expose Smart Link actions (e.g. Preview, Open) for a given URL.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'When rendering actions from this hook (e.g. buttons or menus), provide accessible labels (e.g. from action.text) and ensure keyboard support.',
			],
			keywords: ['smart-card', 'hooks', 'useSmartLinkActions', 'actions'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'useSmartLinkActions',
					description:
						'useSmartLinkActions used to get actions for a URL and invoke one (e.g. Preview) from a custom button.',
					source: path.resolve(packagePath, './examples/content/useSmartLinkActions.tsx'),
				},
			],
		},
	],
};

export default documentation;
