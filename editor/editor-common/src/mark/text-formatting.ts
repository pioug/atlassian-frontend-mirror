import type { Mark, MarkType, Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, SelectionRange } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

/**
 * Determine if a mark of a specific type exists anywhere in the selection.
 */
export const anyMarkActive = (state: EditorState, markType: Mark | MarkType): boolean => {
	const { $from, from, to, empty } = state.selection;
	if (empty) {
		return !!markType.isInSet(state.storedMarks || $from.marks());
	}

	let rangeHasMark = false;
	if (state.selection instanceof CellSelection) {
		state.selection.forEachCell((cell, cellPos) => {
			const from = cellPos;
			const to = cellPos + cell.nodeSize;
			if (!rangeHasMark) {
				rangeHasMark = state.doc.rangeHasMark(from, to, markType);
			}
		});
	} else {
		rangeHasMark = state.doc.rangeHasMark(from, to, markType);
	}

	return rangeHasMark;
};

export const isMarkAllowedInRange = (
	doc: Node,
	ranges: readonly SelectionRange[],
	type: MarkType,
): boolean => {
	for (let i = 0; i < ranges.length; i++) {
		const { $from, $to } = ranges[i];
		let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
		doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (can) {
				return false;
			}
			can = node.inlineContent && node.type.allowsMarkType(type);
			return;
		});
		if (can) {
			return can;
		}
	}
	return false;
};

export const isMarkExcluded = (type: MarkType, marks?: readonly Mark[] | null): boolean => {
	if (marks) {
		return marks.some((mark) => mark.type !== type && mark.type.excludes(type));
	}
	return false;
};
