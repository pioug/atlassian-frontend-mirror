import {
	backspace,
	bindKeymapWithCommand,
	deleteKey,
	insertNewLine,
	moveDown,
	moveLeft,
	moveRight,
	moveUp,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { createParagraphNear } from '@atlaskit/editor-prosemirror/commands';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { arrow, deleteNode } from './gap-cursor/actions';
import { Direction } from './gap-cursor/direction';

export default function keymapPlugin(): SafePlugin {
	const map = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		insertNewLine.common!,
		(state, dispatch, view) => {
			const isInGapCursor = state.selection instanceof GapCursorSelection;
			// Only operate in gap cursor
			if (!isInGapCursor) {
				return false;
			}
			return createParagraphNear(state, dispatch);
		},
		map,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveLeft.common!,
		(state, dispatch, view) => {
			const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
			return arrow(Direction.LEFT, endOfTextblock)(state, dispatch, view);
		},
		map,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveRight.common!,
		(state, dispatch, view) => {
			const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
			return arrow(Direction.RIGHT, endOfTextblock)(state, dispatch);
		},
		map,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveUp.common!,
		(state, dispatch, view) => {
			const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
			return arrow(Direction.UP, endOfTextblock)(state, dispatch);
		},
		map,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveDown.common!,
		(state, dispatch, view) => {
			const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
			return arrow(Direction.DOWN, endOfTextblock)(state, dispatch);
		},
		map,
	);

	// default PM's Backspace doesn't handle removing block nodes when cursor is after it
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(backspace.common!, deleteNode(Direction.BACKWARD), map);

	// handle Delete key (remove node after the cursor)
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(deleteKey.common!, deleteNode(Direction.FORWARD), map);

	return keymap(map) as SafePlugin;
}
