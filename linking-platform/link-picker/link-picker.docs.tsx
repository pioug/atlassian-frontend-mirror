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
		name: 'LinkPicker',
		description:
			'Standalone link picker UI that lets users search and select links to insert. Supports plugins for different data sources (recents, search, Jira, Confluence, etc.) and can be used in modals, popups, or inline.',
		status: 'general-availability',
		import: {
			name: 'LinkPicker',
			package: '@atlaskit/link-picker',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the user needs to choose a link to insert (e.g. in an editor, form, or toolbar). Add plugins to define tabs and data sources; use SmartCardProvider above the picker so selected links resolve correctly.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the picker is focusable and has an accessible name (e.g. "Insert link"). Provide a keyboard-accessible way to open and close; ensure search and results are announced to screen readers.',
		],
		keywords: ['link-picker', 'link', 'picker', 'search', 'insert link', 'plugins'],
		categories: ['linking', 'interaction', 'forms'],
		examples: [
			{
				name: 'Link Picker (basic)',
				description:
					'Basic LinkPicker with URL input and submit. Requires plugins for search results.',
				source: path.resolve(packagePath, './examples/00-basic.tsx'),
			},
			{
				name: 'Link Picker (without plugins)',
				description: 'LinkPicker without plugins — manual URL entry only.',
				source: path.resolve(packagePath, './examples/20-without-plugins.tsx'),
			},
		],
	},
	// Needs examples
	// {
	// 	name: 'LoaderFallback',
	// 	description: 'Fallback UI shown while the LinkPicker (or its lazy-loaded parts) are loading.',
	// 	status: 'general-availability',
	// 	import: {
	// 		name: 'LoaderFallback',
	// 		package: '@atlaskit/link-picker',
	// 		type: 'named',
	// 		packagePath,
	// 		packageJson,
	// 	},
	// 	usageGuidelines: [
	// 		'Use when rendering LinkPicker lazily (e.g. via react-loosely-lazy) to show a consistent loading state until the picker is ready.',
	// 	],
	// 	contentGuidelines: [],
	// 	accessibilityGuidelines: [
	// 		'Ensure the fallback is announced as loading (e.g. aria-busy or live region) so screen reader users know content is pending.',
	// 	],
	// 	keywords: ['link-picker', 'loader', 'fallback', 'lazy'],
	// 	categories: ['linking', 'interaction'],
	// 	examples: [],
	// },
];

export default documentation;
