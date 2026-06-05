import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

export const transformSingleColumnLayout = (slice: Slice, schema: Schema): Slice => {
	if (slice.content.childCount === 1 && slice.openStart === 0 && slice.openEnd === 0) {
		if (slice.content.firstChild?.type === schema.nodes.layoutColumn) {
			const newSlice = new Slice(slice.content.firstChild.content, 0, 0);
			return newSlice;
		} else if (
			slice.content.firstChild?.type === schema.nodes.layoutSection &&
			slice.content.firstChild.childCount === 1 &&
			slice.content.firstChild.firstChild?.type === schema.nodes.layoutColumn
		) {
			const newSlice = new Slice(slice.content.firstChild.firstChild.content, 0, 0);
			return newSlice;
		}
	}

	return slice;
};
