import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'JQLEditor',
			description:
				'An advanced JQL (Jira Query Language) editor component with autocomplete, syntax highlighting, and validation support.',
			status: 'general-availability',
			import: {
				name: 'JQLEditor',
				package: '@atlaskit/jql-editor',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use JQLEditor to enable users to author and validate JQL queries.',
				'Use product-scoped autocomplete data so suggestions reflect the fields and values users can actually query.',
				'Keep the current query in app state and run the product search from the search callback.',
			],
			accessibilityGuidelines: [
				'The editor exposes a labelled combobox and announces autocomplete state; keep visible instructions nearby so users understand the query task and available help.',
			],
			examples: [
				{
					name: 'Controlled editor with host provider',
					description:
						'Connect host-provided autocomplete, keep the query controlled, and report when the search callback runs.',
					source: `${packagePath}/examples/ai/jql-editor-controlled.tsx`,
				},
			],
			keywords: ['jql', 'editor', 'jira', 'query', 'autocomplete', 'search'],
			categories: ['interaction', 'data-display'],
		},
		{
			name: 'JQLEditorAsync',
			description:
				'An asynchronously loaded JQL editor that displays a read-only query layout while its editor code loads.',
			status: 'general-availability',
			import: {
				name: 'JQLEditorAsync',
				package: '@atlaskit/jql-editor',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to load the editor when it is needed. The fallback displays the query while loading; it cannot be edited.',
				'Keep the query and autocomplete data available while the editor loads.',
			],
			accessibilityGuidelines: [
				'Keep a visible task heading or instructions adjacent to the editor so context remains clear during the read-only loading fallback.',
			],
			keywords: ['jql', 'async', 'lazy-load', 'query', 'autocomplete'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Asynchronously loaded editor',
					description:
						'Keep the query and host autocomplete provider connected while the editor loads.',
					source: `${packagePath}/examples/ai/jql-editor-async.tsx`,
				},
			],
		},
		{
			name: 'JQLEditorReadOnly',
			description:
				'A read-only JQL query layout used while the asynchronously loaded editor code is loading; it does not provide editing or autocomplete.',
			status: 'general-availability',
			import: {
				name: 'JQLEditorReadOnly',
				package: '@atlaskit/jql-editor',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use while JQLEditorAsync loads. Replace it with the loaded editor so people can edit or run the query.',
				'Pass the same query to both components so it remains visible while the editor loads.',
			],
			accessibilityGuidelines: [
				'Keep the task heading or instructions visible during loading; this fallback exposes a read-only combobox and does not provide the editable editor’s autocomplete behavior.',
			],
			keywords: ['jql', 'read-only', 'query', 'saved-filter'],
			categories: ['data-display'],
			examples: [
				{
					name: 'Async editor loading fallback',
					description: 'Show the query layout temporarily while the JQL editor loads.',
					source: `${packagePath}/examples/ai/jql-editor-readonly.tsx`,
				},
			],
		},
	],
};

export default documentation;
