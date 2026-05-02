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
		name: 'useSmartLinkClientExtension',
		description:
			'Hook that extends the CardClient from link-provider with Smart Link action invocation. Accepts a CardClient and returns an invoke function to call Smart Link actions (e.g. custom actions) via the resolver.',
		status: 'general-availability',
		import: {
			name: 'useSmartLinkClientExtension',
			package: '@atlaskit/link-client-extension',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need to invoke Smart Link actions (POST to resolver /invoke) from custom UI. Pass the client from useSmartLinkContext; use the returned invoke for action execution.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: [
			'link-client-extension',
			'hooks',
			'invoke',
			'actions',
			'useSmartLinkClientExtension',
		],
		categories: ['linking', 'interaction'],
		examples: [],
	},
	{
		name: 'useDatasourceClientExtension',
		description:
			'Hook that provides methods to fetch datasource details, datasource data (paginated), and actions discovery. Uses the Smart Link context client and caches responses. Required for rendering datasource tables or custom datasource UI.',
		status: 'general-availability',
		import: {
			name: 'useDatasourceClientExtension',
			package: '@atlaskit/link-client-extension',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when building UI that loads or displays datasource data (e.g. list of links from Jira, Confluence, Assets). Must be used inside SmartCardProvider. Use getDatasourceDetails, getDatasourceData, and getActionsDiscovery as needed.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-client-extension', 'hooks', 'datasource', 'useDatasourceClientExtension'],
		categories: ['linking', 'data-display'],
		examples: [],
	},
];

export default documentation;
