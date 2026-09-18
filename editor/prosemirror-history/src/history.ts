import { Plugin } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Mapping, StepMap, Transform } from '@atlaskit/editor-prosemirror/transform';

import { Branch } from './branch';
import { closeHistoryKey } from './closeHistoryKey';
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
