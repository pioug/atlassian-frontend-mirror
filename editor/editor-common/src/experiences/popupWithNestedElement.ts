/**
 * Returns the popup with a nested element identified by a specific test ID if it exists.
 *
 * @param node - The node to check.
 * @param nestedElementQuery - The query to look for the nested element.
 * @returns Element if the node contains the popup, undefined otherwise.
 */
export const popupWithNestedElement = (
	node: Node | null | undefined,
	nestedElementQuery: string,
): Element | null | undefined => {
	if (!(node instanceof HTMLElement)) {
		return undefined;
	}

	// Check if node itself has the popup attribute and contains the element matching the nestedElementQuery
	if (node.matches('[data-editor-popup="true"]')) {
		return node.querySelector(nestedElementQuery);
	}

	// Check if any direct child with popup attribute contains the element matching the nestedElementQuery
	return node.querySelector(`:scope > [data-editor-popup="true"] ${nestedElementQuery}`);
};
