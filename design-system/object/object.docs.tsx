import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'StoryObject',
			description: 'An object icon component that represents an Atlassian story content type.',
			status: 'general-availability',
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=107096-47822',
			},
			import: {
				name: 'StoryObject',
				package: '@atlaskit/object/story',
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
			],
			keywords: ['object', 'icon', 'content type', 'tile', 'object tile', 'atlassian'],
			categories: ['images and icons'],
		},
		{
			name: 'WhiteboardObjectTile',
			description: 'An object tile component that represents an Atlassian whiteboard content type.',
			status: 'general-availability',
			import: {
				name: 'WhiteboardObjectTile',
				package: '@atlaskit/object/tile/whiteboard',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			examples: [
				{
					name: 'Object Tile',
					description: 'Object tile example',
					source: path.resolve(__dirname, './examples/object-tile.tsx'),
				},
			],
			keywords: ['object', 'icon', 'content type', 'tile', 'object tile', 'atlassian'],
			categories: ['images and icons'],
		},
	],
};

export default documentation;
