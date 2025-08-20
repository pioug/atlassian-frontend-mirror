import { type NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { Schema, Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Utilities for working with ProseMirror node views and DOM serialization within the
 * Show Diff editor plugin.
 *
 * This module centralizes:
 * - Access to the editor's `nodeViews` registry (when available on `EditorView`)
 * - Safe attempts to instantiate a node view for a given node, with a blocklist to
 *   avoid node types that are known to be problematic in this context (e.g. tables)
 * - Schema-driven serialization of nodes and fragments to DOM via `DOMSerializer`
 *
 * The Show Diff decorations leverage this to either render nodes using their
 * corresponding node view implementation, or fall back to DOM serialization.
 */

/**
 * Narrowed `EditorView` that exposes the internal `nodeViews` registry.
 * Many editor instances provide this, but it's not part of the base type.
 */
export interface EditorViewWithNodeViews extends EditorView {
	nodeViews: Record<string, NodeViewConstructor>;
}

/**
 * Type guard to detect whether an `EditorView` exposes a `nodeViews` map.
 */
export function isEditorViewWithNodeViews(view: EditorView): view is EditorViewWithNodeViews {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (view as any).nodeViews !== undefined;
}

/**
 * Encapsulates DOM serialization and node view access/creation.
 *
 * Responsible for:
 * - Creating a `DOMSerializer` from the provided schema
 * - Reading `nodeViews` from an `EditorView` (if present) or using an explicit mapping
 * - Preventing node view creation for blocklisted node types
 */
export class NodeViewSerializer {
	private serializer: DOMSerializer;
	private editorView?: EditorViewWithNodeViews;
	private nodeViews: Record<string, NodeViewConstructor>;
	private nodeViewBlocklist: Set<string>;

	constructor(params: {
		schema: Schema;
		editorView?: EditorView;
		nodeViews?: Record<string, NodeViewConstructor>;
		blocklist?: string[];
	}) {
		this.serializer = DOMSerializer.fromSchema(params.schema);
		if (params.editorView && isEditorViewWithNodeViews(params.editorView)) {
			this.editorView = params.editorView;
		}
		this.nodeViews = params.nodeViews ?? this.editorView?.nodeViews ?? {};
		this.nodeViewBlocklist = new Set(params.blocklist ?? ['tableRow', 'table', 'paragraph']);
	}

	/**
	 * Attempts to create a node view for the given node.
	 *
	 * Returns `null` when there is no `EditorView`, no constructor for the node type,
	 * or the node type is blocklisted. Otherwise returns the constructed node view instance.
	 */
	tryCreateNodeView(targetNode: PMNode) {
		if (!this.editorView) {
			return null;
		}
		const constructor = this.nodeViews[targetNode.type.name];
		if (!constructor) {
			return null;
		}
		if (this.nodeViewBlocklist.has(targetNode.type.name)) {
			return null;
		}
		return constructor(targetNode, this.editorView, () => 0, [], {} as DecorationSource);
	}

	/**
	 * Serializes a node to a DOM `Node` using the schema's `DOMSerializer`.
	 */
	serializeNode(node: PMNode) {
		return this.serializer.serializeNode(node);
	}

	/**
	 * Serializes a fragment to a `DocumentFragment` using the schema's `DOMSerializer`.
	 */
	serializeFragment(fragment: Fragment) {
		return this.serializer.serializeFragment(fragment);
	}
}
