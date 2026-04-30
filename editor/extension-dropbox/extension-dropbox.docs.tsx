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
		name: 'Editor Core',
		description: 'A an atlassian editor extension to add a native dropbox picker',
		status: 'general-availability',
		import: {
			name: 'Editor Core',
			package: '@atlaskit/editor-extension-dropbox',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'extension-dropbox', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'Test modal', description: 'Dropbox extension test modal example.', source: path.resolve(packagePath, './examples/bad-example-test-modal.tsx') },
		],
	},
];

export default documentation;
