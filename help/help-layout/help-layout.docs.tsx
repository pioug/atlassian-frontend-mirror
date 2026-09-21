import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'HelpLayout',
			description:
				'A layout component for help content, providing a consistent structure for help panels and pages.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/help-layout',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use HelpLayout to provide a consistent structure for help-related content.',
				'Typically used as a container for help articles, search results, and other help components.',
			],
			examples: [
				{
					name: 'Help Panel',
					description: 'HelpLayout used within a help panel context.',
					source: `${packagePath}/examples/0-Help-Panel.tsx`,
				},
			],
			keywords: ['help', 'layout', 'structure', 'panel', 'container'],
			categories: ['layout'],
		},
	],
};

export default documentation;
