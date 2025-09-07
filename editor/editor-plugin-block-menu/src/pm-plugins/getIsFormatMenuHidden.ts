import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';

const TOP_LEVEL_NODE_DEPTHS = {
	LIST_TYPE: 2,
	PARAGRAPH_OR_HEADING: 1,
	BLOCKQUOTE: 1,
	BLOCK: 0,
};

export const getIsFormatMenuHidden = (tr: ReadonlyTransaction) => {
	const selection = tr.selection;
	const nodes = tr.doc.type.schema.nodes;

	if (selection.from === selection.to || selection.empty || !nodes) {
		return false;
	}

	let content: PMNode | undefined;
	let isTopLevelNode = false;

	const selectedNode = findSelectedNodeOfType([
		nodes.paragraph,
		nodes.heading,
		nodes.blockquote,
		nodes.panel,
		nodes.expand,
		nodes.codeBlock,
		nodes.bulletList,
		nodes.orderedList,
		nodes.taskList,
		nodes.layoutSection,
	])(selection);

	if (selectedNode) {
		content = selectedNode.node;
		isTopLevelNode = selectedNode.depth === TOP_LEVEL_NODE_DEPTHS.BLOCK;
	} else {
		const listTypeOrBlockQuoteNode = findParentNodeOfType([
			nodes.blockquote,
			nodes.listItem,
			nodes.taskItem,
		])(selection);

		if (listTypeOrBlockQuoteNode) {
			content = listTypeOrBlockQuoteNode.node;
			isTopLevelNode =
				listTypeOrBlockQuoteNode.node.type === nodes.blockquote
					? listTypeOrBlockQuoteNode.depth === TOP_LEVEL_NODE_DEPTHS.BLOCKQUOTE
					: listTypeOrBlockQuoteNode.depth === TOP_LEVEL_NODE_DEPTHS.LIST_TYPE;
		} else {
			const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
				selection,
			);

			if (paragraphOrHeadingNode) {
				content = paragraphOrHeadingNode.node;
				isTopLevelNode =
					paragraphOrHeadingNode.depth === TOP_LEVEL_NODE_DEPTHS.PARAGRAPH_OR_HEADING;
			}
		}
	}

	return !content || !isTopLevelNode;
};
