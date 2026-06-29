/**
 * Structured MCP docs for `@atlaskit/onboarding`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/onboarding',
		packagePath,
		packageJson,
		overview:
			'An onboarding spotlight introduces new features to users through focused messages or multi-step tours. Note that this package is deprecated in favor of `@atlaskit/spotlight`.',
	},
	components: [
		{
			name: 'Spotlight',
			description: 'A component that highlights a specific element on the page with a message.',
			status: 'deprecated',
			import: {
				name: 'Spotlight',
				package: '@atlaskit/onboarding',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `Spotlight` to guide users through new features.',
				'Consider migrating to `@atlaskit/spotlight` for new implementations.',
			],
			keywords: ['onboarding', 'spotlight', 'tour'],
			categories: ['messaging'],
			examples: [
				{
					name: 'Spotlight basic',
					description: 'Basic usage of Spotlight.',
					source: path.resolve(packagePath, './examples/10-spotlight-basic.tsx'),
				},
			],
		},
	],
};

export default documentation;
