import type {
	TableRow as TableRowDefinition,
	TableHeader as TableHeaderDefinition,
	TableCell as TableCellDefinition,
} from '@atlaskit/adf-schema/tableNodes';

export const tableRow = (
	content: Array<TableHeaderDefinition> | Array<TableCellDefinition>,
): TableRowDefinition => ({
	type: 'tableRow',
	content,
});
