import { Plugin } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Mapping, StepMap, Transform } from '@atlaskit/editor-prosemirror/transform';

import { Branch } from './branch';
import { closeHistoryKey } from './closeHistoryKey';
import { agentUndoDiagnostics } from './diagnostics/agent-undo-diagnostics';
import {
	EXTERNAL_HISTORY_EVENT_META,
	EXTERNAL_HISTORY_OUTCOME_META,
	EXTERNAL_HISTORY_PROMOTION_META,
} from './external-history-event';
import type {
	ExternalHistoryOutcomeMeta,
	ExternalHistoryPartition,
	ExternalHistoryPromotionMeta,
	ExternalHistoryTransactionMeta,
} from './external-history-event';
import { historyKey } from './historyKey';
import { HistoryState } from './historyState';
import { redo } from './redo';
import type { HistoryOptions } from './types';
import { undo } from './undo';
import { createTransformFromSteps } from './utils/createTransformFromSteps';
import { InvertableStep } from './utils/InvertableStep';
import { mapInvertableSteps } from './utils/mapInvertableSteps';
import { mustPreserveItems } from './utils/mustPreserveItems';

/// Returns a plugin that enables the undo history for an editor. The
/// plugin will track undo and redo stacks, which can be used with the
/// [`undo`](#history.undo) and [`redo`](#history.redo) commands.
///
/// You can set an `"addToHistory"` [metadata
/// property](#state.Transaction.setMeta) of `false` on a transaction
/// to prevent it from being rolled back by undo.
export function history(config: HistoryOptions = {}): Plugin {
	config = { depth: config.depth || 100, newGroupDelay: config.newGroupDelay || 500 };

	return new Plugin({
		key: historyKey,

		state: {
			init() {
				return new HistoryState(Branch.empty, Branch.empty, null, 0, -1);
			},
			apply(tr, hist, state) {
				return applyTransaction(hist, state, tr, config as Required<HistoryOptions>);
			},
		},

		config,

		props: {
			handleDOMEvents: {
				beforeinput(view, e: Event) {
					const inputType = (e as InputEvent).inputType;
					const command =
						// To match existing behaviour of prosemirror-history
						// eslint-disable-next-line eqeqeq
						inputType == 'historyUndo' ? undo : inputType == 'historyRedo' ? redo : null;
					if (!command || !view.editable) {
						return false;
					}
					e.preventDefault();
					return command(view.state, view.dispatch);
				},
			},
		},
	});
}

