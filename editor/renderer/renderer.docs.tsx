/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Renderer',
		description: 'Renderer component',
		status: 'general-availability',
		import: {
			name: 'Renderer',
			package: '@atlaskit/renderer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use ReactRenderer with an ADF document; use a transformer (e.g. BitbucketTransformer) with ADFEncoder when your storage format is not ADF.',
			'Avoid unnecessary props changes: extract static objects to constants, avoid passing new objects or anonymous functions on every render, use useMemo/useCallback for props and callbacks to prevent performance degradation.',
			'Ensure only one version of Renderer sub-dependencies (adf-schema, editor-common, prosemirror-model, etc.) in your bundles; use deduplication or resolutions. Use correct peer dependency versions.',
			'Use the truncated prop with maxHeight/fadeOutHeight when you need to cap rendered content with a fade; add polyfills for fetch and ES6/ES7 when targeting older browsers.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'renderer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Basic',
				description: 'Basic ReactRenderer with ADF document.',
				source: path.resolve(packagePath, './examples/0-basic.tsx'),
			},
			{
				name: 'Full page',
				description: 'Full-page renderer with full ADF.',
				source: path.resolve(packagePath, './examples/0-full-page.tsx'),
			},
			{
				name: 'With providers',
				description: 'Renderer with media and other providers.',
				source: path.resolve(packagePath, './examples/1-with-providers.tsx'),
			},
			{
				name: 'Full page with media caption',
				description: 'Renderer with media and captions.',
				source: path.resolve(packagePath, './examples/0-full-page-with-media-caption.tsx'),
			},
			{
				name: 'Column layout',
				description: 'Renderer with column layout.',
				source: path.resolve(packagePath, './examples/10-column-layout.tsx'),
			},
		],
	},
];

export default documentation;
