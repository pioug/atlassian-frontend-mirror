// This file defines a number of helpers for wiring up user input to
// table-related functionality.

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { CellSelection } from '../cell-selection';
import { cellAround } from '../utils/cell-around';

export function handleTripleClick(view: EditorView, pos: number): boolean {
	const { doc } = view.state;
	const $cell = cellAround(doc.resolve(pos));
	if (!$cell) {
		return false;
	}
	view.dispatch(view.state.tr.setSelection(new CellSelection($cell)));
	return true;
}
