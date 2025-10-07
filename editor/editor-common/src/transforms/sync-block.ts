import { uuid } from '@atlaskit/adf-schema';
import type { Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import { mapSlice } from '../utils/slice';

export const transformToNewReferenceSyncBlock: (slice: Slice, schema: Schema) => Slice = (
	slice: Slice,
	schema: Schema,
): Slice => {
	slice = mapSlice(slice, (node: Node) => {
		if (node.type === schema.nodes.syncBlock) {
			const newAttrs = { ...node.attrs, localId: uuid.generate() };
			return schema.nodes.syncBlock.create(newAttrs, null, [...node.marks]);
		}
		return node;
	});

	return slice;
};
