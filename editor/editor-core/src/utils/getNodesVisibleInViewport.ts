import { isNodeVisible } from './isNodeVisible';

/**
 * Get visible nodes in viewport by looping through the first N nodes (MAX_NODES_TO_COUNT)
 * in the editor DOM and counting the node types that are visible.
 */
export const getNodesVisibleInViewport = (editorDom: Element): Record<string, number> => {
	const MAX_NODES_TO_COUNT = 200;
	const pmNodesList = editorDom.querySelectorAll('[data-prosemirror-node-name]');
	const nodesTypeCounter: Record<string, number> = {};

	for (let i = 0; i < Math.min(MAX_NODES_TO_COUNT, pmNodesList.length); i++) {
		const node = pmNodesList[i] as Element;
		const type = node.getAttribute('data-prosemirror-node-name');

		// No valid prosemirrornode type, skip.
		if (!type) {
			continue;
		}

		const isVisible = isNodeVisible(node);

		// Not a visible node, end counting.
		if (!isVisible) {
			break;
		}

		nodesTypeCounter[type] = (nodesTypeCounter[type] || 0) + 1;
	}

	return nodesTypeCounter;
};
