import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Help',
			description:
				'A cross-product help component that provides a unified interface for displaying articles, search, and AI-powered assistance.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/help',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Help to provide in-product documentation and support to users.',
				'Supports displaying articles, searching help content, and AI-powered help features.',
				'Can be integrated into various parts of an application, such as a sidebar or a dedicated help page.',
			],
			examples: [
				{
					name: 'Default Content',
					description: 'Help component with default content configuration.',
					source: path.resolve(packagePath, './examples/0-Help-Default-Content.tsx'),
				},
				{
					name: 'Help with AI',
					description: 'Help component with AI assistance enabled.',
					source: path.resolve(packagePath, './examples/5-Help-with-ai.tsx'),
				},
			],
			keywords: ['help', 'support', 'documentation', 'articles', 'search', 'ai'],
			categories: ['interaction', 'layout'],
		},
	],
};

export default documentation;
