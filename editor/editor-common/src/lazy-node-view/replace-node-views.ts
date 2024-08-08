import debounce from 'lodash/debounce';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CacheLoadedReactNodeViews, LoadedReactNodeViews, NodeViewConstructor } from './types';

/**
 * 🧱 Internal: Editor FE Platform
 */
const isFirefox = /gecko\/\d/i.test(navigator.userAgent);

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Debounces and replaces the node views in a ProseMirror editor with lazy-loaded node views.
 *
 * This function is used to update the `nodeViews` property of the `EditorView` after lazy-loaded
 * node views have been loaded. It uses a debounced approach to ensure that the replacement does
 * not happen too frequently, which can be performance-intensive.
 *
 * The function checks if there are any loaded node views in the cache associated with the given
 * `EditorView`. If there are, it replaces the current `nodeViews` in the `EditorView` with the
 * loaded node views. The replacement is scheduled using `requestIdleCallback` or
 * `requestAnimationFrame` to avoid blocking the main thread, especially in Firefox where
 * `requestIdleCallback` may not be supported.
 *
 * @param {WeakMap<EditorView, Record<string, NodeViewConstructor>>} cache - A WeakMap that stores
 *        the loaded node views for each `EditorView`. The key is the `EditorView`, and the value
 *        is a record of node type names to their corresponding `NodeViewConstructor`.
 * @param {EditorView} view - The ProseMirror `EditorView` instance whose `nodeViews` property
 *        needs to be updated.
 *
 * @example
 * const cache = new WeakMap();
 * const view = new EditorView(...);
 *
 * // Assume some node views have been loaded and stored in the cache
 * cache.set(view, {
 *   'table': TableViewConstructor,
 *   'tableCell': TableCellViewConstructor,
 * });
 *
 * debouncedReplaceNodeviews(cache, view);
 */
export const debouncedReplaceNodeviews = debounce(
	(cache: CacheLoadedReactNodeViews, view: EditorView) => {
		const loadedNodeviews: LoadedReactNodeViews | undefined = cache.get(view);

		if (!loadedNodeviews || Object.keys(loadedNodeviews).length === 0) {
			return;
		}
		const nodeViewsToReplace = { ...loadedNodeviews };

		// Make sure the cache is cleaned
		// From here, we will access the loaded node views by lexical scope
		cache.set(view, {});

		/*
		 * For reasons that goes beyond my knowledge
		 * some Firefox versions aren't calling the requestIdleCallback.
		 *
		 * So, we need this check to make sure we use the requestAnimationFrame instead
		 *
		 * setting timeout to 2s to ensure this function is called, but not before prosemirror render
		 * and other important tasks are done - adjust this timeout based on user feedback
		 */
		const later = (callback: any) => {
			// eslint-disable-next-line compat/compat
			if (isFirefox || !window.requestIdleCallback) {
				return window.requestAnimationFrame(callback);
			}
			// eslint-disable-next-line compat/compat
			window.requestIdleCallback(callback, { timeout: 2000 });
		};

		later(() => {
			const currentNodeViews = view.props.nodeViews;

			const nextNodeViews = {
				...currentNodeViews,
				...nodeViewsToReplace,
			};

			view.setProps({
				nodeViews: nextNodeViews,
			});
		});
	},
);

/**
 * 🧱 Internal: Editor FE Platform
 */
const loadedPerEditorView: CacheLoadedReactNodeViews = new WeakMap<
	EditorView,
	LoadedReactNodeViews
>();

/**
 * 🧱 Internal: Editor FE Platform
 */
export const queueReplaceNodeViews = (
	view: EditorView,
	{ nodeName, nodeViewFunc }: { nodeName: string; nodeViewFunc: NodeViewConstructor },
) => {
	const nodeViews = loadedPerEditorView.get(view) || {};

	nodeViews[nodeName] = nodeViewFunc;

	loadedPerEditorView.set(view, nodeViews);

	debouncedReplaceNodeviews(loadedPerEditorView, view);
};
