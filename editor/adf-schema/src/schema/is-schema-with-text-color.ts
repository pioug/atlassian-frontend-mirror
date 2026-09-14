import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithTextColor(schema: Schema): boolean {
	return !!schema.marks.textColor;
}
