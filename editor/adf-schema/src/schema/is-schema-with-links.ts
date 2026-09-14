import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithLinks(schema: Schema): boolean {
	return !!schema.marks.link;
}
