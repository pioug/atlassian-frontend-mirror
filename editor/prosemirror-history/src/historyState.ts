import type { SelectionBookmark } from '@atlaskit/editor-prosemirror/state';

import type { Branch } from './branch';
import type { InvertableStep } from './utils/InvertableStep';

// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
export class HistoryState {
	constructor(
		readonly done: Branch,
		readonly undone: Branch,
		readonly prevRanges: readonly number[] | null,
		readonly prevTime: number,
		readonly prevComposition: number,
		/**
		 * ===
		 * FORK ADDITION START
		 * Allow for "history slicing" which groups together changes regardless of time / position adjacency
		 */
		readonly historySliceActive?: boolean,
		readonly trackedSteps?: InvertableStep[],
		readonly selectionBookmark?: SelectionBookmark | undefined,
		/**
		 * FORK ADDITION END
		 * ===
		 */
	) {}
}
