import { Mark, type MarkType, type Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, SelectionRange } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

type MarkMap = Map<Mark | MarkType, boolean>;

const allMarksAreRuledOut = (marks: MarkMap): boolean =>
	Array.from(marks.values()).every((mark) => !mark);

/**
 * Check if a selection contains any of the specifiged marks. The whole selection
 * must have the mark for it to be considered active.
 * @param state The editor state
 * @param markTypes The marks to check for
 * @returns A map indicating which marks are present in the selection
 * @example
 * const markTypes = editorState.schema.marks;
 * const activeMarks = wholeSelectionHasMarks(editorState, [markTypes.strong, markTypes.em, markTypes.etc]);
 */
export const wholeSelectionHasMarks = (
	state: EditorState,
	markTypes: (MarkType | Mark)[],
): MarkMap => {
	const { $from, from, to, empty } = state.selection;

	if (empty) {
		return new Map(
			markTypes.map((markType) => [
				markType,
				!!markType.isInSet(state.storedMarks || $from.marks()),
			]),
		);
	}

	if (state.selection instanceof CellSelection) {
		return cellSelectionHasMarks(state.doc, state.selection, markTypes);
	}

	return wholeRangeHasMarks(from, to, state.doc, markTypes);
};

const cellSelectionHasMarks = (
	doc: Node,
	selection: CellSelection,
	markTypes: (Mark | MarkType)[],
) => {
	// Warning: This is micro-optimized and is a total pain to actually read.
	// Will attempt to explain in comments.

	// Start with map of booleans for each mark
	let cellsHaveMarks: MarkMap = new Map(markTypes.map((markType) => [markType, true]));

	selection.forEachCell((cell, cellPos) => {
		// Early exit if all marks are already ruled out
		if (allMarksAreRuledOut(cellsHaveMarks)) {
			return;
		}

		const from = cellPos;
		const to = cellPos + cell.nodeSize;

		// On first cell just do a regular check
		if (!cellsHaveMarks) {
			cellsHaveMarks = wholeRangeHasMarks(from, to, doc, markTypes);
		} else {
			// Find the marks that are still true ie the ones that haven't been ruled out in
			// previous cells. The idea here is to whittle down the list of marks so that we check
			// less and less as we go, giving `wholeRangeHasMarks` more opportunities to exit early
			const marksToCheck: (Mark | MarkType)[] = [];
			for (const [markType, hasMark] of cellsHaveMarks) {
				if (hasMark) {
					marksToCheck.push(markType);
				}
			}

			// Look specifically for the marks that are not yet ruled out.
			const cellHasMarks = wholeRangeHasMarks(from, to, doc, marksToCheck);

			// Map these results back into the original array of results and repeat!
			for (const [markType, hasMark] of cellHasMarks) {
				cellsHaveMarks.set(markType, hasMark);
			}
		}
	});
	return cellsHaveMarks;
};

const wholeRangeHasMarks = (
	from: number,
	to: number,
	doc: Node,
	markTypes: (Mark | MarkType)[],
): MarkMap => {
	const hasMarks: MarkMap = new Map(markTypes.map((markType) => [markType, true]));
	const hasNoMarks: MarkMap = new Map(markTypes.map((markType) => [markType, false]));

	let isTextContent = false;
	doc.nodesBetween(from, to, (node) => {
		if (allMarksAreRuledOut(hasMarks)) {
			// This won't be a true early exit, but will prevent diving into nodes and
			// any checks further down the function.
			return false;
		}

		if (!node.type.isText) {
			return true; // continue traversing
		}

		isTextContent = true;

		for (const [markType, hasMark] of hasMarks) {
			if (!hasMark) {
				continue; // already ruled out the mark, skip further checks
			}
			const value =
				markType instanceof Mark
					? markType.isInSet(node.marks)
					: node.marks.some((mark) => mark.type === markType);
			hasMarks.set(markType, value);
		}
	});

	if (expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true)) {
		return isTextContent ? hasMarks : hasNoMarks;
	}

	return hasMarks;
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
