import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Rating',
			description:
				'An accessible rating component that allows users to provide feedback using a star-based system.',
			status: 'general-availability',
			import: {
				name: 'Rating',
				package: '@atlaskit/rating',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Rating to allow users to rate items or experiences.',
				'Supports both controlled and uncontrolled states.',
				'Highly customizable, including the number of stars and their appearance.',
			],
			examples: [
				{
					name: 'Star Rating',
					description: 'Standard star-based rating display.',
					source: path.resolve(packagePath, './examples/star-rating.tsx'),
				},
			],
			keywords: ['rating', 'stars', 'feedback', 'review'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
