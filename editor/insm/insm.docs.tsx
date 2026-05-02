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
		name: 'Insm',
		description: 'INSM tooling measures user-perceived interactivity of a page',
		status: 'general-availability',
		import: {
			name: 'Insm',
			package: '@atlaskit/insm',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'insm', 'atlaskit'],
		categories: ['editor'],
		examples: [],
	},
];

export default documentation;
