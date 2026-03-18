import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Table tree',
		description:
			'A table tree is an expandable table for showing nested hierarchies of information.',
		status: 'general-availability',
		import: {
			name: 'TableTree',
			package: '@atlaskit/table-tree',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		examples: [
			{
				name: 'Controlled Expanded State',
				description: 'Controlled expanded state example',
				source: path.resolve(__dirname, './examples/controlled-expanded-state.tsx'),
			},
		],
		keywords: ['table-tree', 'table', 'tree', 'expandable', 'nested', 'hierarchy', 'rows'],
		categories: ['text and data display', 'data'],
	},
];

export default documentation;
