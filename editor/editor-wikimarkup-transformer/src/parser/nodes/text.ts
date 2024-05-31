import {
	type Mark as PMMark,
	type Node as PMNode,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';

export function createTextNode(input: string, schema: Schema, marks?: PMMark[]): PMNode[] {
	if (input === '') {
		return [];
	}
	const node = schema.text(input, marks || []);
	return [node];
}
