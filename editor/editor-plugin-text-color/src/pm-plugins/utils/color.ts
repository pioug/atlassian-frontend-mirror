import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import { DEFAULT_COLOR } from './constants';

/**
 * Use getDisabledStateNew instead and pass in `tr`
 */
export const getActiveColor = (state: EditorState): string | null => {
	const { $from, $to, $cursor } = state.selection as TextSelection;
	const { textColor } = state.schema.marks as { textColor: MarkType };

	// Filter out other marks
	let marks: Array<Mark | undefined> = [];
	if ($cursor) {
		marks.push(textColor.isInSet(state.storedMarks || $cursor.marks()) || undefined);
	} else {
		state.doc.nodesBetween($from.pos, $to.pos, (currentNode) => {
			if (currentNode.isLeaf) {
				const mark = textColor.isInSet(currentNode.marks) || undefined;
				marks.push(mark);
				return !mark;
			}
			return true;
		});
	}

	// Merge consecutive same color marks
	let prevMark: Mark | undefined;
	marks = marks.filter((mark) => {
		if (mark && prevMark && mark.attrs.color === prevMark.attrs.color) {
			return false;
		}
		prevMark = mark;
		return true;
	});

	const marksWithColor = marks.filter((mark) => !!mark) as Array<Mark>;
	// When multiple colors are selected revert back to default color
	if (marksWithColor.length > 1 || (marksWithColor.length === 1 && marks.length > 1)) {
		return null;
	}
	return marksWithColor.length ? marksWithColor[0].attrs.color : DEFAULT_COLOR.color;
};

/**
 * Returns true only when the selection contains two or more *distinct* text
 * colors.
 *
 * This is deliberately narrower than `getActiveColor() === null`: `getActiveColor`
 * also returns `null` for a mixed selection where a single colored region sits
 * alongside uncolored text (`marksWithColor.length === 1 && marks.length > 1`).
 * That mixed case is not a multi-color selection and must not trigger the
 * expensive worst-status selection walk, so we key the `isMultiTextColor` flag
 * off this predicate instead.
 */
export const isMultiTextColorSelection = (state: EditorState): boolean => {
	const { selection, doc } = state;
	if (!(selection instanceof TextSelection)) {
		return false;
	}

	const { textColor } = doc.type.schema.marks;
	const colors = new Set<string>();
	doc.nodesBetween(selection.from, selection.to, (node) => {
		if (node.isLeaf) {
			const mark = textColor.isInSet(node.marks);
			if (mark) {
				colors.add(mark.attrs.color);
			}
		}
	});

	return colors.size > 1;
};

export const getActiveColorNew = (tr: Transaction): string | null => {
	const { $from, $to, $cursor } = tr.selection as TextSelection;
	const { textColor } = tr.doc.type.schema.marks as { textColor: MarkType };

	// Filter out other marks
	let marks: Array<Mark | undefined> = [];
	if ($cursor) {
		marks.push(textColor.isInSet(tr.storedMarks || $cursor.marks()) || undefined);
	} else {
		tr.doc.nodesBetween($from.pos, $to.pos, (currentNode) => {
			if (currentNode.isLeaf) {
				const mark = textColor.isInSet(currentNode.marks) || undefined;
				marks.push(mark);
				return !mark;
			}
			return true;
		});
	}

	// Merge consecutive same color marks
	let prevMark: Mark | undefined;
	marks = marks.filter((mark) => {
		if (mark && prevMark && mark.attrs.color === prevMark.attrs.color) {
			return false;
		}
		prevMark = mark;
		return true;
	});

	const marksWithColor = marks.filter((mark) => !!mark) as Array<Mark>;
	// When multiple colors are selected revert back to default color
	if (marksWithColor.length > 1 || (marksWithColor.length === 1 && marks.length > 1)) {
		return null;
	}
	return marksWithColor.length ? marksWithColor[0].attrs.color : DEFAULT_COLOR.color;
};
