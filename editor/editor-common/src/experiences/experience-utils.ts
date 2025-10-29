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
) => {
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

/**
 * Searches for the popup container element relative to the provided editor view element.
 *
 * @param editorViewEl - The editor view HTMLElement.
 * @returns The popup container HTMLElement if found, otherwise undefined.
 */
export const getPopupContainerFromEditorView = (editorViewEl?: HTMLElement | null) => {
	const editorContentArea = editorViewEl?.closest('.ak-editor-content-area');
	const pluginsComponentsWrapper = editorContentArea?.querySelector(
		':scope > [data-testid="plugins-components-wrapper"]',
	) as HTMLElement | null;
	return pluginsComponentsWrapper || undefined;
};
