/**
 * Structured MCP docs for `@atlaskit/media-avatar-picker`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/media-avatar-picker',
		packagePath,
		packageJson,
		overview:
			'A component to select, drag and resize image avatars. It also provides a default list of predefined avatars.',
	},
	components: [
		{
			name: 'AvatarPickerDialog',
			description: 'Main dialog component that orchestrates the avatar selection experience.',
			status: 'general-availability',
			import: {
				name: 'AvatarPickerDialog',
				package: '@atlaskit/media-avatar-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `AvatarPickerDialog` when you need to allow users to upload or select an avatar.',
			],
			keywords: ['media', 'avatar', 'picker', 'upload'],
			categories: ['media'],
			examples: [
				{
					name: 'Avatar picker with source',
					description: 'Basic usage of AvatarPickerDialog with an initial image source.',
					source: path.resolve(packagePath, './examples/0-avatar-picker-with-source.tsx'),
				},
			],
		},
		{
			name: 'ImageCropper',
			description: 'Interactive component for cropping uploaded images.',
			status: 'general-availability',
			import: {
				name: 'ImageCropper',
				package: '@atlaskit/media-avatar-picker/image-cropper',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use `ImageCropper` for standalone image cropping functionality.'],
			keywords: ['media', 'crop', 'image'],
			categories: ['media'],
			examples: [
				{
					name: 'Image cropper',
					description: 'Basic usage of ImageCropper.',
					source: path.resolve(packagePath, './examples/1-image-cropper.tsx'),
				},
			],
		},
	],
};

export default documentation;
