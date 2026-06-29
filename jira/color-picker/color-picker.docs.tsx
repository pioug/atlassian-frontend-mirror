import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ColorPicker',
			description: 'A component that allows users to select a color from a predefined palette.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/color-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ColorPicker to allow users to choose a color for text, backgrounds, or other UI elements.',
				'Provides a standard palette of colors and supports custom color selection.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard color picker display.',
					source: path.resolve(packagePath, './examples/00-color-picker.tsx'),
				},
			],
			keywords: ['color', 'picker', 'palette', 'select'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
