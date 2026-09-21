import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'MediaImage',
			description:
				'A component for rendering media images with built-in support for authentication, error handling, and SSR.',
			status: 'general-availability',
			import: {
				name: 'MediaImage',
				package: '@atlaskit/media-image',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use MediaImage to display a single image from the Atlassian Media Service.',
				'Handles image fetching and authentication automatically.',
				'Provides an error boundary to handle loading failures gracefully.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Basic usage of MediaImage to display an image.',
					source: `${packagePath}/examples/0-basic.tsx`,
				},
			],
			keywords: ['media', 'image', 'picture', 'thumbnail'],
			categories: ['media'],
		},
	],
};

export default documentation;
