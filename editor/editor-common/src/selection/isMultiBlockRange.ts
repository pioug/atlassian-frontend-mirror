import type { NodeRange } from '@atlaskit/editor-prosemirror/model';

export const isMultiBlockRange = (range: NodeRange): boolean => {
	if (range.endIndex - range.startIndex <= 1) {
		return false; // At most one child
	}

	// Count block nodes in the range, return true if more than one
	let blockCount = 0;
	for (let i = range.startIndex; i < range.endIndex; i++) {
		if (range.parent.child(i).isBlock) {
			blockCount++;
		}
		if (blockCount > 1) {
			return true;
		}
	}

	return false;
};
