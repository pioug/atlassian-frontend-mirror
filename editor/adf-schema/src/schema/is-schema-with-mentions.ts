import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithMentions(schema: Schema): boolean {
	return !!schema.nodes.mention;
}
