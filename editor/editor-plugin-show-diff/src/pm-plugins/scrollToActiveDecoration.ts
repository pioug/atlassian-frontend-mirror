import type { EditorView, Decoration } from '@atlaskit/editor-prosemirror/view';

/**
 * Scrolls to the current position/selection of the document. It does the same as scrollIntoView()
 * but without requiring the focus on the editor, thus it can be called at any time.
 */
function scrollToSelection(view: EditorView, position: number): void {
	const { node } = view.domAtPos(position);
	if (node instanceof Element) {
		node.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
}

/**
 * Scrolls the editor view to the decoration at the given index.
 */
export const scrollToActiveDecoration = (
	view: EditorView,
	decorations: Decoration[],
	activeIndex: number,
) => {
	const decoration = decorations[activeIndex];
	if (!decoration) {
		return;
	}

	scrollToSelection(view, decoration?.from);
};
