import type {
	TableDefinition,
	TableRow as TableRowDefinition,
} from '@atlaskit/adf-schema/tableNodes';

export const table = (...content: Array<TableRowDefinition>): TableDefinition => ({
	type: 'table',
	content,
});
