/**
 * Check if a DOM element is visible within the viewport. We deem a node visible if the top left corner coordinate is within the viewport.
 * This may not look visible, and may include a node that looks below the fold – but it's more than 0 pixels within the viewport.
 */
export const isNodeVisible = (node: Element): boolean => {
	const rect = node.getBoundingClientRect();
	const isVisible =
		rect.x >= 0 && rect.x < window.innerWidth && rect.y >= 0 && rect.y < window.innerHeight;

	return isVisible;
};

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
