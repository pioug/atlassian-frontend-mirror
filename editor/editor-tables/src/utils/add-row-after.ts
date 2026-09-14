import type { Command } from '../types';
import { addRow } from './add-row';
import { isInTable } from './is-in-table';
import { selectedRect } from './selection-rect';

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Add a table row after the selection.
export const addRowAfter: Command = (state, dispatch) => {
	if (!isInTable(state)) {
		return false;
	}
	if (dispatch) {
		const rect = selectedRect(state);
		dispatch(addRow(state.tr, rect, rect.bottom));
	}
	return true;
};
