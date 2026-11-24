// oxlint-disable-next-line import/no-duplicates
import type {
	EditorState,
	SelectionBookmark,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { Branch, ExternalItemMetadata } from './branch';
import { agentUndoDiagnostics } from './diagnostics/agent-undo-diagnostics';
import { EXTERNAL_HISTORY_OUTCOME_META } from './external-history-event';
import type {
	ExternalHistoryBlockedReason,
	ExternalHistoryOutcomeMeta,
} from './external-history-event';
import { historyKey } from './historyKey';
import { HistoryState } from './historyState';
import type { Command, HistoryOptions } from './types';
import { mapInvertableSteps } from './utils/mapInvertableSteps';
import { mustPreserveItems } from './utils/mustPreserveItems';

/**
 * ===
 * FORK ADDITION START
 * The shape both pop paths have in common. `popExternalEvent` returns this plus the popped event's
 * batch identity; the inherited `popEvent` returns exactly this.
 */
type PoppedEvent = {
	remaining: Branch;
	selection: SelectionBookmark | undefined;
	transform: Transaction;
};

/**
 * A blocked external undo or redo. It consumes the keyboard shortcut — so the browser's own DOM
 * undo cannot run behind our back — while changing no document content. It carries nothing but the
 * outcome, and `applyTransaction` has a matching guard that drops the event that could not be
 * applied, so the next undo reaches the one beneath it.
 */
function blockedExternalTransaction(
	state: EditorState,
	redo: boolean,
	externalMetadata: ExternalItemMetadata,
	reason: ExternalHistoryBlockedReason,
): Transaction {
	const outcome: ExternalHistoryOutcomeMeta = {
		editorInstanceId: externalMetadata.editorInstanceId,
		operation: redo ? 'redo' : 'undo',
		outcome: 'blocked',
		reason,
		// Every reason here is permanent: the event only gets harder to apply as the document moves
		// on. Leaving it on top would block every later undo too, so history drops it.
		eventDiscarded: true,
	};
	if (agentUndoDiagnostics.isEnabled()) {
		const history = historyKey.getState(state);
		agentUndoDiagnostics.record(
			redo ? 'redo-blocked' : 'undo-blocked',
			externalMetadata.editorInstanceId,
			externalMetadata.invocationId,
			reason,
			{
				gate: 'enabled-by-producer',
				preflight: 'blocked',
				...(history
					? {
							history: {
								before: agentUndoDiagnostics.getHistoryCounts(history),
								after: agentUndoDiagnostics.getHistoryCounts(history),
							},
						}
					: {}),
			},
		);
	}
	return state.tr.setMeta('addToHistory', false).setMeta(EXTERNAL_HISTORY_OUTCOME_META, outcome);
}
/**
 * FORK ADDITION END
 * ===
 */

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
	const branch = redo ? history.undone : history.done;

	/**
	 * ===
	 * FORK ADDITION START
	 * An event promoted from an external (backend agent) batch is taken off the branch
	 * all-or-nothing. `popExternalEvent` returns `null` when the newest event is not external, in
	 * which case this is the inherited path unchanged.
	 *
	 * Both branches below are calculated only after a successful preflight: on failure this returns
	 * before `added` or either `HistoryState` is constructed, and `popExternalEvent` builds
	 * `remaining` only once its whole walk has succeeded.
	 */
	let pop: PoppedEvent | null;
	let externalMetadata: ExternalItemMetadata | undefined;
	const externalPop = branch.popExternalEvent(state, preserveItems);
	if (externalPop) {
		if (!externalPop.ok) {
			return blockedExternalTransaction(
				state,
				redo,
				externalPop.externalMetadata,
				externalPop.reason,
			);
		}
		pop = externalPop;
		externalMetadata = externalPop.externalMetadata;
	} else {
		pop = branch.popEvent(state, preserveItems);
	}
	/**
	 * FORK ADDITION END
	 * ===
	 */

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
		// The event keeps its batch identity on the opposite branch, so the opposite direction can
		// be preflighted too and `canMerge` keeps refusing to fold its items into a human event.
		externalMetadata,
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
	const transaction = pop.transform
		.setSelection(selection)
		.setMeta(historyKey, { redo, historyState: newHist });
	/**
	 * ===
	 * FORK ADDITION START
	 * A successful external operation reports its outcome on the document transaction itself.
	 */
	if (externalMetadata) {
		const outcome: ExternalHistoryOutcomeMeta = {
			editorInstanceId: externalMetadata.editorInstanceId,
			operation: redo ? 'redo' : 'undo',
			outcome: 'succeeded',
		};
		if (agentUndoDiagnostics.isEnabled()) {
			agentUndoDiagnostics.record(
				redo ? 'redo-succeeded' : 'undo-succeeded',
				externalMetadata.editorInstanceId,
				externalMetadata.invocationId,
				undefined,
				{
					gate: 'enabled-by-producer',
					preflight: 'succeeded',
					history: {
						before: agentUndoDiagnostics.getHistoryCounts(history),
						after: agentUndoDiagnostics.getHistoryCounts(newHist),
					},
				},
			);
		}
		return transaction.setMeta(EXTERNAL_HISTORY_OUTCOME_META, outcome);
	}
	/**
	 * FORK ADDITION END
	 * ===
	 */
	return transaction;
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
