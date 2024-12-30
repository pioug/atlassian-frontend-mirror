import {
	atTheBeginningOfDoc,
	atTheEndOfDoc,
	GapCursorSelection,
	Side,
	isValidTargetNode,
} from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import {
	isMediaNode,
	isNodeBeforeMediaNode,
	isPositionNearTableRow,
} from '@atlaskit/editor-common/utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findDomRefAtPos,
	findPositionOfNodeBefore,
	removeNodeBefore,
} from '@atlaskit/editor-prosemirror/utils';

import { gapCursorPluginKey } from '../gap-cursor-plugin-key';

import { Direction, isBackward, isForward } from './direction';
import { isTextBlockNearPos } from './utils';

export type DirectionString = 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';

export const shouldSkipGapCursor = (
	direction: Direction,
	state: EditorState,
	$pos: ResolvedPos,
) => {
	const { doc, schema } = state;

	switch (direction) {
		case Direction.UP:
			if (atTheBeginningOfDoc(state)) {
				return false;
			}
			return (
				isPositionNearTableRow($pos, schema, 'before') ||
				isTextBlockNearPos(doc, schema, $pos, -1) ||
				isNodeBeforeMediaNode($pos, state)
			);
		case Direction.DOWN:
			return (
				atTheEndOfDoc(state) ||
				isTextBlockNearPos(doc, schema, $pos, 1) ||
				isPositionNearTableRow($pos, schema, 'after') ||
				($pos.nodeBefore?.type.name === 'text' && !$pos.nodeAfter) // end of a paragraph
			);
		default:
			return false;
	}
};

// These cases should be handled using the handleMediaGapCursor function
function shouldHandleMediaGapCursor(dir: Direction, state: EditorState) {
	const { selection } = state;

	const upArrowFromGapCursorIntoMedia =
		selection instanceof GapCursorSelection &&
		dir === Direction.UP &&
		selection.$from.nodeBefore &&
		isMediaNode(selection.$from.nodeBefore);
	const downArrowFromGapCursorIntoMediaGroup =
		selection instanceof GapCursorSelection &&
		dir === Direction.DOWN &&
		selection.$from.nodeAfter?.type.name === 'mediaGroup';

	return upArrowFromGapCursorIntoMedia || downArrowFromGapCursorIntoMediaGroup;
}

// Handle media gap cursor for up/down arrow into media nodes
// Should check this case by using shouldHandleMediaGapCursor first
function handleMediaGapCursor(dir: Direction, state: EditorState): Transaction {
	const { selection, tr } = state;
	const $pos = isBackward(dir) ? selection.$from : selection.$to;

	if (
		dir === Direction.UP &&
		selection.$from.nodeBefore &&
		isMediaNode(selection.$from.nodeBefore)
	) {
		const nodeBeforePos = findPositionOfNodeBefore(tr.selection);
		if (
			nodeBeforePos &&
			(selection as GapCursorSelection).side === 'right' &&
			tr.doc.nodeAt(nodeBeforePos)?.type.name === 'mediaSingle'
		) {
			tr.setSelection(new NodeSelection(tr.doc.resolve(nodeBeforePos))).scrollIntoView();
		} else if (nodeBeforePos || nodeBeforePos === 0) {
			tr.setSelection(
				new GapCursorSelection(tr.doc.resolve(nodeBeforePos), Side.LEFT),
			).scrollIntoView();
		}
	}

	if (dir === Direction.DOWN && selection.$from.nodeAfter) {
		const nodeAfterPos =
			(selection as GapCursorSelection).side === 'right'
				? $pos.pos
				: $pos.pos + selection.$from.nodeAfter.nodeSize;
		if (nodeAfterPos) {
			tr.setSelection(
				new GapCursorSelection(tr.doc.resolve(nodeAfterPos), Side.LEFT),
			).scrollIntoView();
		}
	}
	return tr;
}

