import type { Mark, MarkType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const entireSelectionContainsMark = (
	mark: Mark | MarkType,
	doc: PMNode,
	fromPos: number,
	toPos: number,
): boolean => {
	let onlyContainsMark = true;

	doc.nodesBetween(fromPos, toPos, (node) => {
		// Skip recursion once we've found text which doesn't include the mark
		if (!onlyContainsMark) {
			return false;
		}
		if (node.isText) {
			onlyContainsMark && (onlyContainsMark = !!mark?.isInSet(node.marks));
		}
	});
	return onlyContainsMark;
};
