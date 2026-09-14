import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

/**
 * Determine which of the given marks exist anywhere in the transaction selection.
 */
export const anyMarksActiveFromTr = (
	tr: Transaction | ReadonlyTransaction,
	markTypes: readonly (Mark | MarkType)[],
): boolean[] => {
	const { $from, from, to, empty } = tr.selection;

	return markTypes.map((markType) => {
		if (empty) {
			return !!markType.isInSet(tr.storedMarks || $from.marks());
		}

		let rangeHasMark = false;
		if (tr.selection instanceof CellSelection) {
			tr.selection.forEachCell((cell, cellPos) => {
				const from = cellPos;
				const to = cellPos + cell.nodeSize;
				if (!rangeHasMark) {
					rangeHasMark = tr.doc.rangeHasMark(from, to, markType);
				}
			});
		} else {
			rangeHasMark = tr.doc.rangeHasMark(from, to, markType);
		}

		return rangeHasMark;
	});
};
