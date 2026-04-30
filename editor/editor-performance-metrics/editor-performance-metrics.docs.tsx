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
		name: 'EditorPerformanceMetrics',
		description: 'Experimental code to track Editor Full Page performance on some particular scenarios',
		status: 'general-availability',
		import: {
			name: 'EditorPerformanceMetrics',
			package: '@atlaskit/editor-performance-metrics',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-performance-metrics', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'VC observer next', description: 'Viewport visibility observer (next API).', source: path.resolve(packagePath, './examples/01-vc-observer-next.tsx') },
			{ name: 'Editor full page', description: 'Full page editor with performance metrics.', source: path.resolve(packagePath, './examples/05-editor-full-page.tsx') },
			{ name: 'Basic React', description: 'Basic React render performance example.', source: path.resolve(packagePath, './examples/06-basic-react.tsx') },
		],
	},
];

export default documentation;
