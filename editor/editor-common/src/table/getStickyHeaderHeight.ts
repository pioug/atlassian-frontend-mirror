import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Returns the outermost table's sticky header height for `targetPos` when it is eligible to be
 * sticky. Table headers at least half the viewport high intentionally do not become sticky.
 */
export function getStickyHeaderHeight(view: EditorView, targetPos: number): number | undefined {
	const closestTable = findParentNodeOfTypeClosestToPos(
		view.state.doc.resolve(targetPos),
		view.state.schema.nodes.table,
	);
	if (!closestTable) {
		return undefined;
	}

	const outermostTable =
		findParentNodeOfTypeClosestToPos(
			view.state.doc.resolve(closestTable.pos),
			view.state.schema.nodes.table,
		) ?? closestTable;

	const firstRow = outermostTable.node.firstChild;
	let isHeaderRow = Boolean(firstRow && firstRow.childCount > 0);
	firstRow?.forEach((cell) => {
		isHeaderRow &&= cell.type === view.state.schema.nodes.tableHeader;
	});
	if (!isHeaderRow) {
		return undefined;
	}

	const firstRowDom = view.nodeDOM(outermostTable.pos + 1);
	if (!(firstRowDom instanceof HTMLTableRowElement)) {
		return undefined;
	}

	const headerRow = firstRowDom;
	const height = headerRow.getBoundingClientRect().height;
	return height > 0 && height <= window.innerHeight / 2 ? height : undefined;
}
