import type { Mark, MarkType, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import { stepHasSlice } from './stepHasSlice';

/**
 * Checks whether a given step is adding nodes of given nodeTypes
 *
 * @param step Step to check
 * @param nodeTypes NodeTypes being added
 */
export function stepAddsOneOf(step: Step, nodeTypes: Set<NodeType>): boolean {
	let adds = false;

	if (!stepHasSlice(step)) {
		return adds;
	}

	step.slice.content.descendants((node) => {
		if (nodeTypes.has(node.type)) {
			adds = true;
		}
		return !adds;
	});

	return adds;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const removeBlockMarks = (
	state: EditorState,
	marks: Array<MarkType | undefined>,
): Transaction | undefined => {
	const { selection, schema } = state;
	let { tr } = state;

	// Marks might not exist in Schema
	const marksToRemove = marks.filter(Boolean);
	if (marksToRemove.length === 0) {
		return undefined;
	}

	/** Saves an extra dispatch */
	let blockMarksExists = false;

	const hasMark = (mark: Mark) => marksToRemove.indexOf(mark.type) > -1;
	/**
	 * When you need to toggle the selection
	 * when another type which does not allow alignment is applied
	 */
	state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
		if (node.type === schema.nodes.paragraph && node.marks.some(hasMark)) {
			blockMarksExists = true;
			const resolvedPos = state.doc.resolve(pos);
			const withoutBlockMarks = node.marks.filter(not(hasMark));
			tr = tr.setNodeMarkup(resolvedPos.pos, undefined, node.attrs, withoutBlockMarks);
		}
	});
	return blockMarksExists ? tr : undefined;
};

const not =
	<T>(fn: (args: T) => boolean) =>
	(arg: T) =>
		!fn(arg);
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isEmptyParagraph } from './isEmptyParagraph';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { stepHasSlice } from './stepHasSlice';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { extractSliceFromStep } from './extractSliceFromStep';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isTextSelection } from './isTextSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isElementInTableCell } from './isElementInTableCell';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isLastItemMediaGroup } from './isLastItemMediaGroup';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { setNodeSelection } from './setNodeSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { setTextSelection } from './setTextSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { setAllSelection } from './setAllSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { setCellSelection } from './setCellSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { nonNullable } from './nonNullable';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isValidPosition } from './isValidPosition';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isInLayoutColumn } from './isInLayoutColumn';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { filterChildrenBetween } from './filterChildrenBetween';
