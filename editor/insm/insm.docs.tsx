/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	utilities: [
		{
			kind: 'function',
			name: 'init',
			description: 'INSM tooling measures user-perceived interactivity of a page',
			status: 'general-availability',
			import: {
				name: 'init',
				package: '@atlaskit/insm',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'insm', 'atlaskit'],
			categories: ['editor'],
			signature: 'init(options: INSMOptions): void',
			examples: [],
		},
	],
};

export default documentation;
