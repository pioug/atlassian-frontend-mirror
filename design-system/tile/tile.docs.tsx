import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
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
];

export default documentation;
