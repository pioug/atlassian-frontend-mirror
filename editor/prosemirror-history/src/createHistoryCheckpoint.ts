import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { historyKey } from './historyKey';
import { HistoryState } from './historyState';

/**
 * Capture history before a temporary editing session. The returned command only
 * restores it after the caller has restored the exact original document.
 * Retained edits anywhere in the document cause restoration to return null;
 * this checkpoint does not rebase history around edits made during the session.
 * Callers must discard the checkpoint on remote/rebased edits or intervening
 * undo/redo: document equality alone cannot validate collaboration mappings.
 */
export function createHistoryCheckpoint(
	state: EditorState,
): ((currentState: EditorState) => Transaction | null) | undefined {
	const saved: HistoryState | undefined = historyKey.getState(state);
	if (!saved || saved.historySliceActive) {
		return;
	}
	const originalDoc = state.doc;
	const plugin = historyKey.get(state);
	return (currentState) => {
		const current: HistoryState | undefined = historyKey.getState(currentState);
		if (
			!current ||
			current.historySliceActive ||
			historyKey.get(currentState) !== plugin ||
			!currentState.doc.eq(originalDoc)
		) {
			return null;
		}
		// Retain both pre-session branches, but close the typing group. Neither
		// rejected edits nor their review replacements belong in Undo or Redo.
		return currentState.tr.setMeta(historyKey, {
			historyState: new HistoryState(saved.done, saved.undone, null, 0, -1),
		});
	};
}
