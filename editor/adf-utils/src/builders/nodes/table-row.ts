import {
	type TableRowDefinition,
	type TableHeaderDefinition,
	type TableCellDefinition,
} from '@atlaskit/adf-schema';

export const tableRow = (
	content: Array<TableHeaderDefinition> | Array<TableCellDefinition>,
): TableRowDefinition => ({
	type: 'tableRow',
	content,
});
