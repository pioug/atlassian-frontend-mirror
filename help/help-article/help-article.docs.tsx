import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'HelpArticle',
			description:
				'A component for displaying help articles with support for various content formats.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/help-article',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use HelpArticle to display the content of a single help article.',
				'Supports different body formats, including ADF (Atlassian Document Format).',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard help article display.',
					source: path.resolve(packagePath, './examples/1-Help-article.tsx'),
				},
				{
					name: 'ADF Content',
					description: 'Help article displaying content in ADF format.',
					source: path.resolve(packagePath, './examples/2-Help-article-adf.tsx'),
				},
			],
			keywords: ['help', 'article', 'content', 'documentation', 'adf'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
