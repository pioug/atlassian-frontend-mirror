import type { Node } from '@atlaskit/editor-prosemirror/model';

// Helper for iterating through the nodes in a document that changed
// compared to the given previous document. Useful for avoiding
// duplicate work on each transaction.
export function changedDescendants(
	old: Node,
	cur: Node,
	offsetStart: number,
	f: (child: Node, offset: number) => void,
): void {
	let offset = offsetStart;
	const oldSize = old.childCount;
	const curSize = cur.childCount;
	// eslint-disable-next-line no-labels
	outer: for (let i = 0, j = 0; i < curSize; i++) {
		const child = cur.child(i);
		for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
			if (old.child(scan) === child) {
				j = scan + 1;
				offset += child.nodeSize;
				// eslint-disable-next-line no-continue, no-labels
				continue outer;
			}
		}
		f(child, offset);
		if (j < oldSize && old.child(j).sameMarkup(child)) {
			changedDescendants(old.child(j), child, offset + 1, f);
		} else {
			child.nodesBetween(0, child.content.size, f, offset + 1);
		}
		offset += child.nodeSize;
	}
}
