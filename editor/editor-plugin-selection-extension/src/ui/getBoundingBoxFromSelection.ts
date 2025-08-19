import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionCoords, BoundingBoxOffset } from '../types';

/**
 * Calculates the bounding box coordinates of a text selection within an editor view.
 *
 * @param view - The editor view instance.
 * @param from - The starting position of the selection.
 * @param to - The ending position of the selection.
 * @param offset - Optional offset to adjust the top and bottom coordinates of the bounding box.
 * @returns An object containing the top, left, bottom, and right coordinates of the bounding box.
 */
export const getBoundingBoxFromSelection = (
	view: EditorView,
	from: number,
	to: number,
	offset: BoundingBoxOffset = { top: 0, bottom: 0 },
): SelectionExtensionCoords => {
	let top = Infinity,
		left = Infinity,
		bottom = -Infinity,
		right = -Infinity;

	// initial version
	for (let pos = from; pos <= to; pos++) {
		const coords = view.coordsAtPos(pos);
		top = Math.min(top, coords.top);
		left = Math.min(left, coords.left);
		bottom = Math.max(bottom, coords.bottom);
		right = Math.max(right, coords.right);
	}

	top = top - offset.top;
	bottom = bottom - offset.bottom;

	return { top, left, bottom, right };
};
