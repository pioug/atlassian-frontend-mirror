import type {
	TableCell as TableCellDefinition,
	CellAttributes,
} from '@atlaskit/adf-schema/tableNodes';

export const tableCell =
	(attrs?: CellAttributes) =>
	(...content: TableCellDefinition['content']): TableCellDefinition => ({
		type: 'tableCell',
		attrs,
		content,
	});
