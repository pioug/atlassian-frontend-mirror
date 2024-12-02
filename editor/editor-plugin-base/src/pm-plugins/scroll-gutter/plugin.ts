import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GUTTER_SELECTOR, GUTTER_SIZE_IN_PX, isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { scrollGutterPluginKey } from './plugin-key';
import { getKeyboardHeight } from './util/get-keyboard-height';

const MIN_TAP_SIZE_IN_PX = 40;

function supportsIntersectionObserver() {
	if (
		typeof window !== 'undefined' &&
		'IntersectionObserver' in window &&
		'IntersectionObserverEntry' in window &&
		'intersectionRatio' in
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).IntersectionObserverEntry.prototype
	) {
		return true;
	}
	return false;
}

function listenForGutterVisibilityChanges(
	scrollElement: HTMLElement,
	gutterIsVisible: (visible: boolean) => void,
): IntersectionObserver | undefined {
	if (supportsIntersectionObserver()) {
		const observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
				entries.forEach((entry) => {
					gutterIsVisible(entry.intersectionRatio > 0);
				});
			},
			{
				root: scrollElement,
				rootMargin: '0px',
				threshold: 0,
			},
		);
		return observer;
	}
	return undefined;
}

/**
 * Create a gutter element that can be added or removed from the DOM.
 */
function createGutter(gutterSize: number) {
	const gutter = document.createElement('div');
	gutter.style.paddingBottom = `${gutterSize}px`;
	gutter.id = GUTTER_SELECTOR.substr(1);

	let initialized = false;
	let mounted = false;
	let currentParent: WeakRef<HTMLElement> | null = null;

	let observer: IntersectionObserver | undefined;

	let isVisible = false;
	return {
		addGutter(parent: WeakRef<HTMLElement> | null) {
			if (parent) {
				currentParent = parent;
				parent.deref()?.appendChild(gutter);
				mounted = true;
				if (observer) {
					observer.observe(gutter);
				}
			}
		},
		removeGutter() {
			const parentRef = currentParent?.deref();
			if (parentRef && mounted) {
				mounted = false;
				parentRef.removeChild(gutter);
				if (observer) {
					observer.unobserve(gutter);
				}
			}
		},
		element() {
			return gutter;
		},
		isMounted() {
			return mounted;
		},
		visible() {
			// If we know whether it's visible we can avoid expensive calculations
			if (observer) {
				return isVisible;
			}
			// Fallback for legacy browsers assumes it's visible (if mounted)
			return mounted;
		},
		observe(scrollElement: HTMLElement) {
			if (!initialized) {
				initialized = true;
				observer = listenForGutterVisibilityChanges(
					scrollElement,
					(visible: boolean) => (isVisible = visible),
				);
			}
		},
		destroy() {
			if (observer) {
				observer.disconnect();
			}
			observer = undefined;
			this.removeGutter();
			initialized = mounted = false;
		},
	};
}

/**
 * Get caret top position given the current selection,
 * use start container position as fallback
 */
function getCaretTopPosition(): number | undefined {
	const windowSelection = window.getSelection();
	if (windowSelection && windowSelection.rangeCount > 0) {
		const range = windowSelection.getRangeAt(0);
		if (range) {
			const clientRects = range.getClientRects();
			// Return client rects
			if (clientRects && clientRects.length > 0) {
				return clientRects[0].top;
			}

			// Return container top
			const container = range.startContainer as HTMLElement;
			if (container && container.getBoundingClientRect) {
				return container.getBoundingClientRect().top;
			}
		}
	}
	return;
}

function scrollToGutterElement(
	scrollContainer: HTMLElement,
	gutterElement: HTMLElement,
	gutterSize: number,
): boolean {
	const viewportHeight = scrollContainer.offsetHeight;
	const viewportOffsetY = scrollContainer.getBoundingClientRect().top;

	const caretTopPosition = getCaretTopPosition();
	if (!caretTopPosition) {
		return false;
	}

	const caretTopFromContainer = caretTopPosition - viewportOffsetY;
	const gutterThresholdTop = viewportHeight - gutterSize - MIN_TAP_SIZE_IN_PX * 2;

	if (caretTopFromContainer < gutterThresholdTop) {
		return false;
	}

	// Clamp the scroll position to above the scroll gutter element.
	gutterElement.scrollIntoView(false);

	// Mark scrolling as handled so that other plugin's don't override our position.
	return true;
}

export type ScrollGutterPluginOptions = {
	/** Element the page uses for scrolling */
	getScrollElement?: (view: EditorView) => HTMLElement | null;
	/**
	 * Whether to allow custom functionality to scroll to gutter element in
	 * plugin's handleScrollToSelection function
	 * Default is true
	 */
	allowCustomScrollHandler?: boolean;
	/**
	 * Persist scroll gutter when the mobile appearance is COMPACT
	 * Default is false
	 */
	persistScrollGutter?: boolean;
	gutterSize?: number;
};

