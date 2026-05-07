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
		name: 'ConfluenceSearchConfigModal',
		description:
			'Configuration modal for the Confluence search datasource. Lets users set up a "list of links" backed by a Confluence search query (space, query, sort) and produces Confluence search datasource ADF.',
		status: 'general-availability',
		import: {
			name: 'ConfluenceSearchConfigModal',
			package: '@atlaskit/link-datasource',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the user is configuring a Confluence search-based list of links (e.g. in a block or sidebar). On confirm, use the returned parameters to build datasource ADF or pass to DatasourceTableView.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus is trapped; form fields (space, query, sort) must have labels and error messages announced.',
		],
		keywords: ['link-datasource', 'confluence', 'search', 'datasource', 'config', 'modal'],
		categories: ['linking', 'data-display', 'forms'],
		examples: [
			{
				name: 'Confluence search config modal',
				description: 'ConfluenceSearchConfigModal for configuring a Confluence search datasource.',
				source: path.resolve(
					packagePath,
					'./docs/examples/basic-confluence-search-config-modal.tsx',
				),
			},
		],
	},
	{
		name: 'JiraIssuesConfigModal',
		description:
			'Configuration modal for the Jira issues datasource. Lets users set up a list of Jira issues (JQL, columns, filters) and produces Jira issues datasource ADF.',
		status: 'general-availability',
		import: {
			name: 'JiraIssuesConfigModal',
			package: '@atlaskit/link-datasource',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the user is configuring a Jira issues list (e.g. in a block or table). On confirm, use the returned parameters for datasource ADF or DatasourceTableView.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus management; JQL and column pickers must have clear labels and error announcements.',
		],
		keywords: ['link-datasource', 'jira', 'issues', 'datasource', 'config', 'modal', 'JQL'],
		categories: ['linking', 'data-display', 'forms'],
		examples: [
			{
				name: 'Jira issues config modal',
				description: 'JiraIssuesConfigModal for configuring a Jira issues datasource.',
				source: path.resolve(packagePath, './docs/examples/basic-jira-issues-config-modal.tsx'),
			},
			{
				name: 'Jira issues table',
				description: 'Basic Jira issues table view using datasource.',
				source: path.resolve(packagePath, './examples/basic-jira-issues-table.tsx'),
			},
		],
	},
	{
		name: 'AssetsConfigModal',
		description:
			'Configuration modal for the Assets (object schema) datasource. Lets users set up a list of links from an Assets schema and produces Assets datasource ADF.',
		status: 'general-availability',
		import: {
			name: 'AssetsConfigModal',
			package: '@atlaskit/link-datasource',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the user is configuring an Assets-based list of links. On confirm, use the returned parameters for datasource ADF or table view.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and that schema/object pickers have clear labels.',
		],
		keywords: ['link-datasource', 'assets', 'datasource', 'config', 'modal'],
		categories: ['linking', 'data-display', 'forms'],
		examples: [
			{
				name: 'Assets config modal',
				description: 'AssetsConfigModal for configuring an Assets datasource.',
				source: path.resolve(packagePath, './docs/examples/basic-assets-config-modal.tsx'),
			},
		],
	},
	{
		name: 'DatasourceTableView',
		description:
			'Table view component that renders a datasource (list of links) with configurable columns, sorting, and actions. Consumes datasource ADF or parameters and fetches data via the link client.',
		status: 'general-availability',
		import: {
			name: 'DatasourceTableView',
			package: '@atlaskit/link-datasource',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need to display a list of links (Jira issues, Confluence search, Assets) in a table. Pass the datasource ADF or parameters; wrap in SmartCardProvider so resolution and actions work.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the table has a caption or aria-label; column headers and sort controls must be focusable and announced. Loading and error states should be announced.',
		],
		keywords: ['link-datasource', 'table', 'datasource', 'list of links', 'view'],
		categories: ['linking', 'data-display'],
		examples: [
			{
				name: 'Jira issues table',
				description: 'DatasourceTableView showing Jira issues from a configured datasource.',
				source: path.resolve(packagePath, './examples/basic-jira-issues-table.tsx'),
			},
		],
	},
	// Needs examples
	// {
	// 	name: 'buildDatasourceAdf',
	// 	description:
	// 		'Utility that builds datasource ADF (ADF node for list of links) from datasource parameters. Used to persist or pass datasource config into the editor or table view.',
	// 	status: 'general-availability',
	// 	import: {
	// 		name: 'buildDatasourceAdf',
	// 		package: '@atlaskit/link-datasource',
	// 		type: 'named',
	// 		packagePath,
	// 		packageJson,
	// 	},
	// 	usageGuidelines: [
	// 		'Use when you have datasource parameters (e.g. from a config modal) and need to produce the corresponding ADF node for the editor or for DatasourceTableView.',
	// 	],
	// 	contentGuidelines: [],
	// 	accessibilityGuidelines: [],
	// 	keywords: ['link-datasource', 'adf', 'datasource', 'build', 'utility'],
	// 	categories: ['linking', 'data-display'],
	// 	examples: [],
	// },
];

export default documentation;
