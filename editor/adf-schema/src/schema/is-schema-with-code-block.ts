import type { Schema } from '@atlaskit/editor-prosemirror/model';

export function isSchemaWithCodeBlock(schema: Schema): boolean {
	return !!schema.nodes.codeBlock;
}
