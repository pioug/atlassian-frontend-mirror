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
	{
		name: 'Headers',
		description:
			'Container for table column headers. Use with Header components to define columns.',
		status: 'general-availability',
		import: {
			name: 'Headers',
			package: '@atlaskit/table-tree',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Clearly label column headers with simple language',
			'Provide an accessible name for the table',
		],
		keywords: ['table-tree', 'headers', 'table', 'columns'],
		categories: ['text and data display', 'data'],
	},
	{
		name: 'Header',
		description:
			'A single column header in a table tree. Use within Headers to define each column.',
		status: 'general-availability',
		import: {
			name: 'Header',
			package: '@atlaskit/table-tree',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Use for structured tabular data only—never for layout'],
		keywords: ['table-tree', 'header', 'table', 'column'],
		categories: ['text and data display', 'data'],
	},
	{
		name: 'Rows',
		description: 'Container for table tree rows. Renders expandable rows with nested data.',
		status: 'general-availability',
		import: {
			name: 'Rows',
			package: '@atlaskit/table-tree',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Place important information at top-level so users rarely need to expand',
			'Limit indentation for scannability',
			'Avoid truncation—prefer wrapping when content exceeds cell width',
		],
		keywords: ['table-tree', 'rows', 'table', 'data'],
		categories: ['text and data display', 'data'],
	},
	{
		name: 'Row',
		description: 'A single row in a table tree. Use within Rows render prop for each data item.',
		status: 'general-availability',
		import: {
			name: 'Row',
			package: '@atlaskit/table-tree',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Allow expand-on-click only when the row has no interactive elements (buttons, dropdowns)',
		],
		keywords: ['table-tree', 'row', 'table', 'expandable'],
		categories: ['text and data display', 'data'],
	},
	{
		name: 'Cell',
		description: 'A single cell in a table tree row. Use within Row to display column data.',
		status: 'general-availability',
		import: {
			name: 'Cell',
			package: '@atlaskit/table-tree',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Avoid heavy indentation—affects scannability and screen magnification users',
			'Prefer wrapping over truncation for accessibility',
		],
		keywords: ['table-tree', 'cell', 'table', 'data'],
		categories: ['text and data display', 'data'],
	},
];

export default documentation;
