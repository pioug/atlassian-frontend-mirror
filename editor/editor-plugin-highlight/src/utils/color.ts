import { entireSelectionContainsMark } from '@atlaskit/editor-common/mark';
import { REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import type { Mark, Node } from '@atlaskit/editor-prosemirror/model';
import {
	type ReadonlyTransaction,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

const getAllUniqueBackgroundColorMarksInRange = (
	from: number,
	to: number,
	tr: Transaction | ReadonlyTransaction,
) => {
	const { doc } = tr;
	const { backgroundColor } = doc.type.schema.marks;
	const colorMarks: Mark[] = [];
	const colorSet = new Set<string>();
	doc.nodesBetween(from, to, (node: Node) => {
		if (node.isLeaf) {
			const mark = backgroundColor.isInSet(node.marks);
			if (mark && !colorSet.has(mark.attrs.color)) {
				colorMarks.push(mark);
				colorSet.add(mark.attrs.color);
			}
		}
	});
	return colorMarks;
};

const getAllUniqueBackgroundColorMarksInCellSelection = (
	selection: CellSelection,
	tr: Transaction | ReadonlyTransaction,
) => {
	const colorMarks: Mark[] = [];
	const colorSet = new Set<string>();
	selection.forEachCell((cell, cellPos) => {
		const from = cellPos;
		const to = cellPos + cell.nodeSize;
		const marks = getAllUniqueBackgroundColorMarksInRange(from, to, tr);
		marks.forEach((mark) => {
			if (!colorSet.has(mark.attrs.color)) {
				colorMarks.push(mark);
				colorSet.add(mark.attrs.color);
			}
		});
	});
	return colorMarks;
};

// For Cell Selections - find first instance of a backgroundColor mark
// if all cells entirely contain this mark, set the color.
// If the selection contains multiple colors, return null
const getColorFromCellSelection = (
	selection: CellSelection,
	tr: Transaction | ReadonlyTransaction,
): string | null => {
	const marks = getAllUniqueBackgroundColorMarksInCellSelection(selection, tr);

	if (marks.length > 1) {
		return null;
	}

	const firstColorMark = marks.at(0);
	let foundNonColoredNode = false;

	if (firstColorMark) {
		selection.forEachCell((cell, cellPos) => {
			if (foundNonColoredNode) {
				return;
			}

			const from = cellPos;
			const to = cellPos + cell.nodeSize;

			if (!entireSelectionContainsMark(firstColorMark, tr.doc, from, to)) {
				foundNonColoredNode = true;
			}
		});
	}

	return foundNonColoredNode ? REMOVE_HIGHLIGHT_COLOR : firstColorMark?.attrs.color;
};

// All other selections - find the first instance of a backgroundColor mark
// if selection entirely contains this mark, set the color.
// If the selection contains multiple colors, return null
const getColorFromRange = (
	from: number,
	to: number,
	tr: Transaction | ReadonlyTransaction,
): string | null => {
	const marks = getAllUniqueBackgroundColorMarksInRange(from, to, tr);

	if (marks.length > 1) {
		return null;
	}

	const firstColorMark = marks.at(0);

	if (firstColorMark && entireSelectionContainsMark(firstColorMark, tr.doc, from, to)) {
		return firstColorMark.attrs.color;
	}

	return REMOVE_HIGHLIGHT_COLOR;
};

// For Cursor selections - set color if it is found in the storedMarks or $cursor.marks
const getColorFromCursor = (
	selection: TextSelection,
	tr: Transaction | ReadonlyTransaction,
): string => {
	if (!selection.$cursor) {
		return REMOVE_HIGHLIGHT_COLOR;
	}

	const mark = tr.doc.type.schema.marks.backgroundColor.isInSet([
		...(tr.storedMarks ? tr.storedMarks : []),
		...selection.$cursor.marks(),
	]);

	return mark?.attrs.color || REMOVE_HIGHLIGHT_COLOR;
};

export const getActiveColor = (tr: Transaction | ReadonlyTransaction) => {
	const { selection } = tr;
	let color: string | null;

	if (selection instanceof CellSelection) {
		color = getColorFromCellSelection(selection, tr);
	} else if (selection instanceof TextSelection && selection.$cursor) {
		color = getColorFromCursor(selection, tr);
	} else {
		color = getColorFromRange(selection.from, selection.to, tr);
	}

	return color === undefined ? REMOVE_HIGHLIGHT_COLOR : color;
};
