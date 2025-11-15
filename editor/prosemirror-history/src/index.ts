import RopeSequence from 'rope-sequence';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Plugin, PluginKey, type SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type { Step, StepMap, Transform } from '@atlaskit/editor-prosemirror/transform';
import { Mapping } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	createTransformFromSteps,
	InvertableStep,
	mapInvertableSteps,
} from './utils/createTransformFromSteps';

type CommandDispatch = (tr: Transaction) => void;
// Duplicated type to avoid circular dependency
type Command = (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => boolean;

// ProseMirror's history isn't simply a way to roll back to a previous
// state, because ProseMirror supports applying changes without adding
// them to the history (for example during collaboration).
//
// To this end, each 'Branch' (one for the undo history and one for
// the redo history) keeps an array of 'Items', which can optionally
// hold a step (an actual undoable change), and always hold a position
// map (which is needed to move changes below them to apply to the
// current document).
//
// An item that has both a step and a selection bookmark is the start
// of an 'event' — a group of changes that will be undone or redone at
// once. (It stores only the bookmark, since that way we don't have to
// provide a document until the selection is actually applied, which
// is useful when compressing.)

// Used to schedule history compression
const max_empty_items = 500;

class Branch {
	constructor(
		readonly items: RopeSequence<Item>,
		readonly eventCount: number,
	) {}

	// Pop the latest event off the branch's history and apply it
	// to a document transform.
	popEvent(state: EditorState, preserveItems: boolean) {
		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line eqeqeq
		if (this.eventCount == 0) {
			return null;
		}

		let end = this.items.length;
		for (; ; end--) {
			const next = this.items.get(end - 1);
			if (next.selection) {
				--end;
				break;
			}
		}

		let remap: Mapping | undefined, mapFrom: number | undefined;
		if (preserveItems) {
			remap = this.remapping(end, this.items.length);
			mapFrom = remap.maps.length;
		}
		const transform = state.tr;
		let selection: SelectionBookmark | undefined, remaining: Branch | undefined;
		const addAfter: Item[] = [],
			addBefore: Item[] = [];

		this.items.forEach(
			(item, i) => {
				if (!item.step) {
					if (!remap) {
						remap = this.remapping(end, i + 1);
						mapFrom = remap.maps.length;
					}
					// To match existing behaviour of prosemirror-history
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					mapFrom!--;
					addBefore.push(item);
					return;
				}

				if (remap) {
					addBefore.push(new Item(item.map));
					const step = item.step.map(remap.slice(mapFrom));
					let map;

					if (step && transform.maybeStep(step).doc) {
						map = transform.mapping.maps[transform.mapping.maps.length - 1];
						addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length));
					}
					// To match existing behaviour of prosemirror-history
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					mapFrom!--;
					if (map) {
						remap.appendMap(map, mapFrom);
					}
				} else {
					transform.maybeStep(item.step);
				}

				if (item.selection) {
					selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
					remaining = new Branch(
						this.items.slice(0, end).append(addBefore.reverse().concat(addAfter)),
						this.eventCount - 1,
					);
					return false;
				}
			},
			this.items.length,
			0,
		);

		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return { remaining: remaining!, transform, selection: selection! };
	}

	// Create a new branch with the given transform added.
	addTransform(
		transform: Transform,
		selection: SelectionBookmark | undefined,
		histOptions: Required<HistoryOptions>,
		preserveItems: boolean,
	) {
		const newItems: Item[] = [];
		let eventCount = this.eventCount;
		let oldItems = this.items,
			lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;

		for (let i = 0; i < transform.steps.length; i++) {
			const step = transform.steps[i].invert(transform.docs[i]);
			let item = new Item(transform.mapping.maps[i], step, selection),
				merged;
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line no-cond-assign
			if ((merged = lastItem && lastItem.merge(item))) {
				item = merged;
				if (i) {
					newItems.pop();
				} else {
					oldItems = oldItems.slice(0, oldItems.length - 1);
				}
			}
			newItems.push(item);
			if (selection) {
				eventCount++;
				selection = undefined;
			}
			if (!preserveItems) {
				lastItem = item;
			}
		}
		const overflow = eventCount - histOptions.depth;
		if (overflow > DEPTH_OVERFLOW) {
			oldItems = cutOffEvents(oldItems, overflow);
			eventCount -= overflow;
		}
		return new Branch(oldItems.append(newItems), eventCount);
	}

	remapping(from: number, to: number): Mapping {
		const maps = new Mapping();
		this.items.forEach(
			(item, i) => {
				const mirrorPos =
					item.mirrorOffset != null && i - item.mirrorOffset >= from
						? maps.maps.length - item.mirrorOffset
						: undefined;
				maps.appendMap(item.map, mirrorPos);
			},
			from,
			to,
		);
		return maps;
	}

	addMaps(array: readonly StepMap[]) {
		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line eqeqeq
		if (this.eventCount == 0) {
			return this;
		}
		return new Branch(this.items.append(array.map((map) => new Item(map))), this.eventCount);
	}

	// When the collab module receives remote changes, the history has
	// to know about those, so that it can adjust the steps that were
	// rebased on top of the remote changes, and include the position
	// maps for the remote changes in its array of items.
	rebased(rebasedTransform: Transform, rebasedCount: number) {
		if (!this.eventCount) {
			return this;
		}

		const rebasedItems: Item[] = [],
			start = Math.max(0, this.items.length - rebasedCount);

		const mapping = rebasedTransform.mapping;
		let newUntil = rebasedTransform.steps.length;
		let eventCount = this.eventCount;
		this.items.forEach((item) => {
			if (item.selection) {
				eventCount--;
			}
		}, start);

		let iRebased = rebasedCount;
		this.items.forEach((item) => {
			const pos = mapping.getMirror(--iRebased);
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line eqeqeq
			if (pos == null) {
				return;
			}
			newUntil = Math.min(newUntil, pos);
			const map = mapping.maps[pos];
			if (item.step) {
				const step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
				const selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
				if (selection) {
					eventCount++;
				}
				rebasedItems.push(new Item(map, step, selection));
			} else {
				rebasedItems.push(new Item(map));
			}
		}, start);

		const newMaps: Item[] = [];
		for (let i = rebasedCount; i < newUntil; i++) {
			newMaps.push(new Item(mapping.maps[i]));
		}
		const items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
		let branch = new Branch(items, eventCount);

		if (branch.emptyItemCount() > max_empty_items) {
			branch = branch.compress(this.items.length - rebasedItems.length);
		}
		return branch;
	}

	emptyItemCount() {
		let count = 0;
		this.items.forEach((item) => {
			if (!item.step) {
				count++;
			}
		});
		return count;
	}

	// Compressing a branch means rewriting it to push the air (map-only
	// items) out. During collaboration, these naturally accumulate
	// because each remote change adds one. The `upto` argument is used
	// to ensure that only the items below a given level are compressed,
	// because `rebased` relies on a clean, untouched set of items in
	// order to associate old items with rebased steps.
	compress(upto = this.items.length) {
		const remap = this.remapping(0, upto);
		let mapFrom = remap.maps.length;
		const items: Item[] = [];
		let events = 0;
		this.items.forEach(
			(item, i) => {
				if (i >= upto) {
					items.push(item);
					if (item.selection) {
						events++;
					}
				} else if (item.step) {
					const step = item.step.map(remap.slice(mapFrom)),
						map = step && step.getMap();
					mapFrom--;
					if (map) {
						remap.appendMap(map, mapFrom);
					}
					if (step) {
						const selection = item.selection && item.selection.map(remap.slice(mapFrom));
						if (selection) {
							events++;
						}
						// To match existing behaviour of prosemirror-history
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						const newItem = new Item(map!.invert(), step, selection);
						let merged;
						const last = items.length - 1;
						// To match existing behaviour of prosemirror-history
						// eslint-disable-next-line no-cond-assign
						if ((merged = items.length && items[last].merge(newItem))) {
							items[last] = merged;
						} else {
							items.push(newItem);
						}
					}
				} else if (item.map) {
					mapFrom--;
				}
			},
			this.items.length,
			0,
		);
		return new Branch(RopeSequence.from(items.reverse()), events);
	}

	static empty = new Branch(RopeSequence.empty, 0);
}