export default (pluginOptions: ScrollGutterPluginOptions = {}) => {
	const {
		getScrollElement,
		allowCustomScrollHandler,
		gutterSize = GUTTER_SIZE_IN_PX,
	} = pluginOptions;
	if (!getScrollElement) {
		return undefined;
	}

	const gutter = createGutter(gutterSize);
	let scrollElement: HTMLElement | null = null; // | undefined;

	return new SafePlugin({
		key: scrollGutterPluginKey,
		state: {
			init: () => ({}),
			apply: (tr, pluginState) => {
				if (tr.getMeta(scrollGutterPluginKey)) {
					return tr.getMeta(scrollGutterPluginKey);
				}
				return pluginState;
			},
		},
		props: {
			// Determines the distance (in pixels) between the cursor and the end of the visible viewport at which point,
			// when scrolling the cursor into view, scrolling takes place.
			// Defaults to 0: https://prosemirror.net/docs/ref/#view.EditorProps.scrollThreshold
			scrollThreshold: gutterSize / 2,
			// Determines the extra space (in pixels) that is left above or below the cursor when it is scrolled into view.
			// Defaults to 5: https://prosemirror.net/docs/ref/#view.EditorProps.scrollMargin
			scrollMargin: gutterSize,
			// Called when the view, after updating its state, tries to scroll the selection into view
			// https://prosemirror.net/docs/ref/#view.EditorProps.handleScrollToSelection
			handleScrollToSelection: (): boolean => {
				if (allowCustomScrollHandler === false) {
					return false;
				}
				if (!gutter.isMounted() || !gutter.visible() || !scrollElement) {
					// Avoid scrolling until applicable
					return false;
				}
				return scrollToGutterElement(scrollElement, gutter.element(), gutterSize);
			},
		},
		view(view: EditorView) {
			// Store references to avoid lookups on successive checks.
			scrollElement = getScrollElement(view);
			let editorElement: HTMLElement | null = view.dom as HTMLElement;
			let editorParentElement = editorElement.parentElement;
			let viewportElementHeight = 0;
			let contentElementHeight = 0;

			const addAndObserveGutter = () => {
				if (!gutter.isMounted()) {
					gutter.observe(scrollElement!);
					gutter.addGutter(editorParentElement ? new WeakRef(editorParentElement) : null);
				}
			};

			const toggleGutter = (contentSize: number, threshold: number) => {
				if (pluginOptions.persistScrollGutter) {
					if (!isEmptyDocument(view.state.doc)) {
						addAndObserveGutter();
					} else {
						gutter.removeGutter();
					}
					return;
				}

				// Add or remove the gutter based on whether the content is about to exceed the viewport height.
				// We do this to ensure there is sufficient white space below the last content node in order to
				// see any UI control elements which may sit beneath it.
				if (contentSize >= threshold) {
					addAndObserveGutter();
				} else {
					if (gutter.isMounted()) {
						gutter.removeGutter();
					}
				}
			};

			const observerCallback: ResizeObserverCallback = (entries) => {
				for (const entry of entries) {
					const elementHeight = Math.round(entry.contentRect.height);
					if (entry.target === scrollElement) {
						const keyboardHeight = getKeyboardHeight(view?.state) ?? 0;
						viewportElementHeight = elementHeight - keyboardHeight;
					} else if (entry.target === editorParentElement) {
						contentElementHeight = elementHeight - (gutter.isMounted() ? gutterSize : 0);
					}
				}

				toggleGutter(contentElementHeight, viewportElementHeight);
			};

			// Subscribe to updates of the height of the viewport and content elements
			// We toggle the value when it is set here or when PM updates to ensure we're using
			// the latest.
			const resizeObserver = new ResizeObserver(observerCallback);

			if (scrollElement && editorParentElement) {
				resizeObserver.observe(scrollElement);
				resizeObserver.observe(editorParentElement);
			}

			return {
				destroy() {
					// Remove if it's mounted
					gutter.destroy();
					scrollElement = editorParentElement = editorElement = null;
					resizeObserver.disconnect();
				},
				/**
				 * Toggle the Scroll Gutter Element
				 */
				update(view: EditorView, prevState: EditorState) {
					if (!scrollElement || !editorParentElement) {
						return;
					}

					const state = view.state;
					if (prevState.selection === state.selection) {
						// No need to recheck if the selected node hasn't changed.
						return;
					}

					const gutterThresholdHeight = viewportElementHeight - gutterSize;
					toggleGutter(contentElementHeight, gutterThresholdHeight);
				},
			};
		},
	});
};
