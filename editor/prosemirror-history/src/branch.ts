import RopeSequence from 'rope-sequence';

import type {
	EditorState,
	SelectionBookmark,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Mapping } from '@atlaskit/editor-prosemirror/transform';
import type { StepMap, Transform } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

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
	): Branch {
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
	) {}

	merge(other: Item): Item | undefined {
		if (this.step && other.step && !other.selection) {
			const step = other.step.merge(this.step);
			if (step) {
				return new Item(step.getMap().invert(), step, this.selection);
			}
		}
	}
}
