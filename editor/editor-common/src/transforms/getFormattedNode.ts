import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const getFormattedNode = (tr: Transaction): { node: PMNode; pos: number } => {
	const { selection } = tr;
	const { nodes } = tr.doc.type.schema;

	// gating behind platform_editor_small_font_size to support task lists with font size applied,
	// but keep this solution general
	const isBlockTaskItemEnabled =
		!!nodes.blockTaskItem && expValEquals('platform_editor_small_font_size', 'isEnabled', true);

	// Find the node to format from the current selection
	let nodeToFormat;
	let nodePos: number = selection.from;

	// Try to find the current node from selection
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
		nodeToFormat = selectedNode.node;
		nodePos = selectedNode.pos;
	} else {
		// Try to find parent node (including list parents)
		const parentNodeTypes = [
			nodes.blockquote,
			nodes.panel,
			nodes.expand,
			nodes.codeBlock,
			nodes.listItem,
			nodes.taskItem,
			nodes.layoutSection,
		];

		if (isBlockTaskItemEnabled) {
			parentNodeTypes.push(nodes.blockTaskItem);
		}

		const parentNode = findParentNodeOfType(parentNodeTypes)(selection);

		if (parentNode) {
			nodeToFormat = parentNode.node;
			nodePos = parentNode.pos;

			const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
				selection,
			);
			// Special case: if we found a listItem/taskItem/blockTaskItem, check if we need the parent list instead
			if (
				parentNode.node.type === nodes.listItem ||
				parentNode.node.type === nodes.taskItem ||
				(isBlockTaskItemEnabled && parentNode.node.type === nodes.blockTaskItem)
			) {
				const listParent = findParentNodeOfType([
					nodes.bulletList,
					nodes.orderedList,
					nodes.taskList,
				])(selection);

				if (listParent) {
					// For list transformations, we want the list parent, not the listItem
					nodeToFormat = listParent.node;
					nodePos = listParent.pos;
				}
			} else if (parentNode.node.type !== nodes.blockquote && paragraphOrHeadingNode) {
				nodeToFormat = paragraphOrHeadingNode.node;
				nodePos = paragraphOrHeadingNode.pos;
			}
		}
	}

	if (!nodeToFormat) {
		nodeToFormat = selection.$from.node();
		nodePos = selection.$from.pos;
	}

	return { node: nodeToFormat, pos: nodePos };
};
