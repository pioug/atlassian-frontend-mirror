import { NodeSelection, TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';

export const getSelection = (tr: Transaction, start: number) => {
	const node = tr.doc.nodeAt(start);
	const isNodeSelection = node && NodeSelection.isSelectable(node);
	const nodeSize = node ? node.nodeSize : 1;
	const $startPos = tr.doc.resolve(start);

	// decisionList node is not selectable, but we want to select the whole node not just text
	if (isNodeSelection || node?.type.name === 'decisionList') {
		return new NodeSelection($startPos);
	} else {
		// To trigger the annotation floating toolbar for non-selectable node, we need to select inline nodes
		// Find the first inline node in the node
		let inlineNodePos: number = start;
		let foundInlineNode = false;
		tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n, pos) => {
			if (foundInlineNode) {
				return false;
			}
			if (n.isInline) {
				inlineNodePos = pos;
				foundInlineNode = true;
				return false;
			}
			return true;
		});

		const inlineNodeDepth = inlineNodePos - start;
		return new TextSelection(
			tr.doc.resolve(start + nodeSize - inlineNodeDepth),
			tr.doc.resolve(inlineNodePos),
		);
	}
};

export const selectNode = (tr: Transaction, start: number, nodeType: string): Transaction => {
	// For table, we need to do cell selection instead of node selection
	if (nodeType === 'table') {
		tr = selectTableClosestToPos(tr, tr.doc.resolve(start + 1));
	} else {
		tr.setSelection(getSelection(tr, start));
	}
	return tr;
};
