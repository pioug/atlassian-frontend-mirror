import type { Change } from 'prosemirror-changeset';

/**
 * Groups adjacent changes to reduce visual fragmentation in diffs.
 * Merges consecutive insertions and deletions that are close together.
 */
export function optimizeChanges(changes: Change[]): Change[] {
	if (changes.length <= 1) {
		return changes;
	}

	const optimized: Change[] = [];
	let current = { ...changes[0] };

	for (let i = 1; i < changes.length; i++) {
		const next = changes[i];

		// Check if changes are adjacent or very close (within 2 positions)
		const isAdjacent = next.fromB <= current.toB + 2;

		if (isAdjacent) {
			current = {
				fromA: current.fromA,
				toA: Math.max(current.toA, next.toA),
				fromB: current.fromB,
				toB: Math.max(current.toB, next.toB),
				deleted: [...current.deleted, ...next.deleted],
				inserted: [...current.inserted, ...next.inserted],
			};
		} else {
			optimized.push(current);
			current = { ...next };
		}
	}

	optimized.push(current);
	return optimized;
}
