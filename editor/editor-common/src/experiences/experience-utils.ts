import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Finds the direct child of the ProseMirror root element that contains the current selection.
 *
 * Starting from the DOM node at the selection position, this function walks up the DOM tree
 * until it reaches the ProseMirror root, then returns the last element before the root
 * (i.e., the second top-level ancestor).
 *
 * This is useful for attaching MutationObservers to the narrowest subtree that contains
 * the selection, while still capturing all relevant mutations within that branch.
 *
 * @param editorView - The ProseMirror EditorView instance
 * @returns The direct child of PM root containing the selection, or null if not found
 */
export const getSelectionAncestorDOM = (editorView?: EditorView): HTMLElement | null => {
	if (!editorView) {
		return null;
	}

	const pmDom = editorView.dom;
	const { selection } = editorView.state;

	// nodeDOM can return null when editor loses focus (e.g. toolbar click) or for certain positions.
	// Fall back to domAtPos which resolves the DOM node at the given position.
	let currentNode: Node | null = editorView.nodeDOM(selection.from);
	if (!currentNode) {
		try {
			const { node } = editorView.domAtPos(selection.from);
			currentNode = node instanceof HTMLElement ? node : node.parentElement;
		} catch {
			return null;
		}
	}

	let lastValidAncestor: Node | null = currentNode;
	while (currentNode instanceof HTMLElement && currentNode !== pmDom) {
		lastValidAncestor = currentNode;
		currentNode = currentNode.parentElement;
	}

	return lastValidAncestor instanceof HTMLElement ? lastValidAncestor : null;
};

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

/**
 * Searches for the popup container element relative to the provided editor view element.
 *
 * @param editorViewEl - The editor view HTMLElement.
 * @returns The popup container HTMLElement if found, otherwise undefined.
 */
export const getPopupContainerFromEditorView = (
	editorViewEl?: HTMLElement | null,
): HTMLElement | undefined => {
	const editorContentArea = editorViewEl?.closest('.ak-editor-content-area');
	const pluginsComponentsWrapper = editorContentArea?.querySelector(
		':scope > [data-testid="plugins-components-wrapper"]',
	) as HTMLElement | null;
	return pluginsComponentsWrapper || undefined;
};

/**
 * Checks if a node matches or contains the node given by the provided query css selector
 *
 * @param query - CSS selector string
 * @returns true if node matches or contains query or false otherwise
 */
export const getNodeQuery =
	(query: string) =>
	(node?: Node | null): boolean => {
		if (!node || !(node instanceof Element)) {
			return false;
		}
		return node.matches(query) || node.querySelector(query) !== null;
	};
