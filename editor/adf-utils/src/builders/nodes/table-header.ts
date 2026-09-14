import type {
	TableHeader as TableHeaderDefinition,
	CellAttributes,
} from '@atlaskit/adf-schema/tableNodes';

export const tableHeader =
	(attrs?: CellAttributes) =>
	(...content: TableHeaderDefinition['content']): TableHeaderDefinition => ({
		type: 'tableHeader',
		attrs,
		content: content,
	});
