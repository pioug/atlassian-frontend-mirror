import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'MediaTable',
			description:
				'A table component specifically designed for displaying lists of media files with metadata like name, size, and upload date.',
			status: 'general-availability',
			import: {
				name: 'MediaTable',
				package: '@atlaskit/media-table',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use MediaTable to display a list of files with their associated metadata.',
				'Supports sorting, pagination, and row selection.',
				'Ideal for file management interfaces or attachment lists.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard MediaTable displaying a list of files.',
					source: path.resolve(packagePath, './examples/1-media-table.tsx'),
				},
			],
			keywords: ['media', 'table', 'files', 'list', 'metadata'],
			categories: ['media', 'data-display'],
		},
	],
};

export default documentation;