// Record a transformation in undo history.
function applyTransaction(
	history: HistoryState,
	state: EditorState,
	tr: Transaction,
	options: Required<HistoryOptions>,
) {
	const historyTr = tr.getMeta(historyKey);
	let rebased;
	if (historyTr) {
		return historyTr.historyState;
	}

	/**
	 * ===
	 * FORK ADDITION START
	 * A blocked external undo or redo dispatches a step-free transaction carrying nothing but its
	 * outcome. It moved no event between branches. The one change it makes is to drop an event that
	 * can never be applied (`eventDiscarded`), so the stack does not stay blocked behind it.
	 *
	 * With no history slice open, `if (tr.steps.length == 0) return history` further down already
	 * leaves the state alone otherwise. The history-slice branch runs before it, though, and
	 * rebuilds the state whether or not the transaction changed anything; returning the same object
	 * here keeps both branches referentially identical for an outcome that discards nothing.
	 * FORK ADDITION END
	 * ===
	 */
	const outcomeMeta: ExternalHistoryOutcomeMeta | undefined = tr.getMeta(
		EXTERNAL_HISTORY_OUTCOME_META,
	);
	if (tr.steps.length === 0 && outcomeMeta) {
		if (outcomeMeta.outcome === 'blocked' && outcomeMeta.eventDiscarded) {
			// The refused event can never be applied, and leaving it on top would refuse every later
			// undo as well. Drop it, keeping its maps, so the next undo reaches the event beneath.
			const redoing = outcomeMeta.operation === 'redo';
			const discarded = (redoing ? history.undone : history.done).discardExternalEvent();
			if (discarded) {
				return new HistoryState(
					redoing ? history.done : discarded,
					redoing ? discarded : history.undone,
					history.prevRanges,
					history.prevTime,
					history.prevComposition,
					history.historySliceActive,
					history.trackedSteps,
					history.selectionBookmark,
				);
			}
		}
		return history;
	}

	/**
	 * ===
	 * FORK ADDITION START
	 * Promote external (backend agent) batches into ordinary undoable history events.
	 *
	 * This runs before the history-slice branches, the zero-step return, and every ordinary
	 * branch, because an agent receive arrives with `addToHistory: false` and `isRemote: true` and
	 * would otherwise be flattened through `addMaps`.
	 *
	 * Running first also pre-empts the `closeHistory`, `startHistorySlice` and `endHistorySlice`
	 * branches for a transaction that carries both external metadata and one of those metas. None
	 * of those combinations is producible by `classifyRemoteBatch`, which only runs on
	 * collaboration receives, and the `closeHistory` overlap is almost inert because promotion
	 * performs the same grouping reset — only `prevComposition = -1` is missed. The
	 * `endHistorySlice` overlap is the one that would actually hurt: promotion forwards
	 * `historySliceActive` unchanged and re-maps `trackedSteps` rather than flushing them, so the
	 * slice would silently never end and the steps it tracked would never become an event. Do not
	 * reorder this below the history-slice branch without re-checking that the rebased route stays
	 * gated on `historySliceActive`, since that gate is what stops a rebase from rewriting
	 * confirmed history mid-slice.
	 *
	 * There is deliberately no `fg()` read here, and no gate registered in `package.json`. Gating
	 * is structural: this branch only runs for a transaction carrying
	 * `EXTERNAL_HISTORY_EVENT_META`, and that metadata is only ever produced inside a
	 * `isExperimentEnabled('platform_editor_agent_be_review_undo_exp')` branch in `editor-plugin-collab-edit`. Absent
	 * the metadata, behaviour is identical to before. `prosemirror-history` is also consumed
	 * outside collaboration, so reading the gate here would be actively wrong.
	 */
	const externalEvent: ExternalHistoryTransactionMeta | undefined = tr.getMeta(
		EXTERNAL_HISTORY_EVENT_META,
	);
	const promotable = externalEvent
		? externalEvent.partitions.filter((partition) => partition.transactionIndexes.length > 0)
		: [];
	// A receive that lands after the slice has already tracked steps cannot be promoted yet. The
	// slice's steps end up on top of the promoted item in `done`, but the item's inverse is framed
	// against a document that still contains them, so once the slice is undone the agent event's
	// undo applies at the wrong positions and silently does nothing. Fixing that means remapping the
	// items below a slice when it ends, which is outside promotion. Until then such a receive stays
	// map-only (exactly the pre-existing slice behaviour) rather than creating an event that can
	// never be undone. A slice with no tracked steps yet is safe: its later steps land above the
	// agent item in the right frame.
	// Steps that cannot move content (the collab plugin's appended analytics step is one) are
	// tracked by the slice too, but they leave the frame untouched, so they do not count.
	const sliceHasTrackedSteps =
		history?.historySliceActive === true &&
		(history.trackedSteps ?? []).some((tracked) => {
			let changesContent = false;
			tracked.step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
				if (oldEnd > oldStart || newEnd > newStart) {
					changesContent = true;
				}
			});
			return changesContent;
		});
	if (externalEvent && promotable.length > 0 && tr.steps.length > 0) {
		if (!sliceHasTrackedSteps) {
			return promoteExternalEvent(history, state, tr, options, externalEvent, promotable);
		}
		if (agentUndoDiagnostics.isEnabled()) {
			promotable.forEach((partition) => {
				agentUndoDiagnostics.record(
					'batch-rejected',
					externalEvent.editorInstanceId,
					partition.invocationId,
					undefined,
					{
						gate: 'enabled-by-producer',
						batch: partition.batch,
						receive: externalEvent.receive,
						transactionIndexes: partition.transactionIndexes,
						activeHistorySlice: true,
						rejectionReason: 'history-slice-has-tracked-steps' as const,
					},
				);
			});
		}
	}

	/**
	 * If history slicing is active, we want to continue the current slice
	 */

	if (
		(tr.getMeta('startHistorySlice') === true || history?.historySliceActive) &&
		tr.getMeta('endHistorySlice') !== true
	) {
		const shouldIgnoreChange = tr.getMeta('isRemote');
		if (shouldIgnoreChange) {
			// For addToHistory=false transactions during a slice, we need to:
			// 1. Update the mapping for done/undone branches
			// 2. Map the existing steps
			// 3. Update the document to rebaseline
			const mappedRanges = history.prevRanges ? mapRanges(history.prevRanges, tr.mapping) : null;
			return new HistoryState(
				history.done.addMaps(tr.mapping.maps),
				history.undone.addMaps(tr.mapping.maps),
				mappedRanges,
				history.prevTime,
				history.prevComposition,
				true,
				mapInvertableSteps(history.trackedSteps, tr),
				history.selectionBookmark,
			);
		}
		const startHistorySlice = tr.getMeta('startHistorySlice') === true;
		const newTrackedSteps = [
			...(history.trackedSteps || []),
			...tr.steps.map((s, idx) => new InvertableStep(s, s.invert(tr.docs[idx]))),
		];
		const mappedRanges = history.prevRanges ? mapRanges(history.prevRanges, tr.mapping) : null;
		return new HistoryState(
			history.done,
			startHistorySlice ? Branch.empty : history.undone,
			mappedRanges,
			history.prevTime,
			history.prevComposition,
			true,
			newTrackedSteps,
			startHistorySlice ? state.selection.getBookmark() : history.selectionBookmark,
		);
	} else if (tr.getMeta('endHistorySlice') === true && history.historySliceActive) {
		const trackedSteps = history.historySliceActive ? history.trackedSteps || [] : [];
		// Create transform that represents the changes made during the slice
		// Use the original slice document as the base
		const transform = createTransformFromSteps(trackedSteps, tr.doc);
		const mappedRanges = history.prevRanges ? mapRanges(history.prevRanges, tr.mapping) : null;
		return new HistoryState(
			history.done
				.addMaps(tr.mapping.maps)
				.addTransform(transform, history.selectionBookmark, options, mustPreserveItems(state)),
			history.undone.addMaps(tr.mapping.maps),
			mappedRanges,
			history.prevTime,
			history.prevComposition,
		);
	}

	/**
	 * FORK ADDITION END
	 * ===
	 */

	if (tr.getMeta(closeHistoryKey)) {
		history = new HistoryState(history.done, history.undone, null, 0, -1);
	}

	const appended = tr.getMeta('appendedTransaction');

	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line eqeqeq
	if (tr.steps.length == 0) {
		return history;
	} else if (appended && appended.getMeta(historyKey)) {
		if (appended.getMeta(historyKey).redo) {
			return new HistoryState(
				history.done.addTransform(tr, undefined, options, mustPreserveItems(state)),
				history.undone,
				rangesFor(tr.mapping.maps),
				history.prevTime,
				history.prevComposition,
			);
		} else {
			return new HistoryState(
				history.done,
				history.undone.addTransform(tr, undefined, options, mustPreserveItems(state)),
				null,
				history.prevTime,
				history.prevComposition,
			);
		}
	} else if (
		tr.getMeta('addToHistory') !== false &&
		!(appended && appended.getMeta('addToHistory') === false)
	) {
		// Group transforms that occur in quick succession into one event.
		const composition = tr.getMeta('composition');
		const newGroup =
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line eqeqeq
			history.prevTime == 0 ||
			(!appended &&
				// To match existing behaviour of prosemirror-history
				// eslint-disable-next-line eqeqeq
				history.prevComposition != composition &&
				(history.prevTime < (tr.time || 0) - options.newGroupDelay ||
					// To match existing behaviour of prosemirror-history
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					!isAdjacentTo(tr, history.prevRanges!)));
		const prevRanges = appended
			? // To match existing behaviour of prosemirror-history
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				mapRanges(history.prevRanges!, tr.mapping)
			: rangesFor(tr.mapping.maps);
		return new HistoryState(
			history.done.addTransform(
				tr,
				newGroup ? state.selection.getBookmark() : undefined,
				options,
				mustPreserveItems(state),
			),
			Branch.empty,
			prevRanges,
			tr.time,
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line eqeqeq
			composition == null ? history.prevComposition : composition,
		);
		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line no-cond-assign
	} else if ((rebased = tr.getMeta('rebased'))) {
		// Used by the collab module to tell the history that some of its
		// content has been rebased.
		return new HistoryState(
			history.done.rebased(tr, rebased),
			history.undone.rebased(tr, rebased),
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			mapRanges(history.prevRanges!, tr.mapping),
			history.prevTime,
			history.prevComposition,
		);
	} else {
		return new HistoryState(
			history.done.addMaps(tr.mapping.maps),
			history.undone.addMaps(tr.mapping.maps),
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			mapRanges(history.prevRanges!, tr.mapping),
			history.prevTime,
			history.prevComposition,
		);
	}
}

