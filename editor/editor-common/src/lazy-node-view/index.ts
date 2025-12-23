// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type { DispatchAnalyticsEvent } from '../analytics';

import { cancelCallback, scheduleCallback } from './lazy-scheduler';
import { LazyNodeView, makeNodePlaceholderId } from './node-view';
import type { LazyNodeViewToDOMConfiguration, NodeViewConstructor } from './types';

export { convertToInlineCss } from './css-helper';

export type { NodeViewConstructor, LazyNodeViewToDOMConfiguration };
export { LazyNodeView };

/**
 * 📢 Public Plugin Key
 *
 * Communication channel between LazyNodeView loader and LazyNodeViewDecorationPlugin.
 */
export const lazyNodeViewDecorationPluginKey = new PluginKey('lazyNodeViewDecoration');

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
	innerDecorations: DecorationSource,
) => NodeView;

/**
 * 📢 Public Type
 *
 * @see {withLazyLoading}
 */
export type LazyLoadingProps<NodeViewOptions> = {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	getNodeViewOptions: () => NodeViewOptions;
	loader: () => Promise<CreateReactNodeViewProps<NodeViewOptions>>;
	nodeName: string;
};

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Caches loaded node view factory functions
 */
type NodeViewFactoryFn = (
	node: PMNode,
	view: EditorView,
	getPos: () => number | undefined,
	decorations: readonly Decoration[],
	innerDecorations: DecorationSource,
) => NodeView;

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Controls which node was scheduled to load the original node view code
 */
const requestedNodesPerEditorView: WeakMap<
	EditorView,
	Map<string, Promise<NodeViewFactoryFn>>
> = new WeakMap<EditorView, Map<string, Promise<NodeViewFactoryFn>>>();

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Caches loaded node view factory functions for each editor view
 */
const resolvedNodesPerEditorView: WeakMap<EditorView, Map<string, NodeViewFactoryFn>> = new WeakMap<
	EditorView,
	Map<string, NodeViewFactoryFn>
>();

/**
 * 🧱 Internal: Editor FE Platform
 *
 * Stores editorView -> raf to debounce NodeView updates.
 */
const debounceToEditorViewMap: WeakMap<EditorView, [number | null, Set<string>]> = new WeakMap();

const testOnlyIgnoreLazyNodeViewSet = new WeakSet<EditorView>();
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * 🧱 Internal: Editor FE Platform
 *
 * Used in tests to prevent lazy node view being replaced by a real node view.
 *
 * This needs to be replaced with proper implementation once LazyNodeView is converted to a plugin.
 *
 * @deprecated DO NOT USE THIS OUTSIDE TESTS.
 */
export function testOnlyIgnoreLazyNodeView(view: EditorView): void {
	testOnlyIgnoreLazyNodeViewSet.add(view);
}

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
}: LazyLoadingProps<Options>): NodeViewConstructor => {
	return (
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		decorations: readonly Decoration[],
		innerDecorations: DecorationSource,
	): NodeView => {
		let requestedNodes: Map<string, Promise<NodeViewFactoryFn>> | undefined =
			requestedNodesPerEditorView.get(view);
		if (!requestedNodes) {
			requestedNodes = new Map();
			requestedNodesPerEditorView.set(view, requestedNodes);
		}

		const resolvedNodeViews = resolvedNodesPerEditorView.get(view);
		if (!resolvedNodeViews) {
			resolvedNodesPerEditorView.set(view, new Map());
		}

		const wasAlreadyRequested = requestedNodes.has(nodeName);
		if (wasAlreadyRequested) {
			const resolvedNodeView = resolvedNodeViews?.get(nodeName);
			if (resolvedNodeView && !testOnlyIgnoreLazyNodeViewSet.has(view)) {
				return resolvedNodeView(node, view, getPos, decorations, innerDecorations);
			}

			return new LazyNodeView(node, view, getPos, decorations);
		}

		const loaderPromise = loader().then((nodeViewFuncModule) => {
			const nodeViewFunc: NodeViewFactoryFn = (
				node,
				view,
				getPos,
				decorations,
				innerDecorations,
			) => {
				const nodeView = nodeViewFuncModule(
					node,
					view,
					getPos,
					decorations,
					getNodeViewOptions,
					innerDecorations,
				);
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = nodeView.dom as HTMLElement;
				dom.setAttribute('data-vc', `editor-lnv-loaded--${node.type.name}`);

				const pos = getPos();
				if (pos !== undefined) {
					dom.setAttribute(
						'data-editor-lnv-placeholder-replace',
						makeNodePlaceholderId(node.type.name, pos),
					);
				}

				return nodeView;
			};

			resolvedNodesPerEditorView.get(view)?.set(nodeName, nodeViewFunc);

			/**
			 * Triggering lazyNodeViewDecoration plugin to apply decorations
			 * to nodes with newly loaded NodeViews.
			 */
			const [callbackId, nodeTypes] = debounceToEditorViewMap.get(view) || [null, new Set()];
			if (callbackId) {
				cancelCallback(callbackId);
			}

			nodeTypes.add(node.type.name);
			const nextCallbackId = scheduleCallback(() => {
				debounceToEditorViewMap.set(view, [null, new Set()]);
				const tr = view.state.tr;
				tr.setMeta(lazyNodeViewDecorationPluginKey, { type: 'add', nodeTypes });
				view.dispatch(tr);
			});

			debounceToEditorViewMap.set(view, [nextCallbackId, nodeTypes]);
			/**
			 * END triggering LazyNodeViewDecoration plugin
			 */

			return nodeViewFunc;
		});

		requestedNodes.set(nodeName, loaderPromise);

		if (typeof node.type?.spec?.toDOM !== 'function') {
			// TODO: ED-23982 - Analytics
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

		return new LazyNodeView(node, view, getPos, decorations);
	};
};
