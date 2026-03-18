import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Object',
		description: 'An object is an icon that represents an Atlassian-specific content type.',
		status: 'general-availability',
		import: {
			name: 'Object',
			package: '@atlaskit/object',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		examples: [
			{
				name: 'Object',
				description: 'Object example',
				source: path.resolve(__dirname, './examples/object.tsx'),
			},
			{
				name: 'Object Tile',
				description: 'Object tile example',
				source: path.resolve(__dirname, './examples/object-tile.tsx'),
			},
		],
		keywords: ['object', 'icon', 'content type', 'tile', 'object tile', 'atlassian'],
		categories: ['images and icons'],
	},
];

export default documentation;
