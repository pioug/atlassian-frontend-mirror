import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithSubSupMark(schema: Schema): boolean {
	return !!schema.marks.subsup;
}
