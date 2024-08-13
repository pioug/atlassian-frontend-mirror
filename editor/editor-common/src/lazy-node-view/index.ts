import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { DispatchAnalyticsEvent } from '../analytics';

import { LazyNodeView } from './node-view';
import { queueReplaceNodeViews } from './replace-node-views';
import type { NodeViewConstructor } from './types';

export { convertToInlineCss } from './css-helper';

export type { NodeViewConstructor };
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
 *
 * Controls which node was scheduled to load the original node view code
 */
const requestedNodesPerEditorView: WeakMap<EditorView, Set<string>> = new WeakMap<
	EditorView,
	Set<string>
>();

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
		let requestedNodes: Set<string> | undefined = requestedNodesPerEditorView.get(view);
		if (!requestedNodes) {
			(requestedNodes = new Set()), requestedNodesPerEditorView.set(view, requestedNodes);
		}

		const wasAlreadyRequested = requestedNodes.has(nodeName);
		if (wasAlreadyRequested) {
			return new LazyNodeView(node, view, getPos);
		}

		requestedNodes.add(nodeName);

		loader().then((nodeViewFuncModule) => {
			const nodeViewFunc = (
				node: PMNode,
				view: EditorView,
				getPos: () => number | undefined,
				decorations: readonly Decoration[],
			) => {
				return nodeViewFuncModule(node, view, getPos, decorations, getNodeViewOptions);
			};

			queueReplaceNodeViews(view, {
				nodeName,
				nodeViewFunc,
			});
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
