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
	{
		name: 'DynamicTableStateless',
		description:
			'A stateless dynamic table for when you need to control pagination, sorting, and data externally. Use when integrating with custom state management.',
		status: 'general-availability',
		import: {
			name: 'DynamicTableStateless',
			package: '@atlaskit/dynamic-table',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when you need to control table state externally (e.g. server-side pagination, custom sort logic)',
			'Use DynamicTable (stateful) when built-in pagination and sorting are sufficient',
		],
		examples: [
			{
				name: 'Stateless',
				description: 'Stateless dynamic table example',
				source: path.resolve(__dirname, './examples/1-stateless.tsx'),
			},
		],
		keywords: ['table', 'dynamic-table', 'stateless', 'controlled', 'pagination', 'sorting'],
		categories: ['data display', 'table', 'list'],
	},
];

export default documentation;
