import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithTables(schema: Schema): boolean {
	return (
		!!schema.nodes.table &&
		!!schema.nodes.tableCell &&
		!!schema.nodes.tableHeader &&
		!!schema.nodes.tableRow
	);
}
