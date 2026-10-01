import { expandedState } from '@atlaskit/editor-common/expand';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode, Fragment, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { contains } from '@atlaskit/editor-prosemirror/utils';
import type { DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { createEditorProxy } from './createEditorProxy';
import { wrapInMarkViews } from './markViews';

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

/** Expand-family nodes whose expanded state lives in a node-keyed WeakMap. */
const EXPAND_TYPES = new Set(['expand', 'nestedExpand']);

/** Tables are the only node views that read and write positions, so only they need a preview. */
const containsTable = (node: PMNode): boolean => {
	const { table } = node.type.schema.nodes;
	// `contains` only checks descendants, so the node itself is checked separately.
	return !!table && (node.type === table || contains(node, table));
};

/**
 * Encapsulates DOM serialization and node view access/creation.
 *
 * Responsible for:
 * - Creating a `DOMSerializer` from the provided schema
 * - Reading `nodeViews` from an `EditorView` (if present) or using an explicit mapping
 * - Preventing node view creation for blocklisted node types
 */
export class NodeViewSerializer {
	private editorView?: EditorViewWithNodeViews;
	private serializer?: DOMSerializer;
	private nodeViews?: Record<string, NodeViewConstructor>;
	private nodeViewBlocklist: Set<string>;

	constructor(params: { blocklist?: string[]; editorView?: EditorView }) {
		if (params?.editorView) {
			this.init({ editorView: params.editorView });
		}
		this.nodeViewBlocklist = new Set(params.blocklist ?? ['paragraph']);
	}

	/**
	 * Initializes or reinitializes the NodeViewSerializer with a new EditorView.
	 * This allows the same serializer instance to be reused across different editor states.
	 */
	init(params: { editorView: EditorView }): void {
		this.serializer = DOMSerializer.fromSchema(params.editorView.state.schema);
		if (isEditorViewWithNodeViews(params.editorView)) {
			this.editorView = params.editorView;
		}
		const nodeViews: Record<string, NodeViewConstructor> =
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(params.editorView as any)?.nodeViews || {};

		this.nodeViews = nodeViews ?? this.editorView?.nodeViews ?? {};
	}

	/**
	 * Appends serialized child nodes to the given contentDOM element.
	 */
	private appendChildNodes(
		children: readonly PMNode[],
		contentDOM: HTMLElement | null | undefined,
		basePos: number = 0,
		editorProxy?: EditorView,
	) {
		// A node's first child sits one position inside it, and each subsequent
		// child is offset by the previous child's `nodeSize`. Tracking this lets nested node
		// views resolve to their real depth instead of every one of them seeing depth 0.
		let childPos = basePos + 1;
		children.forEach((child) => {
			const childNode =
				this.tryCreateNodeViewInner(child, childPos, editorProxy) || this.serializeNode(child);
			if (childNode) {
				contentDOM?.append(childNode);
			}
			childPos += child.nodeSize;
		});
	}

	/**
	 * Attempts to create a node view for the given node.
	 *
	 * Returns `null` when there is no `EditorView`, no constructor for the node type,
	 * or the node type is blocklisted. Otherwise returns the constructed node view instance.
	 *
	 * `$sourcePos` is where the node sits in the doc it came from, so nested tables keep their depth.
	 */
	tryCreateNodeView(
		targetNode: PMNode,
		basePos: number = 0,
		$sourcePos?: ResolvedPos,
	): Node | null {
		if (!this.editorView) {
			return null;
		}
		// The preview becomes the document every nested node view resolves its position against,
		// so positions stay internally consistent.
		const preview =
			fg('platform_editor_ai_show_diff_patch_2') && containsTable(targetNode)
				? createEditorProxy(this.editorView, targetNode, $sourcePos)
				: null;
		return this.tryCreateNodeViewInner(
			targetNode,
			preview?.rootPos ?? basePos,
			preview?.editorProxy,
		);
	}

	private tryCreateNodeViewInner(
		targetNode: PMNode,
		basePos: number = 0,
		editorProxy?: EditorView,
	): Node | null {
		if (!this.editorView) {
			return null;
		}
		const constructor = this.nodeViews?.[targetNode.type.name];
		const isBlocklisted = this.nodeViewBlocklist.has(targetNode.type.name);

		// Do not bail out a blocklisted container when it holds an atomic inline node
		// (e.g. date, status) whose schema toDOM is lossy. Text keeps bailing so the caller
		// renders it inline
		const hasAtomicInlineChild = (node: PMNode): boolean => {
			let found = false;
			node.forEach((child) => {
				if (child.isLeaf && !child.isText) {
					found = true;
				}
			});
			return found;
		};

		const serializeAtomicContainer =
			isExperimentEnabled('platform_editor_show_diff_deleted_nodeview_content') &&
			!targetNode.isInline &&
			hasAtomicInlineChild(targetNode);

		if (isBlocklisted && !serializeAtomicContainer) {
			return null;
		}
		try {
			// No constructor, or (gated) the node's own view is blocklisted: render the toDOM
			// shell and recurse via appendChildNodes so nested atomic inline nodes render via
			// their node views instead of their lossy schema toDOM.
			if (
				!constructor ||
				(isExperimentEnabled('platform_editor_show_diff_deleted_nodeview_content') && isBlocklisted)
			) {
				if (targetNode.isInline) {
					return null;
				}
				const toDOMResult = targetNode.type.spec.toDOM?.(targetNode);
				if (!toDOMResult) {
					return null;
				}
				const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOMResult);
				if (dom instanceof HTMLElement) {
					// Legacy shortcut: a single-child paragraph serializes its inline content
					// directly (no <p> wrapper). Applies only to a non-blocklisted paragraph with
					// no node view
					if (
						!isExperimentEnabled('platform_editor_show_diff_deleted_nodeview_content') &&
						targetNode.type.name === 'paragraph' &&
						targetNode.children.length === 1
					) {
						return this.serializeFragment(targetNode.content);
					}
					this.appendChildNodes(targetNode.children, contentDOM, basePos, editorProxy);
				}
				return this.withMarkViews(targetNode, dom, editorProxy);
			}

			// The expand node view reads `expandedState.get(node) ?? false`, never `attrs.__expanded`.
			// Open the preview so its tables get real layout; an existing entry is the live expand's
			// own state, so leave it alone.
			if (
				EXPAND_TYPES.has(targetNode.type.name) &&
				!expandedState.has(targetNode) &&
				fg('platform_editor_ai_show_diff_patch_2')
			) {
				expandedState.set(targetNode, true);
			}

			// `isTableNested` is `doc.resolve(pos).depth > 0`, so the old hardcoded `0` made nested
			// tables size as top-level. Positions are resolved against the preview document, so
			// they are only meaningful with an editor proxy.
			const view = editorProxy ?? this.editorView;
			const docSize = view.state.doc.content.size;
			const resolvedPos = editorProxy ? Math.max(0, Math.min(basePos, docSize)) : 0;

			const { dom, contentDOM } = constructor(
				targetNode,
				view,
				() => resolvedPos,
				[],
				{} as DecorationSource,
			);
			// Iteratively populate children
			this.appendChildNodes(targetNode.children, contentDOM, basePos, editorProxy);

			return this.withMarkViews(targetNode, dom, editorProxy);
		} catch {
			return null;
		}
	}

	/** Wraps rendered DOM in its marks, rendered against the editor proxy when there is one. */
	private withMarkViews(targetNode: PMNode, nodeDom: Node, editorProxy?: EditorView): Node {
		return wrapInMarkViews(targetNode, nodeDom, {
			nodeViews: this.nodeViews,
			view: editorProxy ?? this.editorView,
		});
	}

	/**
	 * Serializes a node to a DOM `Node` using the schema's `DOMSerializer`.
	 */
	serializeNode(node: PMNode): Node | null {
		if (!this.serializer) {
			throw new Error('NodeViewSerializer must be initialized with init() before use');
		}
		try {
			return this.serializer.serializeNode(node);
		} catch {
			return null;
		}
	}

	/**
	 * Serializes a fragment to a `DocumentFragment` using the schema's `DOMSerializer`.
	 */
	serializeFragment(fragment: Fragment): DocumentFragment | HTMLElement | null {
		if (!this.serializer) {
			throw new Error('NodeViewSerializer must be initialized with init() before use');
		}
		try {
			return this.serializer.serializeFragment(fragment);
		} catch {
			return null;
		}
	}

	/**
	 * Returns a copy of the current node view blocklist.
	 */
	getNodeViewBlocklist(): Set<string> {
		return new Set(this.nodeViewBlocklist);
	}

	/**
	 * Returns a filtered copy of the node view blocklist, excluding specified node types.
	 * @param excludeTypes - Array of node type names to exclude from the blocklist
	 */
	getFilteredNodeViewBlocklist(excludeTypes: string[]): Set<string> {
		const filtered = new Set(this.nodeViewBlocklist);
		excludeTypes.forEach((type) => filtered.delete(type));
		return filtered;
	}
}
