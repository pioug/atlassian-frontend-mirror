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
		name: 'Link extractors',
		description:
			'Functions for extracting props and metadata from JSON-LD. Includes genericExtractPropsFromJSONLD for type-based extraction, plus extractors for common fields (title, preview, provider, dates, persons, Smart Link embed, etc.). Used by Smart Link components to turn resolver JSON-LD into UI props.',
		status: 'general-availability',
		import: {
			name: 'genericExtractPropsFromJSONLD',
			package: '@atlaskit/link-extractors',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need to parse JSON-LD from the Smart Link resolver (or other link metadata) into structured props for custom UI. Use Smart Link–specific extractors (extractSmartLinkTitle, extractSmartLinkEmbed, etc.) for Smart Link details.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-extractors', 'json-ld', 'extract', 'smart link', 'metadata'],
		categories: ['linking'],
		examples: [],
	},
];

export default documentation;
