// oxlint-disable-next-line import/no-duplicates
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { historyKey } from './historyKey';
import { HistoryState } from './historyState';
import type { Command, HistoryOptions } from './types';
import { mapInvertableSteps } from './utils/mapInvertableSteps';
import { mustPreserveItems } from './utils/mustPreserveItems';

// Apply the latest event from one branch to the document and shift the event
// onto the other branch.
function histTransaction(
	history: HistoryState,
	state: EditorState,
	redo: boolean,
): Transaction | null {
	const preserveItems = mustPreserveItems(state);
	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	const histOptions = (historyKey.get(state)!.spec as any).config as Required<HistoryOptions>;
	const pop = (redo ? history.undone : history.done).popEvent(state, preserveItems);
	if (!pop) {
		return null;
	}

	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const selection = pop.selection!.resolve(pop.transform.doc);
	const added = (redo ? history.done : history.undone).addTransform(
		pop.transform,
		state.selection.getBookmark(),
		histOptions,
		preserveItems,
	);

	/**
	 * ===
	 * FORK ADDITION START
	 * If history slicing is active when we undo/redo, when we perform an undo/redo we want to
	 * map and keep the relevant steps in the new history state
	 */
	const newHist = history.historySliceActive
		? new HistoryState(
				redo ? added : pop.remaining,
				redo ? pop.remaining : added,
				null,
				0,
				-1,
				history.historySliceActive,
				mapInvertableSteps(history.trackedSteps, pop.transform),
				history.selectionBookmark?.map(pop.transform.mapping),
			)
		: new HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0, -1);
	/**
	 * FORK ADDITION END
	 * ===
	 */
	return pop.transform.setSelection(selection).setMeta(historyKey, { redo, historyState: newHist });
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function buildCommand(redo: boolean, scroll: boolean): Command {
	return (state, dispatch) => {
		const hist = historyKey.getState(state);
		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line eqeqeq
		if (!hist || (redo ? hist.undone : hist.done).eventCount == 0) {
			return false;
		}
		if (dispatch) {
			const tr = histTransaction(hist, state, redo);
			if (tr) {
				dispatch(scroll ? tr.scrollIntoView() : tr);
			}
		}
		return true;
	};
}
