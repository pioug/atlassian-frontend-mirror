import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';

// If the top level is a single expand, and the expand is not
// a part of copied content, then return unwrap contents.
// This is needed for handling content copied from expand.
// https://product-fabric.atlassian.net/browse/ED-9146
export const transformSliceToRemoveOpenExpand = (slice: Slice, schema: Schema): Slice => {
	if (
		slice.openStart > 1 &&
		slice.openEnd > 1 &&
		slice.content.childCount === 1 &&
		slice.content.firstChild &&
		slice.content.firstChild.type === schema.nodes.expand
	) {
		return new Slice(slice.content.firstChild.content, slice.openStart - 1, slice.openEnd - 1);
	}
	return slice;
};
