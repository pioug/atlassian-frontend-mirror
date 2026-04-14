import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Icon',
		description: 'An icon is a symbol representing a command, device, directory, or common action.',
		status: 'general-availability',
		import: {
			name: 'IconNew',
			package: '@atlaskit/icon',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use icons to enhance visual communication',
			'Choose icons that clearly represent their function',
			'Maintain consistent icon style and size',
			'Use appropriate icon sizes for different contexts',
			'Consider cultural and contextual icon meanings',
		],
		contentGuidelines: [
			'Use clear, recognizable icon symbols',
			'Ensure icons are culturally appropriate',
			'Maintain visual consistency across icon sets',
			'Use appropriate icon labels and descriptions',
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text or labels for icons',
			'Use meaningful icon choices that convey clear meaning',
			'Ensure sufficient color contrast for icon visibility',
			'Consider icon size for touch targets',
			'Use consistent iconography across the interface',
		],
		examples: [
			{
				name: 'Icon',
				description: 'Icon example',
				source: path.resolve(__dirname, './examples/ai/icon.tsx'),
			},
		],
		keywords: ['icon', 'symbol', 'command', 'device', 'directory', 'action', 'visual'],
		categories: ['images-and-icons'],
	},
	{
		name: 'IconTile',
		description:
			'A tile component that displays an icon with customizable background, shape, and appearance.',
		status: 'release-candidate',
		import: {
			name: 'IconTile',
			package: '@atlaskit/icon',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for icon presentation with background styling',
			'Choose appropriate shapes and appearances',
			'Maintain consistent sizing across tiles',
			'Use for visual emphasis or categorization',
		],
		contentGuidelines: [
			'Use clear, recognizable icons',
			'Choose appropriate colors and shapes',
			'Ensure visual consistency across tiles',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for icon tiles',
			'Ensure sufficient color contrast',
			'Use meaningful icon choices',
			'Consider touch target sizes',
		],
		examples: [
			{
				name: 'Icon Tile',
				description: 'Icon Tile example',
				source: path.resolve(__dirname, './examples/ai/icon-tile.tsx'),
			},
		],
		keywords: ['icon', 'tile', 'container', 'background', 'shape', 'appearance'],
		categories: ['images-and-icons'],
	},
];

export default documentation;
