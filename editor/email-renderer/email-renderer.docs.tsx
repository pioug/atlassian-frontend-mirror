/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'EmailSerializer',
			description: 'Email renderer',
			status: 'general-availability',
			import: {
				name: 'EmailSerializer',
				package: '@atlaskit/email-renderer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'email-renderer', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'ADF to email',
					description: 'Transform ADF to email HTML.',
					source: `${packagePath}/examples/0-adf-to-email.tsx`,
				},
			],
		},
	],
};

export default documentation;
