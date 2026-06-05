/**
 * Checks if a given node contains a popup with a nested element identified by a specific test ID.
 *
 * @param node - The node to check.
 * @param nestedElementQuery - The query to look for the nested element.
 * @returns True if the node contains the popup, false otherwise.
 */
export const containsPopupWithNestedElement = (
	node: Node | null | undefined,
	nestedElementQuery: string,
): boolean => {
	if (!(node instanceof HTMLElement)) {
		return false;
	}

	// Check if node itself has the popup attribute and contains the element matching the nestedElementQuery
	if (node.matches('[data-editor-popup="true"]')) {
		return !!node.querySelector(nestedElementQuery);
	}

	// Check if any direct child with popup attribute contains the element matching the nestedElementQuery
	return !!node.querySelector(`:scope > [data-editor-popup="true"] ${nestedElementQuery}`);
};
