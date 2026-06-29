import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

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
				'Provides autocomplete suggestions for fields, operators, and values.',
				'Supports asynchronous loading of the editor and its dependencies.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard JQL editor with basic configuration.',
					source: path.resolve(packagePath, './examples/00-basic-editor.tsx'),
				},
				{
					name: 'AI Agent Users',
					description: 'JQL editor with support for AI agent users.',
					source: path.resolve(packagePath, './examples/08-ai-agent-users.tsx'),
				},
			],
			keywords: ['jql', 'editor', 'jira', 'query', 'autocomplete', 'search'],
			categories: ['interaction', 'data-display'],
		},
	],
};

export default documentation;
