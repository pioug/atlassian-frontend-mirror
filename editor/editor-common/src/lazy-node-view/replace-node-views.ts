import debounce from 'lodash/debounce';
import memoize from 'lodash/memoize';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CacheLoadedReactNodeViews, LoadedReactNodeViews, NodeViewConstructor } from './types';

/**
 * 🧱 Internal: Editor FE Platform
 */
const isFirefox = /gecko\/\d/i.test(navigator.userAgent);

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Replaces the node views in a ProseMirror editor with lazy-loaded node views.
 *
 * This function is used to update the `nodeViews` property of the `EditorView` after lazy-loaded
 * node views have been loaded.
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
 * replaceNodeViews(cache, view);
 */
const replaceNodeViews = (cache: CacheLoadedReactNodeViews, view: EditorView) => {
	const loadedNodeviews: LoadedReactNodeViews | undefined = cache.get(view);

	if (!loadedNodeviews || Object.keys(loadedNodeviews).length === 0) {
		return;
	}
	const nodeViewsToReplace = { ...loadedNodeviews };

	// Make sure the cache is cleaned
	// From here, we will access the loaded node views by lexical scope
	cache.set(view, {});

	const callback = () => {
		const currentNodeViews = view.props.nodeViews;

		const nextNodeViews = {
			...currentNodeViews,
			...nodeViewsToReplace,
		};

		view.setProps({
			nodeViews: nextNodeViews,
		});
	};
	// eslint-disable-next-line compat/compat
	const idle = window.requestIdleCallback;

	/*
	 * For reasons that goes beyond my knowledge
	 * some Firefox versions aren't calling the requestIdleCallback.
	 *
	 * So, we need this check to make sure we are using the requestAnimationFrame for Firefox
	 */
	if (isFirefox || typeof idle !== 'function') {
		window.requestAnimationFrame(callback);
	} else {
		idle(callback, { timeout: 2000 });
	}
};

/**
 * 🧱 Internal: Editor FE Platform
 */
const loadedPerEditorView: CacheLoadedReactNodeViews = new WeakMap<
	EditorView,
	LoadedReactNodeViews
>();

/**
 * 🧱 Internal: Editor FE Platform
 * Based on https://github.com/lodash/lodash/issues/2403#issuecomment-1706130395
 *
 * Creates a debounced function that delays invoking the provided function until after a specified
 * wait time has elapsed since the last time the debounced function was invoked. Additionally, the
 * debounced function is memoized so that the same function instance is used for each unique set
 * of arguments based on the resolver.
 *
 * This is particularly useful in scenarios where you want to debounce function calls while ensuring
 * that each unique input combination receives its own debounced function instance. It's a combination
 * of lodash's `debounce` and `memoize`.
 *
 * @template T
 * @param {T} func - The function to debounce.
 * @param {number} [wait=0] - The number of milliseconds to delay.
 * @param {Object} [options] - The options object to pass to `debounce`.
 * @param {Function} [resolver] - The function to resolve the cache key for memoization.
 * @returns {Function} A new debounced and memoized function.
 *
 * @example
 * const debouncedFunction = memoizeDebounce(myFunction, 300, { leading: true }, myResolver);
 * debouncedFunction(arg1, arg2);
 */
function memoizeDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
	func: T,
	wait = 0,
	options?: Parameters<typeof debounce<T>>[2],
	resolver?: Parameters<
		typeof memoize<(...args: Parameters<T>) => ReturnType<typeof debounce<T>>>
	>[1],
) {
	const mem = memoize<(...args: Parameters<T>) => ReturnType<typeof debounce<T>>>(function () {
		return debounce<T>(func, wait, options);
	}, resolver);

	return function (...args: Parameters<T>) {
		return mem(...args)(...args);
	};
}

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Debounced and memoized version of `replaceNodeViews`.
 *
 * This function is designed to update the `nodeViews` property of an `EditorView` after a
 * period of inactivity (debounce), ensuring that multiple rapid updates do not occur in quick
 * succession. It uses lodash's `debounce` to handle the debouncing.
 *
 * Memoization is crucial here to ensure that each `EditorView` instance has its own opportunity
 * to update the node views. Without memoization, if you have multiple `EditorView` instances on
 * the same page, only one instance would potentially call `view.setProps`, which could lead to
 * incorrect or missing updates in other `EditorView` instances. By memoizing the debounced function,
 * we ensure that each `EditorView` maintains its own debounced update logic.
 *
 * @param {CacheLoadedReactNodeViews} cache - A WeakMap that stores the loaded node views for each
 *        `EditorView`. The key is the `EditorView`, and the value is a record of node type names
 *        to their corresponding `NodeViewConstructor`.
 * @param {EditorView} view - The ProseMirror `EditorView` instance whose `nodeViews` property
 *        needs to be updated.
 *
 * This function is typically not called directly. Instead, it is invoked through `queueReplaceNodeViews`,
 * which handles adding node views to the cache and triggering this debounced update.
 */
export const debouncedReplaceNodeviews = memoizeDebounce(
	replaceNodeViews,
	0,
	/**
	 * Use the default debounce options:
	 * {leading: false, trailing: true}
	 */
	undefined,
	(cache: CacheLoadedReactNodeViews, view: EditorView) => {
		/**
		 * EditorView is a singleton.
		 * There is only one instance per Editor.
		 */
		return view;
	},
);

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
