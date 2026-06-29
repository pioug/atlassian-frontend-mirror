import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Filmstrip',
			description:
				'A component that displays a collection of media cards in a horizontal, scrollable filmstrip layout.',
			status: 'general-availability',
			import: {
				name: 'Filmstrip',
				package: '@atlaskit/media-filmstrip',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Filmstrip to show a horizontal list of media items, such as attachments or gallery previews.',
				'Provides navigation arrows for scrolling through the items.',
				'Automatically handles layout and spacing of media cards.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'A basic filmstrip with several media cards.',
					source: path.resolve(packagePath, './examples/0-smart-filmstrip.tsx'),
				},
			],
			keywords: ['media', 'filmstrip', 'gallery', 'carousel', 'horizontal-scroll'],
			categories: ['media', 'layout'],
		},
	],
};

export default documentation;
