import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithLists(schema: Schema): boolean {
	return !!schema.nodes.bulletList;
}
