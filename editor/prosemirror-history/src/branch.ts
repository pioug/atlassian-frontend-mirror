import RopeSequence from 'rope-sequence';

import type {
	EditorState,
	SelectionBookmark,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import type { Transform } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

import type {
	ExternalHistoryBlockedReason,
	ExternalHistoryPartition,
} from './external-history-event';
import type { HistoryOptions } from './types';

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

const DEPTH_OVERFLOW = 20;

/**
 * ===
 * FORK ADDITION START
 * Identity of the external (backend agent) event that an item belongs to: the editor instance that
 * owned the invocation, and the invocation itself.
 */
export type ExternalItemMetadata = {
	editorInstanceId: string;
	invocationId: string;
	/**
	 * Set by `compress` on the step-less marker it leaves in place of an item whose inverse could
	 * no longer be mapped. The event is incomplete from then on, so `popExternalEvent` refuses it
	 * with `required-step-unmappable` — the same answer it would have given before compression —
	 * instead of applying the surviving steps as if they were the whole event.
	 */
	unmappable?: true;
};

/**
 * The result of a promotion. The counts are reported before depth trimming and describe what the
 * builder actually produced, which a `Branch` returned on its own cannot answer: a receive whose
 * `transactionIndexes` all fall outside the transform appends only map-only items and creates no
 * event.
 */
export type ExternalPromotionResult = {
	branch: Branch;
	/** New events created: one per partition whose bookmark was actually built. */
	events: number;
	/** Partition indexes whose bookmark was actually built. */
	newEventPartitionIndexes: readonly number[];
	/** Appended items carrying external metadata. */
	promotedItems: number;
};

/**
 * The result of an all-or-nothing pop of an external event: either a fully applied transform with
 * the branch it leaves behind, or the reason the operation cannot happen at all. Nothing in between.
 */
export type ExternalPopResult =
	| {
			externalMetadata: ExternalItemMetadata;
			ok: true;
			remaining: Branch;
			selection: SelectionBookmark;
			transform: Transaction;
	  }
	| {
			externalMetadata: ExternalItemMetadata;
			ok: false;
			reason: ExternalHistoryBlockedReason;
	  };
/**
 * FORK ADDITION END
 * ===
 */

export class Branch {
	constructor(
		readonly items: RopeSequence<Item>,
		readonly eventCount: number,
	) {}

	// Pop the latest event off the branch's history and apply it
	// to a document transform.
	popEvent(
		state: EditorState,
		preserveItems: boolean,
	): {
		remaining: Branch;
		selection: SelectionBookmark;
		transform: Transaction;
	} | null {
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
		/**
		 * FORK ADDITION: set only when this transform is an external (backend agent) event being
		 * moved to the opposite branch by undo or redo, so the event keeps its batch identity
		 * there — which is what lets the opposite direction be preflighted, and what keeps
		 * `canMerge` refusing to fold the event's items into a neighbouring human event. Every
		 * other caller omits it, leaving the items byte-identical to upstream.
		 */
		externalMetadata?: ExternalItemMetadata,
	): Branch {
		const newItems: Item[] = [];
		let eventCount = this.eventCount;
		let oldItems = this.items,
			lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;

		for (let i = 0; i < transform.steps.length; i++) {
			const step = transform.steps[i].invert(transform.docs[i]);
			let item = new Item(transform.mapping.maps[i], step, selection, undefined, externalMetadata),
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

	addMaps(array: readonly StepMap[]): Branch {
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
	rebased(rebasedTransform: Transform, rebasedCount: number): Branch {
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

		const neutered = incompleteExternalEvents(this.items, start, rebasedCount, mapping);
		const lower = neuterLowerItems(this.items, start, neutered);
		eventCount -= lower.removedBookmarks;
		let iRebased = rebasedCount;
		this.items.forEach((item, index) => {
			const pos = mapping.getMirror(--iRebased);
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line eqeqeq
			if (pos == null) {
				return;
			}
			newUntil = Math.min(newUntil, pos);
			const map = mapping.maps[pos];
			if (neutered.has(index)) {
				// FORK ADDITION: another item of this external event was dropped by collaboration.
				rebasedItems.push(new Item(map));
			} else if (item.step) {
				const step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
				const selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
				if (selection) {
					eventCount++;
				}
				// FORK ADDITION: external metadata must survive rebasing.
				rebasedItems.push(new Item(map, step, selection, undefined, item.externalMetadata));
			} else {
				// FORK ADDITION: metadata survives; so does the bookmark of an unmappable marker.
				const selection = markerSelection(item, mapping.slice(iRebased + 1, pos));
				if (selection) {
					eventCount++;
				}
				rebasedItems.push(new Item(map, undefined, selection, undefined, item.externalMetadata));
			}
		}, start);

		const newMaps: Item[] = [];
		for (let i = rebasedCount; i < newUntil; i++) {
			newMaps.push(new Item(mapping.maps[i]));
		}
		const items = lower.items.append(newMaps).append(rebasedItems);
		let branch = new Branch(items, eventCount);

		if (branch.emptyItemCount() > max_empty_items) {
			branch = branch.compress(this.items.length - rebasedItems.length);
		}
		return branch;
	}

	/**
	 * ===
	 * FORK ADDITION START
	 * Promotion of external (backend agent) batches into ordinary undoable history events.
	 *
	 * These operations deliberately do not reuse `addMaps` (which returns `this` when
	 * `eventCount` is 0, silently discarding the first agent batch on a fresh editor) or
	 * `rebased` (which returns `this` for the same reason). They build items from the received
	 * transform instead, so an empty branch still accepts a promotion.
	 *
	 * `preserveItems` is not a parameter: promotion always creates exactly one item per transform
	 * map, and none of these methods merges into a pre-existing item, so the flag has nothing to
	 * suppress. The one exception is the `compress` call in `rebaseWithExternalEvents`, which
	 * merges regardless of `preserveItems` exactly as upstream `rebased` does; `canMerge` confines
	 * that merging to items of the same external event, so it can never join an agent item to a
	 * human one.
	 */

	/**
	 * All-or-nothing pop of the newest event, when that event was promoted from an external
	 * (backend agent) batch.
	 *
	 * `popEvent` applies its steps to the transform as it walks, and any step it cannot map or
	 * apply is simply skipped — so an event whose target a collaborator has since edited away is
	 * popped anyway, with part of it applied or none of it. For an agent's edit that is worse than
	 * refusing outright: the event leaves the branch and can never be undone again. Worse still,
	 * a step whose inverse would produce content the schema rejects does not even fail cleanly;
	 * `maybeStep` throws out of the whole command (see `applyPreflightStep`).
	 *
	 * This runs the same walk but abandons it at the first problem, and it cannot partially apply
	 * because nothing is committed until the walk has finished: `Branch` and `Item` are immutable
	 * and `RopeSequence.slice`/`append` copy, the `Mapping` is built locally per call, and the
	 * transform is a fresh `state.tr` that the caller only dispatches on `ok: true`. A failing
	 * `maybeStep` also leaves its own transform unmodified, so an abandoned transform is never
	 * half-applied and the caller has nothing to roll back.
	 *
	 * Returns `null` when there is nothing to pop, or when the newest event is not external — the
	 * caller's signal to use the inherited `popEvent`. Ordinary human undo is unaffected, and does
	 * not pay for any of the checks here.
	 */
	popExternalEvent(state: EditorState, preserveItems: boolean): ExternalPopResult | null {
		if (this.eventCount === 0) {
			return null;
		}

		// Deliberately bounded, unlike `popEvent`'s `for (;; end--)`: this also runs for branches
		// whose `eventCount` a direct caller may have got wrong, and walking off the start throws.
		let end = this.items.length;
		for (; end > 0; end--) {
			if (this.items.get(end - 1).selection) {
				break;
			}
		}
		if (end === 0) {
			return null;
		}
		end -= 1;

		const eventMetadata = this.items.get(end).externalMetadata;
		if (!eventMetadata) {
			return null;
		}

		// A promoted event is uniform by construction: every item it was built from carries the
		// same editorInstanceId and invocationId. Items carrying no metadata at all are legitimate
		// and must not be refused — an appended human step joins the event without a bookmark of
		// its own. Only a genuine identity conflict is refused, because the outcome metadata names
		// one batch identity and would otherwise be naming it for an event assembled out of two.
		let inconsistent = false;
		this.items.forEach((item) => {
			const metadata = item.externalMetadata;
			if (
				metadata &&
				(metadata.editorInstanceId !== eventMetadata.editorInstanceId ||
					metadata.invocationId !== eventMetadata.invocationId)
			) {
				inconsistent = true;
				// One conflicting item is enough; stop scanning the rest of the branch.
				return false;
			}
		}, end);
		if (inconsistent) {
			return { ok: false, externalMetadata: eventMetadata, reason: 'inconsistent-metadata' };
		}

		let remap: Mapping | undefined, mapFrom: number | undefined;
		if (preserveItems) {
			remap = this.remapping(end, this.items.length);
			mapFrom = remap.maps.length;
		}
		const transform = state.tr;
		let selection: SelectionBookmark | undefined, remaining: Branch | undefined;
		let reason: ExternalHistoryBlockedReason | undefined;
		const addAfter: Item[] = [],
			addBefore: Item[] = [];

		this.items.forEach(
			(item, i) => {
				if (item.externalMetadata?.unmappable) {
					// `compress` replaced one of this event's steps with a marker, because the step
					// could no longer be mapped. The event cannot be applied in full.
					reason = 'required-step-unmappable';
					return false;
				}
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
					if (!step) {
						reason = 'required-step-unmappable';
						return false;
					}
					if (!applyPreflightStep(transform, step)) {
						reason = 'mapped-step-failed';
						return false;
					}
					const map = transform.mapping.maps[transform.mapping.maps.length - 1];
					addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length));
					// To match existing behaviour of prosemirror-history
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					mapFrom!--;
					remap.appendMap(map, mapFrom);
				} else if (!applyPreflightStep(transform, item.step)) {
					reason = 'mapped-step-failed';
					return false;
				}

				if (item.selection) {
					try {
						selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
					} catch (error) {
						reason = 'selection-unresolvable';
						return false;
					}
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

		if (reason) {
			return { ok: false, externalMetadata: eventMetadata, reason };
		}
		if (!remaining || !selection) {
			// Only reachable when the bookmark-bearing item at `end` carries no step and is not an
			// unmappable marker, which nothing in this package produces — `addTransform` and
			// `buildExternalItems` both put a bookmark on a step-bearing item. The walk would then
			// have run past this event and started undoing the one below it, so refusing is the
			// only safe answer.
			return { ok: false, externalMetadata: eventMetadata, reason: 'inconsistent-metadata' };
		}

		// The caller resolves this bookmark against the same document to build the new selection,
		// and `SelectionBookmark.resolve` throws a RangeError for a position past the end of the
		// document. Doing it here means such a failure blocks the operation instead of escaping
		// `histTransaction` and taking the command with it.
		try {
			selection.resolve(transform.doc);
		} catch (error) {
			return { ok: false, externalMetadata: eventMetadata, reason: 'selection-unresolvable' };
		}

		return { ok: true, externalMetadata: eventMetadata, remaining, selection, transform };
	}

	/**
	 * Removes the newest event when it is an external (backend agent) event, keeping its maps so
	 * every older item still remaps correctly.
	 *
	 * `popExternalEvent` refuses an event that can no longer be applied in full, for example when a
	 * collaborator has deleted the content the agent wrote. A refused event stays on top of the
	 * branch, so every later undo is refused too and nothing beneath it can ever be reached. The
	 * event can only get harder to apply as the document moves on, so the caller drops it instead:
	 * its items become map-only, the event count falls by one, and the next event is undoable.
	 *
	 * Returns `null` when the newest event is not external, so ordinary human events are never
	 * discarded this way.
	 */
	discardExternalEvent(): Branch | null {
		if (this.eventCount === 0) {
			return null;
		}
		let end = this.items.length;
		for (; end > 0; end--) {
			if (this.items.get(end - 1).selection) {
				break;
			}
		}
		if (end === 0) {
			return null;
		}
		end -= 1;
		if (!this.items.get(end).externalMetadata) {
			return null;
		}
		const mapOnly: Item[] = [];
		this.items.forEach((item) => {
			// Keep the map-pair offset: a forward/inverse pair left by undoing a newer human event
			// has to stay linked, or older steps would map through both changes independently.
			mapOnly.push(new Item(item.map, undefined, undefined, item.mirrorOffset));
		}, end);
		return new Branch(
			this.items.slice(0, end).append(RopeSequence.from(mapOnly)),
			this.eventCount - 1,
		);
	}

	/**
	 * Direct route: every transform map becomes one item, and the maps selected by `partitions`
	 * additionally carry their inverse step and external metadata. The oldest selected map of each
	 * partition carries the pre-transaction selection bookmark and starts a new event.
	 */
	addDirectExternalEvents(
		transform: Transform,
		partitions: readonly ExternalHistoryPartition[],
		selection: SelectionBookmark,
		editorInstanceId: string,
		histOptions: Required<HistoryOptions>,
	): ExternalPromotionResult {
		const plan = planExternalItems(partitions, editorInstanceId);
		const promoted = buildExternalItems(transform, plan, selection, 0, transform.steps.length);

		// Trim the assembled branch, not just the old items: one receive can create many events, so
		// the overflow can exceed the number of events already on the branch.
		const trimmed = trimToDepth(
			this.items.append(promoted.items),
			this.eventCount + promoted.events,
			histOptions.depth,
		);
		// Counts are reported before depth trimming.
		return {
			branch: new Branch(trimmed.items, trimmed.eventCount),
			events: promoted.events,
			newEventPartitionIndexes: promoted.newEventPartitionIndexes,
			promotedItems: promoted.promotedItems,
		};
	}

	/**
	 * Rebased route: the transform inverts the unconfirmed local steps, applies the remote steps,
	 * then reapplies the remapped local steps. `remoteTransformRange` is the authoritative
	 * half-open interval of remote maps — it is taken from the transaction metadata rather than
	 * derived from mirror lookups, which find nothing when the branch is empty.
	 *
	 * Ordering is deliberate: the promoted agent event ends up *beneath* the remapped unconfirmed
	 * local items, so when the user types while a batch lands the first undo removes the typing and
	 * the second removes the whole batch. That mirrors the document (the server orders the batch
	 * first and the local steps are rebased over it), so every inverse step stays in the frame it
	 * will be applied to. Putting the batch on top would mean mapping each agent step through the
	 * local steps and rebuilding frames, which can fail and can drift from the real document.
	 */
	rebaseWithExternalEvents(
		rebasedTransform: Transform,
		rebasedCount: number,
		partitions: readonly ExternalHistoryPartition[],
		remoteTransformRange: { from: number; to: number },
		selection: SelectionBookmark,
		editorInstanceId: string,
		histOptions: Required<HistoryOptions>,
	): ExternalPromotionResult {
		const start = Math.max(0, this.items.length - rebasedCount);
		const mapping = rebasedTransform.mapping;
		let eventCount = this.eventCount;

		// Items from `start` upwards are replaced by their remapped equivalents.
		this.items.forEach((item) => {
			if (item.selection) {
				eventCount--;
			}
		}, start);

		// Rebuild those items, keyed by their position in the rebasing transform.
		const remapped = new Map<number, Item>();
		const neutered = incompleteExternalEvents(this.items, start, rebasedCount, mapping);
		const lower = neuterLowerItems(this.items, start, neutered);
		eventCount -= lower.removedBookmarks;
		let iRebased = rebasedCount;
		this.items.forEach((item, index) => {
			const pos = mapping.getMirror(--iRebased);
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line eqeqeq
			if (pos == null) {
				return;
			}
			const map = mapping.maps[pos];
			if (neutered.has(index)) {
				// Another item of this external event was dropped by collaboration, so the event can
				// no longer be undone in full. Keep only the map so older items still remap.
				remapped.set(pos, new Item(map));
			} else if (item.step) {
				const step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
				const itemSelection =
					item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
				remapped.set(pos, new Item(map, step, itemSelection, undefined, item.externalMetadata));
			} else {
				const itemSelection = markerSelection(item, mapping.slice(iRebased + 1, pos));
				remapped.set(
					pos,
					new Item(map, undefined, itemSelection, undefined, item.externalMetadata),
				);
			}
		}, start);

		// Count the recovered events from the surviving items rather than from the loop above. Only
		// entries at or above `remoteTransformRange.to` are put back into the branch by the `above`
		// loop, and a `pos` collision silently discards the earlier entry. Counting per increment
		// would overcount in both cases, leaving `eventCount` greater than the number of
		// bookmark-bearing items — and `popEvent`'s backward scan for a bookmark has no lower
		// bound, so it would run off the start of the branch and throw.
		remapped.forEach((item, pos) => {
			if (item.selection && pos >= remoteTransformRange.to) {
				eventCount++;
			}
		});

		const promoted = buildExternalItems(
			rebasedTransform,
			planExternalItems(partitions, editorInstanceId),
			selection,
			remoteTransformRange.from,
			remoteTransformRange.to,
		);
		eventCount += promoted.events;

		// Everything above the remote run: the remapped local item where one exists, otherwise a
		// map-only item, so that no document change above the promoted event is missing from the
		// branch. Upstream `rebased` can drop these, which is only safe because it assumes the top
		// `rebasedCount` items are exactly the unconfirmed local steps.
		const above: Item[] = [];
		for (let pos = remoteTransformRange.to; pos < rebasedTransform.steps.length; pos++) {
			const item = remapped.get(pos);
			above.push(item ? item : new Item(mapping.maps[pos]));
		}

		// Trim the assembled branch: the overflow can exceed the events beneath the replaced suffix.
		const trimmed = trimToDepth(
			lower.items.append(promoted.items).append(above),
			eventCount,
			histOptions.depth,
		);
		const aboveLength = Math.min(above.length, trimmed.items.length);
		let branch = new Branch(trimmed.items, trimmed.eventCount);
		if (branch.emptyItemCount() > max_empty_items) {
			// Deliberately different from upstream `rebased`, which passes
			// `this.items.length - rebasedItems.length` and so leaves both its new map-only items
			// and its rebased items untouched. Here only `above` — the items a subsequent
			// `rebased` call needs to find unmodified in order to associate them with mirror
			// positions — is kept verbatim; the promoted items below it may be compressed. That is
			// frame-safe: for the topmost compressed item `mapFrom` is still `upto`, so its step is
			// left unmapped and its new map is `step.getMap().invert()`, which preserves the
			// document frame at `upto` exactly.
			branch = branch.compress(branch.items.length - aboveLength);
		}
		return {
			branch,
			events: promoted.events,
			newEventPartitionIndexes: promoted.newEventPartitionIndexes,
			promotedItems: promoted.promotedItems,
		};
	}
	/**
	 * FORK ADDITION END
	 * ===
	 */

	emptyItemCount(): number {
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
	compress(upto: number = this.items.length): Branch {
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
					if (!step && item.externalMetadata) {
						// FORK ADDITION: upstream simply forgets a step that a later change has made
						// unmappable. For an external event that would shrink the event to whatever
						// still maps, and an undo that `popExternalEvent` refused a moment ago would
						// then be applied in part. Leave a step-less marker so the event stays
						// recognisably incomplete, keeping its bookmark so the event boundary below
						// is not lost.
						const selection = item.selection && item.selection.map(remap.slice(mapFrom));
						if (selection) {
							events++;
						}
						items.push(unmappableMarker(item.externalMetadata, selection));
					}
					if (step) {
						const selection = item.selection && item.selection.map(remap.slice(mapFrom));
						if (selection) {
							events++;
						}
						const newItem = new Item(
							// To match existing behaviour of prosemirror-history
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							map!.invert(),
							step,
							selection,
							undefined,
							// FORK ADDITION: external metadata must survive compression.
							item.externalMetadata,
						);
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
				} else if (item.externalMetadata?.unmappable) {
					// FORK ADDITION: a marker from an earlier compression is kept, not pushed out as
					// air, or the next compression would lose the event boundary it protects.
					mapFrom--;
					const selection = item.selection && item.selection.map(remap.slice(mapFrom));
					if (selection) {
						events++;
					}
					items.push(unmappableMarker(item.externalMetadata, selection));
				} else if (item.map) {
					mapFrom--;
				}
			},
			this.items.length,
			0,
		);
		return new Branch(RopeSequence.from(items.reverse()), events);
	}

	static empty: Branch = new Branch(RopeSequence.empty, 0);
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

/**
 * FORK ADDITION: drops the oldest events once `eventCount` exceeds `depth` by more than the fork's
 * slack, working on the fully assembled items and recounting the events actually removed. Upstream
 * subtracts the overflow from the count even when the cut finds nothing to remove, which leaves the
 * count below the number of bookmarks. A receive that promotes many events makes that reachable.
 */
function trimToDepth(
	items: RopeSequence<Item>,
	eventCount: number,
	depth: number,
): { eventCount: number; items: RopeSequence<Item> } {
	const overflow = eventCount - depth;
	if (overflow <= DEPTH_OVERFLOW) {
		return { items, eventCount };
	}
	let cutPoint: number | undefined;
	let seen = 0;
	items.forEach((item, i) => {
		if (item.selection) {
			if (seen === overflow) {
				cutPoint = i;
				return false;
			}
			seen++;
		}
	});
	if (cutPoint === undefined) {
		return { items, eventCount };
	}
	let removed = 0;
	items.forEach(
		(item) => {
			if (item.selection) {
				removed++;
			}
		},
		0,
		cutPoint,
	);
	return { items: items.slice(cutPoint), eventCount: eventCount - removed };
}

/**
 * ===
 * FORK ADDITION START
 */

/**
 * Applies one already-mapped step to the preflight transform, reporting whether it took.
 *
 * `Transform.maybeStep` signals an inapplicable step in two different ways. It returns a failed
 * `StepResult` for a structural mismatch (for example "Inserted content deeper than insertion
 * position"), but for anything that trips a schema content or mark check it **throws**: only
 * `ReplaceError` is caught by `StepResult.fromReplace`, while `NodeType.checkContent` raises a plain
 * `RangeError`. That is not a hypothetical — restoring a table into a `blockquote`, or an inline
 * extension into a `codeBlock`, throws `RangeError: Invalid content for node …` out of `popEvent`,
 * out of `histTransaction` and out of the undo command itself.
 *
 * Either way `maybeStep` leaves the transform unmodified when the step does not apply, so returning
 * `false` abandons the transform cleanly with nothing to undo.
 */
function applyPreflightStep(transform: Transaction, step: Step): boolean {
	try {
		return Boolean(transform.maybeStep(step).doc);
	} catch (error) {
		return false;
	}
}

type ExternalItemPlan = {
	// Transform index of the oldest selected map of each partition, which starts that event.
	bookmarks: Set<number>;
	// Transform index -> metadata, for every map that must carry an inverse step.
	selected: Map<number, { metadata: ExternalItemMetadata; partitionIndex: number }>;
};

function planExternalItems(
	partitions: readonly ExternalHistoryPartition[],
	editorInstanceId: string,
): ExternalItemPlan {
	const bookmarks = new Set<number>();
	const selected = new Map<number, { metadata: ExternalItemMetadata; partitionIndex: number }>();

	partitions.forEach((partition, index) => {
		// A partition with no indexes promotes nothing and has no oldest index to bookmark.
		// `history.ts` filters these out before promotion, so this is only reachable by calling a
		// `Branch` method directly.
		if (partition.transactionIndexes.length === 0) {
			return;
		}
		const metadata: ExternalItemMetadata = {
			editorInstanceId,
			invocationId: partition.invocationId,
		};
		for (const transformIndex of partition.transactionIndexes) {
			selected.set(transformIndex, { metadata, partitionIndex: index });
		}
		// Not `Math.min(...indexes)`: spreading a very large catch-up batch can overflow the stack.
		let first = partition.transactionIndexes[0];
		for (const transformIndex of partition.transactionIndexes) {
			if (transformIndex < first) {
				first = transformIndex;
			}
		}
		bookmarks.add(first);
	});

	return { bookmarks, selected };
}

/**
 * One item per transform map in `[from, to)`. Selected maps also carry their inverse step and
 * external metadata; the oldest selected map of each new event carries the selection bookmark.
 *
 * A bookmark records the selection as it was below its own item, so the pre-transaction bookmark is
 * mapped forward through the maps preceding the event. Without that, an event that does not start
 * at transform index 0 restores a position from a document that no longer exists once the event has
 * been undone, and `popEvent` throws while resolving it.
 */
function buildExternalItems(
	transform: Transform,
	plan: ExternalItemPlan,
	selection: SelectionBookmark,
	from: number,
	to: number,
): {
	events: number;
	items: Item[];
	newEventPartitionIndexes: readonly number[];
	promotedItems: number;
} {
	const items: Item[] = [];
	let events = 0;
	let promotedItems = 0;
	const newEventPartitionIndexes = new Set<number>();
	// `from`/`to` come from transaction metadata, so a producer regression could point past the end
	// of the transform. Clamping makes such a batch simply not promote at the out-of-range indexes;
	// without it, `transform.steps[i].invert(...)` throws inside `EditorState.apply` and takes down
	// the whole transaction rather than just declining to promote. An index that is dropped this
	// way contributes neither an item nor an event, which keeps `eventCount === bookmarkCount`.
	const start = Math.max(0, from);
	const end = Math.min(to, transform.steps.length);
	for (let i = start; i < end; i++) {
		const planned = plan.selected.get(i);
		if (!planned) {
			items.push(new Item(transform.mapping.maps[i]));
			continue;
		}
		const startsEvent = plan.bookmarks.has(i);
		items.push(
			new Item(
				transform.mapping.maps[i],
				transform.steps[i].invert(transform.docs[i]),
				startsEvent ? selection.map(transform.mapping.slice(0, i)) : undefined,
				undefined,
				planned.metadata,
			),
		);
		promotedItems++;
		if (startsEvent) {
			newEventPartitionIndexes.add(planned.partitionIndex);
			events++;
		}
	}
	return {
		newEventPartitionIndexes: [...newEventPartitionIndexes],
		events,
		items,
		promotedItems,
	};
}

/**
 * FORK ADDITION END
 * ===
 */

class Item {
	constructor(
		// The (forward) step map for this item.
		readonly map: StepMap,
		// The inverted step
		readonly step?: Step | undefined,
		// If this is non-null, this item is the start of a group, and
		// this selection is the starting selection for the group (the one
		// that was active before the first step was applied)
		readonly selection?: SelectionBookmark | undefined,
		// If this item is the inverse of a previous mapping on the stack,
		// this points at the inverse's offset
		readonly mirrorOffset?: number,
		/**
		 * ===
		 * FORK ADDITION START
		 * Set when this item was promoted from an external (backend agent) batch.
		 * FORK ADDITION END
		 * ===
		 */
		readonly externalMetadata?: ExternalItemMetadata | undefined,
	) {}

	merge(other: Item): Item | undefined {
		if (this.step && other.step && !other.selection && canMerge(this, other)) {
			const step = other.step.merge(this.step);
			if (step) {
				return new Item(
					step.getMap().invert(),
					step,
					this.selection,
					undefined,
					this.externalMetadata,
				);
			}
		}
	}
}

/**
 * ===
 * FORK ADDITION START
 * The step-less item `compress` leaves in place of an external step it could not map. Its map is
 * the identity: the lost step's own map has already been folded into the items below it.
 */
function unmappableMarker(
	metadata: ExternalItemMetadata,
	selection: SelectionBookmark | undefined,
): Item {
	return new Item(StepMap.empty, undefined, selection, undefined, {
		editorInstanceId: metadata.editorInstanceId,
		invocationId: metadata.invocationId,
		unmappable: true,
	});
}

/**
 * FORK ADDITION: collaboration drops an unconfirmed step it cannot remap, which leaves no mirror
 * for that item. For an ordinary event that only loses one step. An external event is undone as a
 * unit, so a surviving sibling would either fall into the event beneath (when the dropped item
 * carried the bookmark) or undo only part of the agent's change. This returns the indexes of every
 * item belonging to an external event that lost at least one item, so the caller keeps only their
 * maps. Reachable after redoing a multi-step agent event, whose redo steps are unconfirmed.
 */
function incompleteExternalEvents(
	items: RopeSequence<Item>,
	start: number,
	rebasedCount: number,
	mapping: Mapping,
): Set<number> {
	const neutered = new Set<number>();
	let members: number[] = [];
	let metadata: ExternalItemMetadata | undefined;
	let broken = false;
	const flush = () => {
		if (broken) {
			members.forEach((index) => neutered.add(index));
		}
		members = [];
		broken = false;
	};
	// An event can straddle `start`: its bookmark already confirmed, its upper items not. Collect the
	// confirmed part too, so losing an unconfirmed item neuters the whole event.
	const first = start < items.length ? items.get(start) : undefined;
	if (first && first.externalMetadata && !first.selection) {
		const firstMetadata = first.externalMetadata;
		let bookmarkIndex = start - 1;
		for (; bookmarkIndex >= 0; bookmarkIndex--) {
			const lowerItem = items.get(bookmarkIndex);
			const own = lowerItem.externalMetadata;
			if (
				!own ||
				own.editorInstanceId !== firstMetadata.editorInstanceId ||
				own.invocationId !== firstMetadata.invocationId
			) {
				bookmarkIndex = -1;
				break;
			}
			if (lowerItem.selection) {
				break;
			}
		}
		if (bookmarkIndex >= 0) {
			metadata = firstMetadata;
			for (let index = bookmarkIndex; index < start; index++) {
				members.push(index);
			}
		}
	}
	let iRebased = rebasedCount;
	items.forEach((item, index) => {
		if (item.selection) {
			flush();
			metadata = item.externalMetadata;
		}
		const pos = mapping.getMirror(--iRebased);
		const own = item.externalMetadata;
		if (
			metadata &&
			own &&
			own.editorInstanceId === metadata.editorInstanceId &&
			own.invocationId === metadata.invocationId
		) {
			members.push(index);
			if (pos === undefined) {
				broken = true;
			}
		}
	}, start);
	flush();
	return neutered;
}

/**
 * FORK ADDITION: the items below `start` that rebasing leaves in place, except that any belonging to
 * a neutered event (see `incompleteExternalEvents`) keep only their map. Reports how many bookmarks
 * that removed so the caller can correct `eventCount`.
 */
function neuterLowerItems(
	items: RopeSequence<Item>,
	start: number,
	neutered: ReadonlySet<number>,
): { items: RopeSequence<Item>; removedBookmarks: number } {
	let touched = false;
	neutered.forEach((index) => {
		if (index < start) {
			touched = true;
		}
	});
	if (!touched) {
		return { items: items.slice(0, start), removedBookmarks: 0 };
	}
	let removedBookmarks = 0;
	const lower: Item[] = [];
	items.forEach(
		(item, index) => {
			if (neutered.has(index)) {
				if (item.selection) {
					removedBookmarks++;
				}
				lower.push(new Item(item.map, undefined, undefined, item.mirrorOffset));
			} else {
				lower.push(item);
			}
		},
		0,
		start,
	);
	return { items: RopeSequence.from(lower), removedBookmarks };
}

/** The bookmark of an unmappable marker, mapped; ordinary map-only items carry none. */
function markerSelection(item: Item, mapping: Mapping): SelectionBookmark | undefined {
	return item.externalMetadata?.unmappable && item.selection
		? item.selection.map(mapping)
		: undefined;
}

/**
 * Merging across an external-event boundary would make one undo revert both the agent's change and
 * a human change, so it is refused unless both sides belong to the same external event (same editor
 * instance and invocation), or neither does.
 */
function canMerge(item: Item, other: Item): boolean {
	const a = item.externalMetadata,
		b = other.externalMetadata;
	if (!a && !b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	return a.editorInstanceId === b.editorInstanceId && a.invocationId === b.invocationId;
}
/**
 * FORK ADDITION END
 * ===
 */
