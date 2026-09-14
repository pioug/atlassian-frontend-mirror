import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithAdvancedTextFormattingMarks(schema: Schema): boolean {
	return !!schema.marks.code && !!schema.marks.strike;
}
