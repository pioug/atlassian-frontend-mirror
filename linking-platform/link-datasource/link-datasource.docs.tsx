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
	components: [
		{
			name: 'ConfluenceSearchConfigModal',
			description:
				'Configuration modal for the Confluence search datasource. Lets users set up a "list of links" backed by a Confluence search query (space, query, sort) and produces Confluence search datasource ADF.',
			status: 'general-availability',
			import: {
				name: 'ConfluenceSearchConfigModal',
				package: '@atlaskit/link-datasource/confluence-search-modal',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to define a list from Confluence search results. When editing, pass the current site and query in parameters.',
				'Save the Atlassian Document Format (ADF) configuration received by onInsert in the editor or app.',
				'Pass cloudId for a site the person can access and use its authenticated data integration to run searches.',
			],
			contentGuidelines: [
				'Keep the search scope understandable: use a clear search phrase and narrow it with spaces, content types, or dates when the resulting list would otherwise be too broad.',
			],
			accessibilityGuidelines: [
				'Open the modal from a control with a descriptive accessible name and wire `onCancel`. This modal does not currently forward `shouldReturnFocus`, so restore focus to the trigger from the host after cancel or insert completes. The modal owns its title, form labels, and focus lock, so do not add a second focus trap.',
			],
			keywords: ['link-datasource', 'confluence', 'search', 'datasource', 'config', 'modal'],
			categories: ['linking', 'data-display', 'forms'],
			examples: [
				{
					name: 'Confluence search config modal',
					description:
						'ConfluenceSearchConfigModal for configuring a Confluence search datasource.',
					source: `${packagePath}/examples/docs/confluence-search-config.tsx`,
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
				package: '@atlaskit/link-datasource/jira-issues-modal',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to choose Jira issues with a saved filter or Jira Query Language (JQL). When editing, pass the site and existing query in parameters.',
				'Save the Atlassian Document Format (ADF) value returned by onInsert in the editor or app. It contains the list configuration, not loaded issue records.',
				'Pass cloudId for the Jira site selected by the person.',
			],
			contentGuidelines: [
				'Prefer a narrow, readable JQL query or named filter that describes the intended issue set; avoid configuring a list that silently includes unrelated projects or sensitive issues.',
			],
			accessibilityGuidelines: [
				'Open the modal from a clearly named control, wire `onCancel`, and pass its trigger ref to `shouldReturnFocus`; focus return defaults to off. The modal provides its own dialog title and form labeling; avoid nesting another dialog or focus trap around it.',
			],
			keywords: ['link-datasource', 'jira', 'issues', 'datasource', 'config', 'modal', 'JQL'],
			categories: ['linking', 'data-display', 'forms'],
			examples: [
				{
					name: 'Jira issues config modal',
					description: 'JiraIssuesConfigModal for configuring a Jira issues datasource.',
					source: `${packagePath}/examples/docs/jira-issues-config.tsx`,
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
				package: '@atlaskit/link-datasource/assets-modal',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to choose Assets objects for a list. When editing, pass the workspace, schema, and Assets Query Language (AQL) query in parameters.',
				'Save the Atlassian Document Format (ADF) value returned by onInsert in the editor or app.',
				'Pass workspace and schema IDs the person can access; the modal does not grant access.',
			],
			contentGuidelines: [
				'Keep AQL aligned with the user’s task and selected schema; do not expose object fields or values that the user is not authorized to see.',
			],
			accessibilityGuidelines: [
				'Open the modal from a descriptive control and wire `onCancel`. This modal does not currently forward `shouldReturnFocus`, so restore focus to the trigger from the host after cancel or insert completes. The modal supplies its own dialog and field labeling, so do not add a second focus trap.',
			],
			keywords: ['link-datasource', 'assets', 'datasource', 'config', 'modal'],
			categories: ['linking', 'data-display', 'forms'],
			examples: [
				{
					name: 'Assets config modal',
					description: 'AssetsConfigModal for configuring an Assets datasource.',
					source: `${packagePath}/examples/docs/assets-config.tsx`,
				},
			],
		},
		{
			name: 'DatasourceTableView',
			description:
				'Table view component that renders a configured datasource (list of links) with configurable columns, sorting, and actions. Accepts a datasource ID and parameters, then fetches data through the host product’s authenticated services.',
			status: 'general-availability',
			import: {
				name: 'DatasourceTableView',
				package: '@atlaskit/link-datasource/datasource-table-view',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the datasource ID and its parameters, such as Jira cloudId and jql, to load the table rows through the app data clients.',
				'Save the Atlassian Document Format (ADF) configuration returned by the matching configuration modal, then pass its ID and parameters to this view. Use visibleColumnKeys to choose the displayed columns.',
				'Render within the app SmartCardProvider when link previews or actions need its client.',
			],
			contentGuidelines: [
				'Choose a query with a predictable scope and column set. Avoid exposing personal, restricted, or unrelated records in a broadly shared list.',
			],
			accessibilityGuidelines: [
				'Give the surrounding region a heading that identifies the list and keep the semantic table headers and sort controls intact. Do not wrap the view in another interactive grid; it provides its own table structure and loading/error states.',
			],
			keywords: ['link-datasource', 'table', 'datasource', 'list of links', 'view'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Jira issues table',
					description: 'DatasourceTableView showing Jira issues from a configured datasource.',
					source: `${packagePath}/examples/docs/jira-issues-table.tsx`,
				},
			],
		},
	],
};

export default documentation;
