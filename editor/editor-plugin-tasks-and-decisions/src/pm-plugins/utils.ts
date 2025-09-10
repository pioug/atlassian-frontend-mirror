import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

function isTaskListNode(node: PMNode | null | undefined) {
	return Boolean(node && node.type && 'taskList' === node.type.name);
}

const resolvePositionToStartOfTaskItem = ($pos: ResolvedPos): ResolvedPos => {
	const fromRange = $pos.blockRange($pos, isTaskListNode);
	const fromPosition =
		fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos
			? Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from
			: $pos;
	return fromPosition;
};

const resolvePositionToEndOfTaskItem = ($pos: ResolvedPos): ResolvedPos => {
	const toRange = $pos.blockRange($pos, isTaskListNode);
	const toPosition =
		toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos
			? Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to
			: $pos;

	return toPosition;
};

export const normalizeTaskItemsSelection = (selection: Selection): Selection => {
	if (selection.empty) {
		return selection;
	}

	const { $from, $to } = selection;

	if (selection instanceof NodeSelection) {
		const head = resolvePositionToStartOfTaskItem($from);
		return new TextSelection(head, head);
	}

	const head = resolvePositionToStartOfTaskItem($from);
	const anchor = resolvePositionToEndOfTaskItem($to);

	return new TextSelection(anchor, head);
};

/**
 * Gets the blockTaskItem node and whether it has a paragraph child if it exists near the given resolved position.
 * @param $from resolved position, typically from the selection when the selection is an empty selection at the start of a task item
 * @returns {{ blockTaskItemNode: PMNode; hasParagraph: boolean } | false} An object with blockTaskItemNode and hasParagraph if found, or false if there is no blockTaskItem node.
 */
export const findBlockTaskItem = (
	$from: ResolvedPos,
): { blockTaskItemNode: PMNode; hasParagraph: boolean } | false => {
	const { blockTaskItem, paragraph } = $from.doc.type.schema.nodes;
	const firstParent = $from.parent;
	if (firstParent.type === blockTaskItem) {
		return {
			blockTaskItemNode: firstParent,
			hasParagraph: false,
		};
	} else if (firstParent.type === paragraph) {
		if ($from.depth >= 1) {
			const secondParent = $from.node($from.depth - 1);
			if (secondParent.type === blockTaskItem) {
				return {
					blockTaskItemNode: secondParent,
					hasParagraph: true,
				};
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	return false;
};
