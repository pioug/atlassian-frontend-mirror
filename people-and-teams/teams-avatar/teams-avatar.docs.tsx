import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'TeamsAvatar',
			description: 'A visual representation of a team, typically used in profile views or lists.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/teams-avatar',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use TeamsAvatar to identify a team visually.',
				'Supports different sizes and shapes (square by default for teams).',
				'Can display an image or fallback to a team icon.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard team avatar example.',
					source: path.resolve(packagePath, './examples/basic.tsx'),
				},
			],
			keywords: ['avatar', 'team', 'profile', 'identity', 'visual'],
			categories: ['media', 'data-display'],
		},
	],
};

export default documentation;
