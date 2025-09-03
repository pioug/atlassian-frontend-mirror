import type { EditorCommand } from '@atlaskit/editor-common/types';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { transformNodeToTargetType } from './transforms/transformNodeToTargetType';
import type { FormatNodeTargetType } from './transforms/types';

/**
 * Formats the current node or selection to the specified target type
 * @param targetType - The target node type to convert to
 */
export const formatNode = (targetType: FormatNodeTargetType): EditorCommand => {
	return ({ tr }) => {
		const { selection } = tr;
		const { nodes } = tr.doc.type.schema;

		// Find the node to format from the current selection
		let nodeToFormat;
		let nodePos: number | null = null;

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
			const parentNode = findParentNodeOfType([
				nodes.blockquote,
				nodes.panel,
				nodes.expand,
				nodes.codeBlock,
				nodes.listItem,
				nodes.taskItem,
				nodes.layoutSection,
			])(selection);

			if (parentNode) {
				nodeToFormat = parentNode.node;
				nodePos = parentNode.pos;

				const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
					selection,
				);
				// Special case: if we found a listItem, check if we need the parent list instead
				if (parentNode.node.type === nodes.listItem || parentNode.node.type === nodes.taskItem) {
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

		try {
			return transformNodeToTargetType(tr, nodeToFormat, nodePos, targetType);
		} catch {
			return null;
		}
	};
};
