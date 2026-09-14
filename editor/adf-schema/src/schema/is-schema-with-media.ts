import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithMedia(schema: Schema): boolean {
	return !!schema.nodes.mediaGroup && !!schema.nodes.media && !!schema.nodes.mediaInline;
}
