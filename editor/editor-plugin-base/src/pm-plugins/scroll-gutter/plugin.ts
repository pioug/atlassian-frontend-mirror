import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { scrollGutterPluginKey } from './plugin-key';

const GUTTER_SIZE_IN_PX = 120;
const GUTTER_SELECTOR_NAME = 'editor-scroll-gutter';

/**
 * Create a gutter element that can be added or removed from the DOM.
 */
function createGutter(gutterSize: number, parent: HTMLElement | null) {
	const gutterRef = document.getElementById(GUTTER_SELECTOR_NAME);
	if (gutterRef) {
		return () => parent?.removeChild(gutterRef);
	}

	const gutter = document.createElement('div');
	gutter.style.paddingBottom = `${gutterSize}px`;
	gutter.setAttribute('data-vc', 'scroll-gutter');
	gutter.id = GUTTER_SELECTOR_NAME;

	if (parent) {
		parent.appendChild(gutter);
	}

	return () => parent?.removeChild(gutter);
}

export type ScrollGutterPluginOptions = {
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated
	 *
	 * Whether to allow custom functionality to scroll to gutter element in
	 * plugin's handleScrollToSelection function
	 * Default is true
	 */
	allowCustomScrollHandler?: boolean;
	/** Element the page uses for scrolling */
	getScrollElement?: (view: EditorView) => HTMLElement | null;
	gutterSize?: number;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated
	 *
	 * Persist scroll gutter when the mobile appearance is COMPACT
	 * Default is false
	 */
	persistScrollGutter?: boolean;
};

export default (pluginOptions: ScrollGutterPluginOptions = {}) => {
	const { getScrollElement, gutterSize = GUTTER_SIZE_IN_PX } = pluginOptions;
	if (!getScrollElement) {
		return undefined;
	}

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
			scrollThreshold: gutterSize,
			// Determines the extra space (in pixels) that is left above or below the cursor when it is scrolled into view.
			// Defaults to 5: https://prosemirror.net/docs/ref/#view.EditorProps.scrollMargin
			scrollMargin: gutterSize,
		},
		view(view: EditorView) {
			// Store references to avoid lookups on successive checks.
			const scrollElement = getScrollElement(view);
			let editorElement: HTMLElement | null = view.dom instanceof HTMLElement ? view.dom : null;
			let editorParentElement = editorElement?.parentElement;
			let cleanup = () => {};

			if (editorParentElement && scrollElement) {
				cleanup = createGutter(gutterSize, editorParentElement);
			}

			return {
				destroy() {
					cleanup();
					editorParentElement = editorElement = null;
				},
			};
		},
	});
};
