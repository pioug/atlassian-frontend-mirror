import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../../types';

import { GapCursorSelection, Side } from './selection';
import { isValidTargetNode } from './utils/is-valid-target-node';

// This function captures clicks outside of the ProseMirror contentEditable area
// see also description of "handleClick" in gap-cursor pm-plugin
const captureCursorCoords = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	event: React.MouseEvent<any>,
	editorRef: HTMLElement,
	posAtCoords: (coords: {
		left: number;
		top: number;
	}) => { inside: number; pos: number } | null | void,
	tr: Transaction,
): { position?: number; side: Side } | null => {
	const rect = editorRef.getBoundingClientRect();

	// capture clicks before the first block element
	if (event.clientY < rect.top) {
		return { position: 0, side: Side.LEFT };
	}

	if (rect.left > 0) {
		// calculate start position of a node that is vertically at the same level
		const coords = posAtCoords({
			left: rect.left,
			top: event.clientY,
		});
		if (coords && coords.inside > -1) {
			const $from = tr.doc.resolve(coords.inside);
			const start = $from.before(1);

			const side = event.clientX < rect.left ? Side.LEFT : Side.RIGHT;
			let position;
			if (side === Side.LEFT) {
				position = start;
			} else {
				const node = tr.doc.nodeAt(start);
				if (node) {
					position = start + node.nodeSize;
				}
			}

			return { position, side };
		}
	}

	return null;
};

export const setSelectionTopLevelBlocks = (
	tr: Transaction,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	event: React.MouseEvent<any>,
	editorRef: HTMLElement,
	posAtCoords: (coords: {
		left: number;
		top: number;
	}) => { inside: number; pos: number } | null | void,
	editorFocused: boolean,
) => {
	const cursorCoords = captureCursorCoords(event, editorRef, posAtCoords, tr);
	if (!cursorCoords) {
		return;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const $pos = cursorCoords.position !== undefined ? tr.doc.resolve(cursorCoords.position!) : null;

	if ($pos === null) {
		return;
	}

	const isGapCursorAllowed =
		cursorCoords.side === Side.LEFT
			? isValidTargetNode($pos.nodeAfter)
			: isValidTargetNode($pos.nodeBefore);

	if (isGapCursorAllowed && GapCursorSelection.valid($pos)) {
		// this forces PM to re-render the decoration node if we change the side of the gap cursor, it doesn't do it by default
		if (tr.selection instanceof GapCursorSelection) {
			tr.setSelection(Selection.near($pos));
		} else {
			tr.setSelection(new GapCursorSelection($pos, cursorCoords.side));
		}
	}
	// try to set text selection if the editor isnt focused
	// if the editor is focused, we are most likely dragging a selection outside.
	else if (editorFocused === false) {
		const selectionTemp = Selection.findFrom($pos, cursorCoords.side === Side.LEFT ? 1 : -1, true);
		if (selectionTemp) {
			tr.setSelection(selectionTemp);
		}
	}
};

export const setGapCursorAtPos =
	(position: number, side: Side = Side.LEFT): Command =>
	(state, dispatch) => {
		// @see ED-6231
		if (position > state.doc.content.size) {
			return false;
		}

		const $pos = state.doc.resolve(position);

		if (GapCursorSelection.valid($pos)) {
			if (dispatch) {
				dispatch(state.tr.setSelection(new GapCursorSelection($pos, side)));
			}
			return true;
		}

		return false;
	};
