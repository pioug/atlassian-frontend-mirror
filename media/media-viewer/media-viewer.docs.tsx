import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'MediaViewer',
			description:
				"MediaViewer is Atlassian's powerful solution for viewing files on the web. It supports images, video, audio, documents, and more in a full-screen overlay.",
			status: 'general-availability',
			import: {
				name: 'MediaViewer',
				package: '@atlaskit/media-viewer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use MediaViewer to provide a full-screen preview of files and media.',
				'Use for viewing images, videos, PDFs, and other document types without leaving the current context.',
				'Supports navigation between multiple files in a collection.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Basic usage of MediaViewer with a single file.',
					source: path.resolve(packagePath, './examples/0-basic-example.tsx'),
				},
				{
					name: 'Multi-file',
					description: 'MediaViewer with multiple files and navigation.',
					source: path.resolve(packagePath, './examples/1-multi-file-previews.tsx'),
				},
			],
			keywords: ['media', 'viewer', 'preview', 'file', 'image', 'video', 'pdf'],
			categories: ['media', 'overlay'],
		},
	],
};

export default documentation;
