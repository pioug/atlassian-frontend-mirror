/**
 * Structured MCP docs for `@atlaskit/media-picker`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/media-picker',
		packagePath,
		packageJson,
		overview:
			'Library for handling file uploads. It provides Browser (file dialog), Dropzone, and Clipboard picker variants.',
	},
	components: [
		{
			name: 'Browser',
			description: 'A component that triggers the native browser file dialog.',
			status: 'general-availability',
			import: {
				name: 'Browser',
				package: '@atlaskit/media-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use `Browser` to allow users to select files from their computer.'],
			keywords: ['media', 'picker', 'upload', 'browser'],
			categories: ['media'],
			examples: [
				{
					name: 'Browse',
					description: 'Basic usage of the Browser picker.',
					source: path.resolve(packagePath, './examples/2-browse.tsx'),
				},
			],
		},
		{
			name: 'Dropzone',
			description: 'A component that provides a drag-and-drop area for file uploads.',
			status: 'general-availability',
			import: {
				name: 'Dropzone',
				package: '@atlaskit/media-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `Dropzone` to allow users to upload files by dragging them onto a specific area.',
			],
			keywords: ['media', 'picker', 'upload', 'dropzone'],
			categories: ['media'],
			examples: [
				{
					name: 'Dropzone',
					description: 'Basic usage of the Dropzone picker.',
					source: path.resolve(packagePath, './examples/1-dropzone.tsx'),
				},
			],
		},
	],
};

export default documentation;