/**
 * ===
 * FORK ADDITION START
 * Every promoted partition becomes its own undo event. A later batch of the same invocation is a
 * separate event too: one reconcile arrives as one receive, so a follow-up batch is rare, and
 * folding it into the previous event would need an adjacency state that every other history path
 * has to invalidate. `ExternalHistoryPartition.isFollowUp` measures how often that case occurs.
 */
function promoteExternalEvent(
	history: HistoryState,
	state: EditorState,
	tr: Transaction,
	options: Required<HistoryOptions>,
	meta: ExternalHistoryTransactionMeta,
	partitions: readonly ExternalHistoryPartition[],
): HistoryState {
	const selection = state.selection.getBookmark();
	const rebasedCount = tr.getMeta('rebased');
	// `rebaseWithExternalEvents` locates the unconfirmed local items as the top `rebasedCount`
	// items of the branch. An active history slice breaks that correspondence: in-slice steps are
	// held in `trackedSteps` and add no items to `done`, while `prosemirror-collab` still counts
	// them as unconfirmed and so includes them in `rebased`. The count would then overshoot the
	// items that really are unconfirmed, and the rebase would remove and rewrite items of
	// confirmed history — losing undo content rather than just mis-ordering it.
	const sliceActive = history.historySliceActive === true;
	const rebasedRoute = Boolean(rebasedCount) && !sliceActive;

	const promotion = rebasedRoute
		? // Never flatten a rebased transaction through `addMaps`: that would double-count the
			// inverted and remapped local phases.
			history.done.rebaseWithExternalEvents(
				tr,
				rebasedCount,
				partitions,
				meta.remoteTransformRange,
				selection,
				meta.editorInstanceId,
				options,
			)
		: // Direct receive, or a rebased receive during a slice. Append one item per transform map,
			// which is the frame the slice's own `addMaps` path establishes for a remote receive, while
			// still attaching the inverse steps and metadata that make the owned run undoable.
			history.done.addDirectExternalEvents(
				tr,
				partitions,
				selection,
				meta.editorInstanceId,
				options,
			);

	const nextHistory = new HistoryState(
		promotion.branch,
		// A promotion changes the newest completed event, so it clears redo exactly as an ordinary
		// new history event does.
		Branch.empty,
		// Equivalent to the grouping effect of `closeHistory`: `prevTime == 0` forces `newGroup` on
		// the next human transaction, so immediate typing cannot join the agent's event.
		null,
		0,
		history.prevComposition,
		// An active history slice keeps running. Its tracked steps are mapped through the receive,
		// but the promotion neither joins nor ends the slice.
		history.historySliceActive,
		mapInvertableSteps(history.trackedSteps, tr),
		history.selectionBookmark,
	);
	const outcome: ExternalHistoryPromotionMeta = {
		promotedEventCount: promotion.events,
		promotedItemCount: promotion.promotedItems,
		route: rebasedRoute ? 'rebased' : 'direct',
		activeHistorySlice: sliceActive,
	};
	tr.setMeta(EXTERNAL_HISTORY_PROMOTION_META, outcome);
	if (agentUndoDiagnostics.isEnabled()) {
		const historyCounts = {
			before: agentUndoDiagnostics.getHistoryCounts(history),
			after: agentUndoDiagnostics.getHistoryCounts(nextHistory),
		};
		partitions.forEach((partition, index) => {
			const promoted = promotion.newEventPartitionIndexes.includes(index);
			agentUndoDiagnostics.record(
				promoted ? 'batch-promoted' : 'batch-rejected',
				meta.editorInstanceId,
				partition.invocationId,
				undefined,
				{
					gate: 'enabled-by-producer',
					batch: partition.batch,
					receive: meta.receive,
					transactionIndexes: partition.transactionIndexes,
					route: outcome.route,
					activeHistorySlice: sliceActive,
					history: historyCounts,
					...(promoted ? {} : { rejectionReason: 'no-promotable-items' as const }),
				},
			);
		});
	}
	return nextHistory;
}
/**
 * FORK ADDITION END
 * ===
 */

function isAdjacentTo(transform: Transform, prevRanges: readonly number[]) {
	if (!prevRanges) {
		return false;
	}
	if (!transform.docChanged) {
		return true;
	}
	let adjacent = false;
	transform.mapping.maps[0].forEach((start, end) => {
		for (let i = 0; i < prevRanges.length; i += 2) {
			if (start <= prevRanges[i + 1] && end >= prevRanges[i]) {
				adjacent = true;
			}
		}
	});
	return adjacent;
}

function rangesFor(maps: readonly StepMap[]) {
	const result: number[] = [];
	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line eqeqeq
	for (let i = maps.length - 1; i >= 0 && result.length == 0; i--) {
		maps[i].forEach((_from, _to, from, to) => result.push(from, to));
	}
	return result;
}

function mapRanges(ranges: readonly number[], mapping: Mapping) {
	if (!ranges) {
		return null;
	}
	const result: number[] = [];
	for (let i = 0; i < ranges.length; i += 2) {
		const from = mapping.map(ranges[i], 1),
			to = mapping.map(ranges[i + 1], -1);
		if (from <= to) {
			result.push(from, to);
		}
	}
	return result;
}
