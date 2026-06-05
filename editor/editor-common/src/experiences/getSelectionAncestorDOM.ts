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
