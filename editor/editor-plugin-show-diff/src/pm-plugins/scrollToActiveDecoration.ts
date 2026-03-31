import type { EditorView, Decoration } from '@atlaskit/editor-prosemirror/view';

/**
 * Extra space above the scrolled-to element so it does not sit flush under the
 * viewport edge (helps with sticky table headers, toolbars, etc.).
 *
 * Implemented with `scroll-margin-top` so we still use the browser’s native
 * `scrollIntoView`, which scrolls every relevant scrollport (nested containers
 * and the window). A single manual `scrollTop` on one ancestor often misses
 * outer scroll or mis-identifies the active scroll container.
 */
const SCROLL_TOP_MARGIN_PX = 100;

/**
 * Scrolls to the current position/selection of the document. It does the same as scrollIntoView()
 * but without requiring the focus on the editor, thus it can be called at any time.
 */
function scrollToSelection(node: Node | null | undefined): void {
	const element =
		node instanceof Element
			? node
			: node?.parentElement instanceof Element
				? node.parentElement
				: null;
	if (!(element instanceof HTMLElement)) {
		return;
	}

	// scroll-margin is included in scroll-into-view math; it does not change layout.
	const previousScrollMarginTop = element.style.scrollMarginTop;
	element.style.scrollMarginTop = `${SCROLL_TOP_MARGIN_PX}px`;
	try {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	} finally {
		element.style.scrollMarginTop = previousScrollMarginTop;
	}
}

/**
 * Schedules scrolling to the decoration at the given index after the next frame.
 *
 * @returns A function that cancels the scheduled `requestAnimationFrame` if it has not run yet.
 */
export const scrollToActiveDecoration = (
	view: EditorView,
	decorations: Decoration[],
	activeIndex: number,
): (() => void) => {
	const decoration = decorations[activeIndex];
	if (!decoration) {
		return () => {};
	}

	let rafId: number | null = requestAnimationFrame(() => {
		rafId = null;
		if (decoration.spec?.key === 'diff-widget-active') {
			// @ts-expect-error - decoration.type is not typed public API
			const widgetDom = decoration?.type?.toDOM;
			scrollToSelection(widgetDom);
		} else {
			const targetNode = view.nodeDOM(decoration?.from);
			const node =
				targetNode instanceof Element ? targetNode : view.domAtPos(decoration?.from)?.node;
			scrollToSelection(node);
		}
	});

	return () => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};
};
