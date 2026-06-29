import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Toolbar',
			description:
				'A common toolbar component for editor-like interfaces, providing a container for buttons, dropdowns, and other controls.',
			status: 'general-availability',
			import: {
				name: 'Toolbar',
				package: '@atlaskit/editor-toolbar',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Toolbar to organize actions and controls for content editing.',
				'Supports grouping buttons and responsive behavior.',
				'Can be used as a primary toolbar or within specific sections of an interface.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard toolbar with basic buttons and groups.',
					source: path.resolve(packagePath, './examples/basic.tsx'),
				},
			],
			keywords: ['toolbar', 'editor', 'actions', 'controls', 'buttons'],
			categories: ['interaction', 'layout'],
		},
	],
};

export default documentation;
