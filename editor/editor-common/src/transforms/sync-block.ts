import { uuid } from '@atlaskit/adf-schema';
import type { Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import { mapSlice } from '../utils/slice';

export const transformToNewReferenceSyncBlock: (slice: Slice, schema: Schema) => Slice = (
	slice: Slice,
	schema: Schema,
): Slice => {
	slice = mapSlice(slice, (node: Node) => {
		// sync blocks need a unique localId to function correctly
		if (node.type === schema.nodes.syncBlock) {
			const newAttrs = { ...node.attrs, localId: uuid.generate() };
			return schema.nodes.syncBlock.create(newAttrs, null, [...node.marks]);
		} else if (node.type === schema.nodes.bodiedSyncBlock) {
			// bodied sync blocks need a unique localId and convert to a reference sync block
			// when converting we want to be specific about attributes and marks we carry over
			const newAttrs = { resourceId: node.attrs.resourceId, localId: uuid.generate() };

			const newMarks = schema.nodes.syncBlock.markSet
				? node.marks.filter((mark) => schema.nodes.syncBlock.markSet?.includes(mark.type))
				: node.marks; // schema.nodes.syncBlock.markSet is null meaning all marks are allowed

			return schema.nodes.syncBlock.create(newAttrs, null, newMarks);
		}
		return node;
	});

	return slice;
};
