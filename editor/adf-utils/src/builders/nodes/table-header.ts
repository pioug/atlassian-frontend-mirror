import { type TableHeaderDefinition, type CellAttributes } from '@atlaskit/adf-schema';

export const tableHeader =
	(attrs?: CellAttributes) =>
	(...content: TableHeaderDefinition['content']): TableHeaderDefinition => ({
		type: 'tableHeader',
		attrs,
		content: content,
	});