function cutOffEvents(items: RopeSequence<Item>, n: number) {
	let cutPoint: number | undefined;
	items.forEach((item, i) => {
		// To match existing behaviour of prosemirror-history
		// eslint-disable-next-line eqeqeq
		if (item.selection && n-- == 0) {
			cutPoint = i;
			return false;
		}
	});
	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return items.slice(cutPoint!);
}

class Item {
	constructor(
		// The (forward) step map for this item.
		readonly map: StepMap,
		// The inverted step
		readonly step?: Step,
		// If this is non-null, this item is the start of a group, and
		// this selection is the starting selection for the group (the one
		// that was active before the first step was applied)
		readonly selection?: SelectionBookmark,
		// If this item is the inverse of a previous mapping on the stack,
		// this points at the inverse's offset
		readonly mirrorOffset?: number,
	) {}

	merge(other: Item) {
		if (this.step && other.step && !other.selection) {
			const step = other.step.merge(this.step);
			if (step) {
				return new Item(step.getMap().invert(), step, this.selection);
			}
		}
	}
}

// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
class HistoryState {
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
		readonly selectionBookmark?: SelectionBookmark,
		/**
		 * FORK ADDITION END
		 * ===
		 */
	) {}
}

const DEPTH_OVERFLOW = 20;

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
	if (fg('platform_editor_ai_aifc_undo_redo')) {
		if (
			(tr.getMeta('startHistorySlice') === true || history?.historySliceActive) &&
			tr.getMeta('endHistorySlice') !== true
		) {
			if (tr.getMeta('addToHistory') === false) {
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
	const newHist =
		history.historySliceActive && fg('platform_editor_ai_aifc_undo_redo')
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

let cachedPreserveItems = false,
	cachedPreserveItemsPlugins: readonly Plugin[] | null = null;
// Check whether any plugin in the given state has a
// `historyPreserveItems` property in its spec, in which case we must
// preserve steps exactly as they came in, so that they can be
// rebased.
function mustPreserveItems(state: EditorState) {
	const plugins = state.plugins;
	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line eqeqeq
	if (cachedPreserveItemsPlugins != plugins) {
		cachedPreserveItems = false;
		cachedPreserveItemsPlugins = plugins;
		for (let i = 0; i < plugins.length; i++) {
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((plugins[i].spec as any).historyPreserveItems) {
				cachedPreserveItems = true;
				break;
			}
		}
	}
	return cachedPreserveItems;
}

/// Set a flag on the given transaction that will prevent further steps
/// from being appended to an existing history event (so that they
/// require a separate undo command to undo).
export function closeHistory(tr: Transaction) {
	return tr.setMeta(closeHistoryKey, true);
}

const historyKey = new PluginKey('history');
const closeHistoryKey = new PluginKey('closeHistory');

interface HistoryOptions {
	/// The amount of history events that are collected before the
	/// oldest events are discarded. Defaults to 100.
	depth?: number;

	/// The delay between changes after which a new group should be
	/// started. Defaults to 500 (milliseconds). Note that when changes
	/// aren't adjacent, a new group is always started.
	newGroupDelay?: number;
}

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

function buildCommand(redo: boolean, scroll: boolean): Command {
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

/// A command function that undoes the last change, if any.
export const undo = buildCommand(false, true);

/// A command function that redoes the last undone change, if any.
export const redo = buildCommand(true, true);

/// A command function that undoes the last change. Don't scroll the
/// selection into view.
export const undoNoScroll = buildCommand(false, false);

/// A command function that redoes the last undone change. Don't
/// scroll the selection into view.
export const redoNoScroll = buildCommand(true, false);

/// The amount of undoable events available in a given state.
export function undoDepth(state: EditorState) {
	const hist = historyKey.getState(state);
	return hist ? hist.done.eventCount : 0;
}

/// The amount of redoable events available in a given editor state.
export function redoDepth(state: EditorState) {
	const hist = historyKey.getState(state);
	return hist ? hist.undone.eventCount : 0;
}
