/**
 * Structured MCP docs for `@atlaskit/media-card`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/media-card',
		packagePath,
		packageJson,
		overview:
			'Card component for displaying media files (images, video, documents) with loading, error, and progress states.',
	},
	components: [
		{
			name: 'Card',
			description: 'The main component for displaying media files as cards.',
			status: 'general-availability',
			import: {
				name: 'Card',
				package: '@atlaskit/media-card',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `Card` to display media files in a grid or list.',
				'Requires a `MediaClient` instance and a file identifier.',
			],
			keywords: ['media', 'card', 'file', 'display'],
			categories: ['media'],
			examples: [
				{
					name: 'File card flow',
					description: 'Basic usage of Card for displaying a file.',
					source: path.resolve(packagePath, './examples/00-file-card-flow.tsx'),
				},
			],
		},
	],
};

export default documentation;
