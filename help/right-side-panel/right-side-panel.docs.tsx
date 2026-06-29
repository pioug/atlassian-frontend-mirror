import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'RightSidePanel',
			description:
				'A panel component that slides in from the right side of the screen, typically used for help or additional context.',
			status: 'general-availability',
			import: {
				name: 'RightSidePanel',
				package: '@atlaskit/right-side-panel',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use RightSidePanel to display supplementary information or tools without navigating away from the main content.',
				'Supports custom width and slide-in animations.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard right side panel display.',
					source: path.resolve(packagePath, './examples/0-Right-Side-Panel.tsx'),
				},
			],
			keywords: ['panel', 'sidebar', 'overlay', 'help', 'context'],
			categories: ['layout', 'overlay'],
		},
	],
};

export default documentation;
