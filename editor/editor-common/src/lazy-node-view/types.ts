import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

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
export type LoadedReactNodeViews = Record<string, NodeViewConstructor>;

/**
 * 🧱 Internal: Editor FE Platform
 */
export type CacheLoadedReactNodeViews = WeakMap<EditorView, LoadedReactNodeViews>;
