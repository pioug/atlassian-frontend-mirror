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
		name: 'Editor Plugin Selection Marker',
		description: 'Selection marker plugin for @atlaskit/editor-core.',
		status: 'general-availability',
		import: {
			name: 'selectionMarkerPlugin',
			package: '@atlaskit/editor-plugin-selection-marker',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-selection-marker', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Basic',
				description: 'Selection marker plugin in editor.',
				source: path.resolve(packagePath, './examples/1-basic.tsx'),
			},
		],
	},
];

export default documentation;
