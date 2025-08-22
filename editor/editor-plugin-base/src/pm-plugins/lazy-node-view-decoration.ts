import { lazyNodeViewDecorationPluginKey } from '@atlaskit/editor-common/lazy-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

const LAZY_NODE_VIEW_DECORATION_CLASS = '__lazy-node-view-decoration__';

type LazyNodeViewPluginState = {
	decorations: DecorationSet;
};

type LoadedNodeTypes = Set<string>;

type LazyNodeViewPluginActions =
	| { nodeTypes: LoadedNodeTypes; type: 'add'; }
	| { type: 'clear' }
	| undefined;

/**
 * Plugin is used to force re-render NodeViews for a specific node type
 * when LazyNodeView finishes loading the real NodeView.
 *
 * This is achieved by applying a decoration to a node.
 *
 * It's a blessed way that Marijn suggested multiple times in ProseMirror Discuss:
 * – https://discuss.prosemirror.net/t/force-nodes-of-specific-type-to-re-render/2480
 */
export function createLazyNodeViewDecorationPlugin() {
	return new SafePlugin<LazyNodeViewPluginState>({
		key: lazyNodeViewDecorationPluginKey,
		state: {
			init: () => {
				return { decorations: DecorationSet.empty, nodeTypes: [] };
			},
			apply(tr, _oldState, newState) {
				const actionPayload = tr.getMeta(
					lazyNodeViewDecorationPluginKey,
				) as LazyNodeViewPluginActions;

				const pluginState = lazyNodeViewDecorationPluginKey.getState(
					newState,
				) as LazyNodeViewPluginState;

				if (actionPayload?.type === 'add' && actionPayload.nodeTypes.size) {
					const decorations: Array<Decoration> = [];

					tr.doc.nodesBetween(0, tr.doc.nodeSize - 2, (node, pos) => {
						if (actionPayload.nodeTypes.has(node.type.name)) {
							decorations.push(
								Decoration.node(pos, pos + node.nodeSize, {
									class: LAZY_NODE_VIEW_DECORATION_CLASS,
								}),
							);
						}
					});

					return {
						decorations: DecorationSet.create(tr.doc, decorations),
					};
				}

				if (actionPayload?.type === 'clear') {
					return {
						decorations: DecorationSet.empty,
					};
				}

				if (tr.docChanged) {
					return {
						decorations: pluginState?.decorations.map(tr.mapping, tr.doc),
					};
				}

				return pluginState;
			},
		},

		props: {
			decorations: (state: EditorState) => {
				return lazyNodeViewDecorationPluginKey.getState(state)?.decorations;
			},
		},

		view(editorView) {
			return {
				update() {
					/**
					 * After view update can clean up decorations...
					 */
					const pluginState = lazyNodeViewDecorationPluginKey.getState(editorView.state);
					if (pluginState.decorations !== DecorationSet.empty) {
						const tr = editorView.state.tr;
						tr.setMeta(lazyNodeViewDecorationPluginKey, { type: 'clear' });
						editorView.dispatch(tr);
					}
				},
			};
		},
	});
}
