import type { Command } from '../types';
import { addColumn } from './add-column';
import { isInTable } from './is-in-table';
import { selectedRect } from './selection-rect';

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column before the column with the selection.
export const addColumnBefore: Command = (state, dispatch) => {
	if (!isInTable(state)) {
		return false;
	}
	if (dispatch) {
		const rect = selectedRect(state);
		dispatch(addColumn(state.tr, rect, rect.left));
	}
	return true;
};
