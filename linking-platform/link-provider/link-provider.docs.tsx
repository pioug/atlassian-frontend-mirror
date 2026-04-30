/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'SmartCardProvider',
		description:
			'React context provider for Smart Links. Supplies the link client, store, and configuration (auth flow, renderers, preview panel) to Smart Link components such as Card. Wrap your app or the tree that renders Smart Links with SmartCardProvider.',
		status: 'general-availability',
		import: {
			name: 'SmartCardProvider',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use at the root of any tree that renders Smart Links (Card, HoverCard, etc.). Pass a CardClient or use the default; configure authFlow and renderers as needed.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure any custom renderers (snippet, emoji, adf) produce accessible output and do not change focus or semantics of child Smart Link components.',
		],
		keywords: ['link-provider', 'smart card', 'provider', 'context', 'SmartCardProvider'],
		categories: ['linking', 'data-display'],
		examples: [],
	},
	{
		name: 'CardClient',
		description:
			'HTTP client for fetching and resolving Smart Link metadata. Used by SmartCardProvider to load link details; can be supplied as a custom client for custom backends or testing.',
		status: 'general-availability',
		import: {
			name: 'CardClient',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use the default instance from SmartCardProvider, or pass a custom CardClient to SmartCardProvider when you need a different resolver endpoint or behavior.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'client', 'CardClient', 'resolver', 'fetch'],
		categories: ['linking'],
		examples: [],
	},
	{
		name: 'useSmartCardContext',
		description: 'Hook to access the Smart Link context (store, client, config, extractors) from within the SmartCardProvider tree.',
		status: 'general-availability',
		import: {
			name: 'useSmartCardContext',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when building custom components that need access to the link store, client, or extractors; must be used inside SmartCardProvider.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'hooks', 'context', 'useSmartCardContext'],
		categories: ['linking'],
		examples: [],
	},
	{
		name: 'useSmartLinkContext',
		description: 'Alias for useSmartCardContext. Hook to access the Smart Link context from within the SmartCardProvider tree.',
		status: 'general-availability',
		import: {
			name: 'useSmartLinkContext',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when building custom components that need the link store, client, or config; must be used inside SmartCardProvider.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'hooks', 'context', 'useSmartLinkContext'],
		categories: ['linking'],
		examples: [],
	},
	{
		name: 'SmartCardContext',
		description: 'React context object for Smart Links. Prefer useSmartCardContext or useSmartLinkContext; use SmartCardContext.Consumer only when hooks are not available.',
		status: 'general-availability',
		import: {
			name: 'SmartCardContext',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need context in a class component or without hooks; otherwise prefer useSmartCardContext.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'context', 'SmartCardContext'],
		categories: ['linking'],
		examples: [],
	},
	{
		name: 'EditorSmartCardProvider',
		description: 'Smart Card provider variant for editor environments, with value guard for type-safe access to editor-specific context.',
		status: 'general-availability',
		import: {
			name: 'EditorSmartCardProvider',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use in rich-text or page editors where Smart Links are rendered inside the editor and need editor-specific config (e.g. ADF renderers, preview panel).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'editor', 'EditorSmartCardProvider'],
		categories: ['linking', 'editor'],
		examples: [],
	},
];

export default documentation;
