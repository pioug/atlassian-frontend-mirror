import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'RovoAgentSelector',
			description: 'A component that allows users to select a Rovo agent from a list.',
			status: 'general-availability',
			import: {
				name: 'RovoAgentSelector',
				package: '@atlaskit/rovo-agent-selector',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use RovoAgentSelector to allow users to choose which Rovo agent to interact with.',
				'Typically used in chat or assistance contexts.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard Rovo agent selector display.',
					source: path.resolve(packagePath, './examples/basic.tsx'),
				},
			],
			keywords: ['rovo', 'agent', 'selector', 'ai', 'assistance'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
