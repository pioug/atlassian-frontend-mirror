import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';

export const transformSliceToRemoveOpenNestedExpand = (slice: Slice, schema: Schema): Slice => {
	if (
		slice.openStart > 1 &&
		slice.openEnd > 1 &&
		slice.content.childCount === 1 &&
		slice.content.firstChild &&
		slice.content.firstChild.type === schema.nodes.nestedExpand
	) {
		return new Slice(slice.content.firstChild.content, slice.openStart - 1, slice.openEnd - 1);
	}
	return slice;
};
