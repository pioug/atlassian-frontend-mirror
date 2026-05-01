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
 * Checks if element is not visible in the viewport, accounting
 * for the scroll margin offset used during scrolling.
 */
function shouldScrollIntoView(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	return !(rect.top >= SCROLL_TOP_MARGIN_PX && rect.bottom <= viewportHeight);
}

/**
 * Returns the resolved HTMLElement for a given DOM node, walking up to the
 * parent element if the node itself is not an Element (e.g. a text node).
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
 * Schedules scrolling to the first diff decoration after the next frame.
 * Unlike `scrollToActiveDecoration`, this does not require an active index —
 * it simply scrolls to bring the first decoration into view.
 *
 * @returns A function that cancels the scheduled `requestAnimationFrame` if it has not run yet.
 */
export const scrollToFirstDecoration = (
	view: EditorView,
	decorations: Decoration[],
): (() => void) => {
	const decoration = decorations[0];
	if (!decoration) {
		return () => {};
	}

	let rafId: number | null = requestAnimationFrame(() => {
		rafId = null;
		// @ts-expect-error - decoration.type is not typed public API
		if (decoration.spec?.key?.startsWith('diff-widget') && decoration?.type?.toDOM) {
			// @ts-expect-error - decoration.type is not typed public API
			const widgetDom = decoration.type.toDOM;
			if (shouldScrollIntoView(widgetDom)) {
				scrollToSelection(widgetDom);
			}
		} else {
			const targetNode = view.nodeDOM(decoration?.from);
			const node =
				targetNode instanceof Element ? targetNode : view.domAtPos(decoration?.from)?.node;
			if (node instanceof HTMLElement && shouldScrollIntoView(node)) {
				scrollToSelection(node);
			}
		}
	});

	return () => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};
};

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
