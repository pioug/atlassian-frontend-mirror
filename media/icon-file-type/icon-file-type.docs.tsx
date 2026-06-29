import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'FileTypeIcon',
			description:
				'Icons used to represent specific file types (e.g., PDF, Word, Image) across Atlassian products.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/icon-file-type',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use FileTypeIcon to visually represent the type of a file or attachment.',
				'Icons are available in different sizes (small, medium, large, xlarge).',
				'Can be used as a standalone icon or within other components like MediaTable.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Basic usage of FileTypeIcon.',
					source: path.resolve(packagePath, './examples/simple-example.tsx'),
				},
			],
			keywords: ['icon', 'file-type', 'attachment', 'visual-representation'],
			categories: ['media', 'icon'],
		},
	],
};

export default documentation;
