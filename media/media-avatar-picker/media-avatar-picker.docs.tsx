/**
 * Structured MCP docs for `@atlaskit/media-avatar-picker`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/media-avatar-picker',
		packagePath,
		packageJson,
		overview:
			'A dialog for choosing a predefined avatar or uploading and cropping an image. The consumer owns persistence of the selected image or avatar.',
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
				'Use `AvatarPickerDialog` when people need to choose an avatar or upload and crop an image for a profile.',
				'Persist the selected avatar or cropped image in the consuming application; the dialog only returns the selection.',
			],
			accessibilityGuidelines: [
				'Keep the dialog in the rendered tree only while it is open, and remove it after `onCancel` or a successful save.',
				'Image cropping supports keyboard arrow-key movement and announces image movement to screen readers.',
				'Use `requireAltText` when the selected image needs descriptive alternative text; handle the returned alt text with the selection.',
			],
			contentGuidelines: [
				'Use a concise title that explains what the avatar represents, and provide meaningful alt text when the image conveys information.',
			],
			keywords: [
				'media',
				'avatar',
				'profile image',
				'picker',
				'upload',
				'crop',
				'alternative text',
			],
			categories: ['media'],
			examples: [
				{
					name: 'Choose a predefined avatar',
					description:
						'Open the dialog, select a predefined avatar or upload an image, and show the saved selection.',
					source: `${packagePath}/examples/ai/avatar-picker.tsx`,
				},
			],
		},
		{
			name: 'ImageCropper',
			description: 'Interactive component for cropping uploaded images.',
			status: 'general-availability',
			import: {
				name: 'ImageCropper',
				package: '@atlaskit/media-avatar-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ImageCropper` when the app already has the image and crop position; use `ImageNavigator` for a custom upload, zoom, and crop flow or `AvatarPickerDialog` for the complete experience.',
			],
			accessibilityGuidelines: [
				'Keep the cropper within a dialog or other context that gives its controls an accessible name and a clear dismissal path.',
				'Preserve keyboard access to crop movement and removal controls when composing the cropper.',
			],
			keywords: ['media', 'crop', 'image'],
			categories: ['media'],
			examples: [
				{
					name: 'Image cropper',
					description: 'Crop a host-provided image and report load or error feedback.',
					source: `${packagePath}/examples/ai/image-cropper.tsx`,
				},
			],
		},
		{
			name: 'ImageNavigator',
			description:
				'A lower-level image selection and crop workflow for hosts that need to compose their own avatar editing experience. Prefer `AvatarPickerDialog` for the complete dialog.',
			status: 'general-availability',
			import: {
				name: 'ImageNavigator',
				package: '@atlaskit/media-avatar-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for a custom image selection flow. Use AvatarPickerDialog for the standard upload and crop dialog.',
				'Connect the export function from onLoad to the app save action; ImageNavigator does not save the cropped image.',
			],
			examples: [
				{
					name: 'Navigate a remote image',
					description: 'Compose image navigation and export controls in a host-owned flow.',
					source: `${packagePath}/examples/ai/image-navigator.tsx`,
				},
			],
			keywords: ['image navigator', 'image crop', 'avatar upload', 'image selection'],
			categories: ['media'],
		},
		{
			name: 'Slider',
			description:
				'A zoom control for the image navigator. It combines accessible zoom-out, range, and zoom-in controls.',
			status: 'general-availability',
			import: {
				name: 'Slider',
				package: '@atlaskit/media-avatar-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use to adjust zoom during image editing and keep its value in app state.'],
			accessibilityGuidelines: [
				'Keep the zoom range and its zoom-in and zoom-out buttons in the same interaction group so users can choose either input method.',
			],
			examples: [
				{
					name: 'Controlled image zoom',
					description: 'Keep the zoom slider value in host state and show the current percentage.',
					source: `${packagePath}/examples/ai/image-navigator.tsx`,
				},
			],
			keywords: ['image zoom', 'zoom slider', 'crop controls', 'avatar editor'],
			categories: ['media'],
		},
	],
};

export default documentation;