export const arrow =
	(
		dir: Direction,
		endOfTextblock?: (dir: DirectionString, state?: EditorState) => boolean,
	): Command =>
	(state, dispatch, view) => {
		const { doc, selection, tr } = state;
		let $pos = isBackward(dir) ? selection.$from : selection.$to;
		let mustMove = selection.empty;

		// start from text selection
		if (selection instanceof TextSelection) {
			// if cursor is in the middle of a text node, do nothing
			if (!endOfTextblock || !endOfTextblock(dir.toString() as DirectionString)) {
				return false;
			}

			// UP/DOWN jumps to the nearest texblock skipping gapcursor whenever possible
			if (shouldSkipGapCursor(dir, state, $pos)) {
				return false;
			}

			// otherwise resolve previous/next position
			$pos = doc.resolve(isBackward(dir) ? $pos.before() : $pos.after());
			mustMove = false;
		}

		if (selection instanceof NodeSelection) {
			if (selection.node.isInline) {
				return false;
			}

			if (
				(dir === Direction.UP &&
					!atTheBeginningOfDoc(state) &&
					!isNodeBeforeMediaNode($pos, state)) ||
				dir === Direction.DOWN
			) {
				// We dont add gap cursor on node selections going up and down
				// Except we do if we're going up for a block node which is the
				// first node in the document OR the node before is a media node
				return false;
			}
		}

		// Handle media gap cursor for up/down arrow into media nodes
		if (shouldHandleMediaGapCursor(dir, state)) {
			const updatedTr = handleMediaGapCursor(dir, state);
			if (dispatch) {
				dispatch(updatedTr);
			}
			return true;
		}

		// when jumping between block nodes at the same depth, we need to reverse cursor without changing ProseMirror position
		if (
			selection instanceof GapCursorSelection &&
			// next node allow gap cursor position
			isValidTargetNode(isBackward(dir) ? $pos.nodeBefore : $pos.nodeAfter) &&
			// gap cursor changes block node
			((isBackward(dir) && selection.side === Side.LEFT) ||
				(isForward(dir) && selection.side === Side.RIGHT))
		) {
			// reverse cursor position
			if (dispatch) {
				dispatch(
					tr
						.setSelection(
							new GapCursorSelection($pos, selection.side === Side.RIGHT ? Side.LEFT : Side.RIGHT),
						)
						.scrollIntoView(),
				);
			}
			return true;
		}

		if (view) {
			const domAtPos = view.domAtPos.bind(view);
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const target = findDomRefAtPos($pos.pos, domAtPos) as HTMLElement;

			if (target && target.textContent === ZERO_WIDTH_SPACE) {
				return false;
			}
		}

		const nextSelection = GapCursorSelection.findFrom($pos, isBackward(dir) ? -1 : 1, mustMove);

		if (!nextSelection) {
			return false;
		}

		if (
			!isValidTargetNode(
				isForward(dir) ? nextSelection.$from.nodeBefore : nextSelection.$from.nodeAfter,
			)
		) {
			// reverse cursor position
			if (dispatch) {
				dispatch(
					tr
						.setSelection(
							new GapCursorSelection(nextSelection.$from, isForward(dir) ? Side.LEFT : Side.RIGHT),
						)
						.scrollIntoView(),
				);
			}
			return true;
		}

		if (dispatch) {
			dispatch(tr.setSelection(nextSelection).scrollIntoView());
		}
		return true;
	};

export const deleteNode =
	(dir: Direction): Command =>
	(state, dispatch) => {
		if (state.selection instanceof GapCursorSelection) {
			const { $from, $anchor } = state.selection;
			let { tr } = state;
			if (isBackward(dir)) {
				if (state.selection.side === 'left') {
					tr.setSelection(new GapCursorSelection($anchor, Side.RIGHT));
					if (dispatch) {
						dispatch(tr);
					}
					return true;
				}
				tr = removeNodeBefore(state.tr);
			} else if ($from.nodeAfter) {
				tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
			}
			if (dispatch) {
				dispatch(
					tr
						.setSelection(Selection.near(tr.doc.resolve(tr.mapping.map(state.selection.$from.pos))))
						.scrollIntoView(),
				);
			}
			return true;
		}
		return false;
	};

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
	}) => { pos: number; inside: number } | null | void,
	tr: Transaction,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
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
	}) => { pos: number; inside: number } | null | void,
	editorFocused: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
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

export const setCursorForTopLevelBlocks =
	(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		event: React.MouseEvent<any>,
		editorRef: HTMLElement,
		posAtCoords: (coords: {
			left: number;
			top: number;
		}) => { pos: number; inside: number } | null | void,
		editorFocused: boolean,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/max-params
	): Command =>
	(state, dispatch) => {
		const { tr } = state;
		setSelectionTopLevelBlocks(tr, event, editorRef, posAtCoords, editorFocused);

		if (tr.selectionSet && dispatch) {
			dispatch(tr);
			return true;
		}

		return false;
	};

export const hasGapCursorPlugin = (state: EditorState): boolean => {
	return Boolean(gapCursorPluginKey.get(state));
};
