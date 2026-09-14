import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithEmojis(schema: Schema): boolean {
	return !!schema.nodes.emoji;
}
