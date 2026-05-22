import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
	{
		name: 'Tile',
		description:
			'A tile is a versatile, foundational container with baked-in sizing and radii properties for displaying elements in a tile shape.',
		status: 'general-availability',
		import: {
			name: 'Tile',
			package: '@atlaskit/tile',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		examples: [
			{
				name: 'Basic',
				description: 'Basic tile example',
				source: path.resolve(__dirname, './examples/basic.tsx'),
			},
		],
		keywords: ['tile', 'icon', 'container', 'avatar', 'asset', 'emoji', 'logo', 'shape'],
		categories: ['images and icons', 'layout'],
	},
	],
};

export default documentation;
