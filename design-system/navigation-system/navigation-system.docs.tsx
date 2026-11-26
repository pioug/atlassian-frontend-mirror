/**
 * Structured MCP docs for `@atlaskit/navigation-system`.
 */

import type {
	PackageMetadata,
	StructuredContentSource,
} from '@atlassian/structured-docs-types/types';

// A static JSON import fails CI's TSRS project-reference check (TS6307).
// This annotation types downstream consumers; require does not validate the JSON shape.
const packageJson: PackageMetadata['packageJson'] = require('./package.json');

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/navigation-system',
		packagePath,
		packageJson,
		overview:
			'The latest navigation system for Atlassian apps. It provides a flexible layout system for top and side navigation, including components for product logos, search, and global actions.',
	},
	components: [
		{
			name: 'ChatPanel',
			description:
				'A full-height layout area for chat at the inline end of the app, below the banner and alongside the top navigation and main content. It overlays the page when there is not enough room beside Main. Requires the platform-dst-chat-panel-layout feature gate.',
			status: 'early-access',
			import: {
				name: 'ChatPanel',
				package: '@atlaskit/navigation-system/layout/chat-panel',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this app-level area for a chat experience that remains alongside the page. For internal Atlassian apps, keep contextual panels scoped to the main content area using Panel System.',
				'Compose ChatPanel as a direct child of Root after Main and any other layout slots, rather than nesting it inside Main or TopNav.',
				'Include a visible close action and an entry point for reopening chat so users can return to their primary task.',
			],
			accessibilityGuidelines: [
				'Return focus to the chat entry point after an explicit close action or when dismissal removes the focused element. If focus has already moved outside chat, preserve it on that control or region.',
				'Give the chat region a meaningful accessible name that distinguishes it from other page regions.',
				'Give the PanelSplitter an accessible label describing the chat area it resizes. Preserve its built-in pointer and keyboard resizing controls.',
			],
			keywords: ['chat', 'rovo', 'assistant', 'layout', 'panel', 'resize', 'overlay'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Resizable chat panel',
					description:
						'Open, close and resize a chat layout area using public package imports. The host must enable platform-dst-chat-panel-layout. AI-generated example; please review.',
					source: `${packagePath}/examples/ai/chat-panel.tsx`,
				},
			],
		},
		{
			name: 'TopNav',
			description: 'The horizontal top navigation bar component.',
			status: 'general-availability',
			import: {
				name: 'TopNav',
				package: '@atlaskit/navigation-system/layout/top-nav',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Render `TopNav` within the `Root` component to provide global navigation and actions.',
			],
			keywords: ['navigation', 'top-nav', 'header'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Top navigation',
					description: 'Basic usage of the top navigation bar.',
					source: `${packagePath}/examples/top-navigation.vr.ap.tsx`,
				},
			],
		},
	],
};

export default documentation;
