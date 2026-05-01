import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorState,
	// @ts-ignore -- ReadonlyTransaction is a local declaration
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findCellClosestToPos } from '@atlaskit/editor-tables/utils';

import { TableCssClassName as ClassName } from '../../types';

interface ActiveCellHighlightState {
	/** Position of the currently highlighted cell, or -1 if none */
	cellPos: number;
	decorationSet: DecorationSet;
}

const EMPTY_STATE: ActiveCellHighlightState = {
	cellPos: -1,
	decorationSet: DecorationSet.empty,
};

export const activeCellHighlightPluginKey: PluginKey<ActiveCellHighlightState> = new PluginKey<ActiveCellHighlightState>(
	'tableActiveCellHighlight',
);

/**
 * Returns the position of the cell containing the cursor, or -1 if the cursor
 * is not in a table cell or the selection is a CellSelection.
 */
const getActiveCellPos = (state: EditorState): number => {
	if (state.selection instanceof CellSelection) {
		return -1;
	}

	try {
		const cell = findCellClosestToPos(state.selection.$from);
		return cell ? cell.pos : -1;
	} catch {
		return -1;
	}
};

const buildState = (cellPos: number, state: EditorState): ActiveCellHighlightState => {
	if (cellPos === -1) {
		return EMPTY_STATE;
	}

	try {
		const cell = state.doc.nodeAt(cellPos);
		if (!cell) {
			return EMPTY_STATE;
		}

		const decoration = Decoration.node(cellPos, cellPos + cell.nodeSize, {
			class: ClassName.ACTIVE_CURSOR_CELL,
		});

		return {
			cellPos,
			decorationSet: DecorationSet.create(state.doc, [decoration]),
		};
	} catch {
		return EMPTY_STATE;
	}
};

export const createPlugin = (): SafePlugin<ActiveCellHighlightState> => {
	return new SafePlugin<ActiveCellHighlightState>({
		key: activeCellHighlightPluginKey,
		state: {
			init: (_: unknown, state: EditorState): ActiveCellHighlightState => {
				return buildState(getActiveCellPos(state), state);
			},

			apply: (
				tr: Transaction | ReadonlyTransaction,
				prev: ActiveCellHighlightState,
				_oldState: EditorState,
				newState: EditorState,
			): ActiveCellHighlightState => {
				if (tr.docChanged) {
					// Doc changed — always rebuild since positions may have shifted
					return buildState(getActiveCellPos(newState), newState);
				}

				if (!tr.selectionSet) {
					// Neither doc nor selection changed — nothing to do
					return prev;
				}

				// Selection changed — only rebuild if cursor moved to a different cell
				const nextCellPos = getActiveCellPos(newState);
				if (nextCellPos === prev.cellPos) {
					return prev;
				}

				return buildState(nextCellPos, newState);
			},
		},
		props: {
			decorations: (state) => {
				return activeCellHighlightPluginKey.getState(state)?.decorationSet ?? DecorationSet.empty;
			},
		},
	});
};
