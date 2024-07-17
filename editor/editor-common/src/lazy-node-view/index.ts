import debounce from 'lodash/debounce';

import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type { DispatchAnalyticsEvent } from '../analytics';

/**
 * 📢 Public Type
 *
 * @see {withLazyLoading}
 */
export type CreateReactNodeViewProps<NodeViewOptions> = (
	node: PMNode,
	view: EditorView,
	getPos: () => number | undefined,
	decorations: readonly Decoration[],
	getNodeViewOptions: () => NodeViewOptions,
) => NodeView;

/**
 * 📢 Public Type
 *
 * @see {withLazyLoading}
 */
export type LazyLoadingProps<NodeViewOptions> = {
	nodeName: string;
	loader: () => Promise<CreateReactNodeViewProps<NodeViewOptions>>;
	getNodeViewOptions: () => NodeViewOptions;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

/**
 * 🧱 Internal: Editor FE Platform
 */
export type NodeViewConstructor = (
	node: PMNode,
	view: EditorView,
	getPos: () => number | undefined,
	decorations: readonly Decoration[],
	innerDecorations: DecorationSource,
) => NodeView;

/**
 * 🧱 Internal: Editor FE Platform
 */
type LoadedReactNodeViews = Record<string, NodeViewConstructor>;

/**
 * 🧱 Internal: Editor FE Platform
 */
type CacheType = WeakMap<EditorView, LoadedReactNodeViews>;

/**
 * 🧱 Internal: Editor FE Platform
 *
 * A cache to store loaded React NodeViews for each EditorView.
 *
 * This cache will help us to avoid any race condition
 * when multiple Editors exist in the same page.
 *
 * @type {CacheType}
 */
const cachePerEditorView: CacheType = new WeakMap<EditorView, LoadedReactNodeViews>();

/**
 * 🧱 Internal: Editor FE Platform
 */
const isFirefox = /gecko\/\d/i.test(navigator.userAgent);

/**
 * 🧱 Internal: Editor FE Platform
 *
 * A NodeView that serves as a placeholder until the actual NodeView is loaded.
 */
class LazyNodeView implements NodeView {
	dom: Node;
	contentDOM?: HTMLElement;

	constructor(node: PMNode, view: EditorView, getPos: () => number | undefined) {
		if (typeof node.type?.spec?.toDOM !== 'function') {
			this.dom = document.createElement('div');
			return;
		}

		const fallback = DOMSerializer.renderSpec(document, node.type.spec.toDOM(node));

		this.dom = fallback.dom;
		this.contentDOM = fallback.contentDOM;

		if (this.dom instanceof HTMLElement) {
			// This attribute is mostly used for debugging purposed
			// It will help us to found out when the node was replaced
			this.dom.setAttribute('data-lazy-node-view', node.type.name);
			// This is used on Libra tests
			// We are using this to make sure all lazy noded were replaced
			// before the test started
			this.dom.setAttribute('data-lazy-node-view-fallback', 'true');
		}
	}
}

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
export const debouncedReplaceNodeviews = debounce((cache: CacheType, view: EditorView) => {
	const loadedNodeviews: Record<string, NodeViewConstructor> | undefined = cache.get(view);

	if (!loadedNodeviews) {
		return;
	}
	cache.delete(view);

	// eslint-disable-next-line compat/compat
	const idle = window.requestIdleCallback;

	/*
	 * For reasons that goes beyond my knowledge
	 * some Firefox versions aren't calling the requestIdleCallback.
	 *
	 * So, we need this check to make sure we use the requestAnimationFrame instead
	 */
	const later = isFirefox || typeof idle !== 'function' ? window.requestAnimationFrame : idle;

	later(() => {
		const currentNodeViews = view.props.nodeViews;

		const nextNodeViews = {
			...currentNodeViews,
			...loadedNodeviews,
		};

		view.setProps({
			nodeViews: nextNodeViews,
		});
	});
});

/**
 * 📢 Public: Any EditorPlugin can use this function
 *
 * Wraps a NodeView constructor with laziness, allowing the NodeView to be loaded only when required.
 *
 * This higher-order function is designed to optimize the loading and rendering performance
 * of ProseMirror editor nodes by deferring the loading of their associated NodeViews until they are actually needed.
 * This is particularly useful for complex or heavy NodeViews, such as tables, table cells, rows, and headers within
 * the ProseMirror editor. By using dynamic imports (with promises), the initial load time of the editor can be significantly
 * reduced, leading to a smoother and faster user experience.
 *
 * The function accepts configuration parameters including the node name, a loader function that dynamically imports
 * the NodeView, and a function to retrieve NodeView options. It returns a NodeViewConstructor that ProseMirror
 * can use when rendering nodes of the specified type.
 *
 * @template NodeViewOptions - The type parameter that describes the shape of the options object for the NodeView.
 * @param {LazyLoadingProps<NodeViewOptions>} params - Configuration parameters for lazy loading.
 * @param {string} params.nodeName - The name of the node (e.g., 'table', 'tableCell', 'tableHeader', 'tableRow') for which the lazy-loaded NodeView is intended.
 * @param {() => Promise<CreateReactNodeViewProps<NodeViewOptions>>} params.loader - A function that, when called, returns a promise that resolves to the actual NodeView constructor. This function typically uses dynamic `import()` to load the NodeView code.
 * @param {() => NodeViewOptions} params.getNodeViewOptions - A function that returns the options to be passed to the NodeView constructor. These options can include dependencies like `portalProviderAPI`, `eventDispatcher`, and others, which are necessary for the NodeView's operation.
 * @param {DispatchAnalyticsEvent} [params.dispatchAnalyticsEvent] - An optional function for dispatching analytics events, which can be used to monitor the performance and usage of the lazy-loaded NodeViews.
 * @returns {NodeViewConstructor} A constructor function for creating a NodeView that ProseMirror can instantiate when it encounters a node of the specified type. This constructor is a lightweight placeholder until the actual NodeView is loaded.
 *
 * @example
 * // Lazy load a table NodeView with specific options
 * const lazyTableView = withLazyLoading({
 *   nodeName: 'table',
 *   loader: () => import('./table').then(module => module.createTableView),
 *   getNodeViewOptions: () => ({
 *     portalProviderAPI,
 *     eventDispatcher,
 *     getEditorContainerWidth,
 *     getEditorFeatureFlags,
 *     dispatchAnalyticsEvent,
 *     pluginInjectionApi,
 *   }),
 * });
 *
 * // Then, use `lazyTableView` in ProseMirror editor setup to enhance 'table' nodes with lazy loading
 */
export const withLazyLoading = <Options>({
	nodeName,
	loader,
	getNodeViewOptions,
	dispatchAnalyticsEvent,
}: LazyLoadingProps<Options>): NodeViewConstructor => {
	const createLazyNodeView = (
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		decorations: readonly Decoration[],
	): NodeView => {
		let cachedMap: Record<string, NodeViewConstructor> | undefined = cachePerEditorView.get(view);
		if (!cachedMap) {
			cachedMap = {};
			cachePerEditorView.set(view, cachedMap);
		}

		const wasAlreadyRequested = cachedMap.hasOwnProperty(nodeName);
		if (wasAlreadyRequested) {
			return new LazyNodeView(node, view, getPos);
		}

		loader().then((nodeViewFuncModule) => {
			cachedMap[nodeName] = (
				node: PMNode,
				view: EditorView,
				getPos: () => number | undefined,
				decorations: readonly Decoration[],
			) => {
				return nodeViewFuncModule(node, view, getPos, decorations, getNodeViewOptions);
			};

			debouncedReplaceNodeviews(cachePerEditorView, view);
		});

		if (typeof node.type?.spec?.toDOM !== 'function') {
			// TODO: Analytics ED-23982
			// dispatchAnalyticsEvent({
			//   action: ACTION.LAZY_NODE_VIEW_ERROR,
			//   actionSubject: ACTION_SUBJECT.LAZY_NODE_VIEW,
			//   eventType: EVENT_TYPE.OPERATIONAL,
			//   attributes: {
			//     nodeName,
			//     error: 'No spec found',
			//   },
			// });
		}

		return new LazyNodeView(node, view, getPos);
	};

	return createLazyNodeView;
};
