import type { Mark, Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type NodesSanitized = Array<{
	marksRemoved: Mark[];
	node: Node;
}>;

const listContainerTypes = new Set(['bulletList', 'orderedList']);

/**
 * When wrapping in a list, the paragraph's direct parent will be listItem,
 * not the list container itself. For fontSize marks, resolve to listItem
 * so mark compatibility is checked against the actual parent.
 */
const resolveEffectiveParentType = (newParentType?: NodeType): NodeType | undefined => {
	if (
		newParentType &&
		listContainerTypes.has(newParentType.name) &&
		expValEquals('platform_editor_small_font_size', 'isEnabled', true)
	) {
		return newParentType.schema.nodes.listItem;
	}
	return newParentType;
};

const isMarkDisallowed = (mark: Mark, parent: Node | null, effectiveParentType?: NodeType) =>
	!parent?.type.allowsMarkType(mark.type) ||
	(effectiveParentType && !effectiveParentType.allowsMarkType(mark.type));

export const sanitiseMarksInSelection = (
	tr: Transaction,
	newParentType?: NodeType,
): NodesSanitized => {
	const { from, to } = tr.selection;
	const nodesSanitized: NodesSanitized = [];

	tr.doc.nodesBetween(from, to, (node, pos, parent) => {
		if (node.isText) {
			return false;
		}
		// Skip expands and layouts if they are outside selection
		// but continue to iterate over their children.
		if (['expand', 'layoutSection'].includes(node.type.name) && (pos < from || pos > to)) {
			return true;
		}
		node.marks.forEach((mark) => {
			const effectiveParentType = resolveEffectiveParentType(newParentType);

			if (isMarkDisallowed(mark, parent, effectiveParentType)) {
				const filteredMarks = node.marks.filter((m) => m.type !== mark.type);
				const position = pos > 0 ? pos : 0;

				const marksRemoved = node.marks.filter((m) => m.type === mark.type);
				nodesSanitized.push({
					node,
					marksRemoved,
				});
				tr.setNodeMarkup(position, undefined, node.attrs, filteredMarks);
			}
		});
	});

	return nodesSanitized;
};
