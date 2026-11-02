import type { MarkType, Node } from '@atlaskit/editor-prosemirror/model';
import type { CellSelection } from '@atlaskit/editor-tables/cell-selection';

/** Check selected cells locally and stop as soon as any requested mark is found. */
export const cellSelectionHasAnyMark = (
	selection: CellSelection,
	markTypes: ReadonlyArray<MarkType>,
): boolean => {
	if (markTypes.length === 0) {
		return false;
	}

	const nodeHasAnyMark = (node: Node): boolean => {
		if (markTypes.some((markType) => !!markType.isInSet(node.marks))) {
			return true;
		}

		for (let index = 0; index < node.childCount; index++) {
			if (nodeHasAnyMark(node.child(index))) {
				return true;
			}
		}

		return false;
	};

	// CellSelection already has one resolved range per selected cell, including merged cells.
	// Reuse those nodes instead of rebuilding the table rectangle and resolving each cell again.
	return selection.ranges.some(({ $from }) => nodeHasAnyMark($from.parent));
};
