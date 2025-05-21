import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionCoords } from '../types';

/**
 * Calculates the bounding box coordinates of a text selection within an editor view.
 *
 * @param view - The editor view instance.
 * @param from - The starting position of the selection.
 * @param to - The ending position of the selection.
 * @returns An object containing the top, left, bottom, and right coordinates of the bounding box.
 */
export const getBoundingBoxFromSelection = (
	view: EditorView,
	from: number,
	to: number,
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

	return { top, left, bottom, right };
};
