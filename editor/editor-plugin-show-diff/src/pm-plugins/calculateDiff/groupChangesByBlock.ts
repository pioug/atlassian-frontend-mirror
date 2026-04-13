import type { Change } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Finds the position range of the top-level block (direct child of doc) that contains `pos`.
 * Returns null if `pos` is at the doc boundary or outside the doc content.
 */
function getTopLevelBlockAt(doc: PMNode, from: number, to: number): { from: number; to: number } {
	return {
		from: doc.resolve(from).before(1),
		to: doc.resolve(to).after(1),
	};
}

/**
 * Groups all changes that fall within the same top-level block (direct child of doc)
 * and merges them into a single change spanning the full block in both old and new doc.
 */
export function groupChangesByBlock(
	changes: readonly Change[],
	docA: PMNode,
	docB: PMNode,
): Change[] {
	type Group = {
		changed: Change['deleted'] | Change['inserted'];
		fromA: number;
		fromB: number;
		toA: number;
		toB: number;
	};

	const groups = new Map<number, Group>();

	for (const change of changes) {
		const blockA = getTopLevelBlockAt(docA, change.fromA, change.toA);
		const blockB = getTopLevelBlockAt(docB, change.fromB, change.toB);

		if (!groups.has(blockB.from)) {
			groups.set(blockB.from, {
				fromB: blockB.from,
				toB: blockB.to,
				fromA: blockA ? blockA.from : change.fromA,
				toA: blockA ? blockA.to : change.toA,
				changed: [],
			});
		}

		const group = groups.get(blockB.from);
		if (group) {
			group.changed = [...group.changed, ...change.inserted, ...change.deleted];
		}
	}

	return Array.from(groups.values())
		.sort((a, b) => a.fromB - b.fromB)
		.map(({ fromA, toA, fromB, toB, changed }) => ({
			fromA,
			toA,
			fromB,
			toB,
			/**
			 * We add all changes (both deleted and inserted) as that will
			 * inform the calculateDiffDecorations function that changes should be rendered
			 * (even if the change is only one of the two).
			 */
			deleted: changed,
			inserted: changed,
		}));
}
