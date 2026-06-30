/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Editor Core',
			description: 'A package contains Atlassian editor core functionality',
			status: 'general-availability',
			import: {
				name: 'ComposableEditor',
				package: '@atlaskit/editor-core/composable-editor',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the comment appearance when the editor is not the primary focus (e.g. comments on a page); use full-page or full-width when the editor is the main focus; use chromeless when you need complete control over the editor UI; use mobile for mobile web.',
				'Configure features via presets (default, universal, or custom). Always include basePlugin; use usePreset or similar memoization so the preset is stable across re-renders.',
				'Use ComposableEditor with a preset; provide providers (e.g. mentionProvider) when the editor needs context from your app.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-core', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Basic composable editor',
					description: 'Minimal ComposableEditor with preset.',
					source: path.resolve(packagePath, './examples/1-basic-composable-editor.tsx'),
				},
				{
					name: 'Comment editor',
					description: 'Comment appearance composable editor.',
					source: path.resolve(packagePath, './examples/1-comment-editor-component-composable.tsx'),
				},
				{
					name: 'Full page editor',
					description: 'Full-page appearance composable editor.',
					source: path.resolve(packagePath, './examples/1-full-page-editor-composable.tsx'),
				},
				{
					name: 'Chromeless editor',
					description: 'Chromeless appearance with custom UI.',
					source: path.resolve(
						packagePath,
						'./examples/1-chromeless-editor-component-composable.tsx',
					),
				},
				{
					name: 'Collapsed editor',
					description: 'Async collapsed editor (labs).',
					source: path.resolve(packagePath, './examples/1-labs-async-collapsed-editor.tsx'),
				},
			],
		},
	],
};

export default documentation;
