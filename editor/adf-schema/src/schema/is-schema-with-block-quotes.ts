import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithBlockQuotes(schema: Schema): boolean {
	return !!schema.nodes.blockquote;
}
