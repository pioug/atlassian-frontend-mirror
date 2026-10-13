/**
 * Structured MCP docs for `@atlaskit/media-picker`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
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
			usageGuidelines: [
				'Use for a clear action to choose local files. Open the file dialog when the person activates that action.',
				'Set accepted file types and whether multiple files can be selected for the task. Validate files again on the server.',
			],
			contentGuidelines: [
				'Explain accepted file types and size limits before opening the native dialog; treat filenames as user-provided text.',
			],
			accessibilityGuidelines: [
				'Give the trigger a descriptive accessible name and announce upload progress and errors without moving focus.',
			],
			keywords: ['media', 'picker', 'upload', 'browser'],
			categories: ['media'],
			examples: [
				{
					name: 'Browse and track upload state',
					description:
						'Open the native picker from a button and show local upload lifecycle status.',
					source: `${packagePath}/examples/ai/browser.tsx`,
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
				'Use Dropzone when a visible target makes drag-and-drop convenient; provide a nearby button or browser-picker path for keyboard and touch users.',
				'Keep the drop target and its instructions in the same focus and reading context. Do not rely on color or drag-only feedback to communicate accepted or rejected files.',
			],
			contentGuidelines: [
				'State the accepted formats and limits next to the target; do not assume a dropped filename proves the file is safe.',
			],
			accessibilityGuidelines: [
				'Pair drag-and-drop with a keyboard-operable browse action and expose upload, rejection, and completion feedback to assistive technology.',
			],
			keywords: ['media', 'picker', 'upload', 'dropzone'],
			categories: ['media'],
			examples: [
				{
					name: 'Drop files with an alternative picker',
					description:
						'Track upload lifecycle events while offering a browser picker as an alternative.',
					source: `${packagePath}/examples/ai/dropzone.tsx`,
				},
			],
		},
		{
			name: 'Clipboard',
			description:
				'A component that listens for pasted files in a configured area and uploads them.',
			status: 'general-availability',
			import: {
				name: 'Clipboard',
				package: '@atlaskit/media-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Clipboard alongside visible instructions that explain where to paste and what file types are accepted; never make paste the only available upload path.',
				'Limit paste capture to the relevant editing or upload area so normal clipboard actions elsewhere in the product are not intercepted.',
			],
			contentGuidelines: [
				'Tell users which pasted file types are accepted and where paste is handled; do not infer safety from clipboard origin.',
			],
			accessibilityGuidelines: [
				'Keep a visible, labeled upload alternative and announce pasted-file progress and errors in the local workflow.',
			],
			keywords: ['media', 'picker', 'upload', 'clipboard', 'paste'],
			categories: ['media'],
			examples: [
				{
					name: 'Paste an image into an upload area',
					description: 'Show upload progress in a focused paste target.',
					source: `${packagePath}/examples/ai/clipboard.tsx`,
				},
			],
		},
	],
};

export default documentation;
