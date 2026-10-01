import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection/gap-cursor/selection';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * A preview is rendered by the live view's own node views, which read `getPos()` against
 * `view.state.doc` for both layout (`isTableNested`) and writes (`scaleTable` builds attribute
 * steps at `getPos() + 1`). Handing them live positions makes the layout correct but points the
 * writes at unrelated live nodes, so give them a view whose document *is* the preview instead.
 *
 * With `$sourcePos` (the node's position in the doc it came from) the node is swapped into a copy
 * of its real top-level ancestor, so a table inside an expand still resolves as nested.
 *
 * Returns `null` when the node cannot be a top-level child (e.g. a bare `tableCell`), in which
 * case the caller falls back to the live view and the previous stubbed positions.
 */
export function createEditorProxy(
	liveView: EditorView,
	rootNode: PMNode,
	$sourcePos?: ResolvedPos,
): { editorProxy: EditorView; rootPos: number } | null {
	const liveState = liveView.state;
	const createDoc = (topLevel: PMNode) =>
		liveState.schema.topNodeType.createChecked(null, topLevel);

	let previewDoc: PMNode;
	let rootPos = 0;
	try {
		if ($sourcePos && $sourcePos.depth > 0 && $sourcePos.nodeAfter?.type === rootNode.type) {
			let topLevel = rootNode;
			for (let depth = $sourcePos.depth; depth > 0; depth--) {
				const ancestor = $sourcePos.node(depth);
				topLevel = ancestor.copy(ancestor.content.replaceChild($sourcePos.index(depth), topLevel));
			}
			previewDoc = createDoc(topLevel);
			rootPos = $sourcePos.pos - $sourcePos.before(1);
		} else {
			previewDoc = createDoc(rootNode);
		}
	} catch {
		return null;
	}

	// A gap cursor just before the node selects nothing, so the table's node view doesn't render
	// as selected or show its controls.
	const previewSelection = new GapCursorSelection(previewDoc.resolve(rootPos), Side.LEFT);
	// Proxy rather than `EditorState.create` so plugin state is shared as-is: re-initialising
	// every plugin per preview would be costly and re-runs their side effects.
	let stateProxy: EditorState = new Proxy(liveState, {
		get(target, prop, receiver) {
			if (prop === 'doc') {
				return previewDoc;
			}
			if (prop === 'selection') {
				return previewSelection;
			}
			return Reflect.get(target, prop, receiver);
		},
	});

	const editorProxy = new Proxy(liveView, {
		get(target, prop, receiver) {
			if (prop === 'state') {
				return stateProxy;
			}
			if (prop === 'dispatch') {
				// Keep the transaction inside the preview. It was built against `previewDoc`, so
				// applying it to the live state would corrupt the real document.
				return (tr: Transaction) => {
					try {
						stateProxy = stateProxy.apply(tr);
					} catch {
						// A preview is throwaway; a failed self-update is not worth surfacing.
					}
				};
			}
			const value = Reflect.get(target, prop, receiver);
			return typeof value === 'function' ? value.bind(target) : value;
		},
	}) as EditorView;
	return { editorProxy, rootPos };
}
