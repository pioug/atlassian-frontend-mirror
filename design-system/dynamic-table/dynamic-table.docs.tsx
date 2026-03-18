import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Dynamic table',
		description:
			'A dynamic table displays rows of data with built-in pagination, sorting, and re-ordering functionality.',
		status: 'general-availability',
		import: {
			name: 'DynamicTable',
			package: '@atlaskit/dynamic-table',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		examples: [
			{
				name: 'Stateful',
				description: 'Stateful dynamic table example',
				source: path.resolve(__dirname, './examples/0-stateful.tsx'),
			},
			{
				name: 'Stateless',
				description: 'Stateless dynamic table example',
				source: path.resolve(__dirname, './examples/1-stateless.tsx'),
			},
		],
		keywords: [
			'table',
			'dynamic-table',
			'data',
			'rows',
			'columns',
			'sorting',
			'pagination',
			'drag and drop',
			'ranking',
		],
		categories: ['data display', 'table', 'list'],
	},
];

export default documentation;
