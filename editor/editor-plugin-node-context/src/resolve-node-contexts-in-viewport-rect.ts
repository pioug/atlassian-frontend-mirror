import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorNodeContext, EditorViewportRect } from './nodeContextPluginType';
import { resolveNodeContextAtDocumentPosition } from './resolve-node-context-at-document-position';

const isValidViewportRect = (rect: EditorViewportRect): boolean =>
	Number.isFinite(rect.x) &&
	Number.isFinite(rect.y) &&
	Number.isFinite(rect.width) &&
	Number.isFinite(rect.height) &&
	rect.width >= 0 &&
	rect.height >= 0;

const intersectsViewportRect = (bounds: DOMRect, rect: EditorViewportRect): boolean =>
	bounds.left <= rect.x + rect.width &&
	bounds.right >= rect.x &&
	bounds.top <= rect.y + rect.height &&
	bounds.bottom >= rect.y;

/**
 * Returns the rendered bounds for the exact ProseMirror node at `pos`.
 * Custom node views that do not expose an Element are intentionally skipped.
 */
const getRenderedNodeBounds = (editorView: EditorView, pos: number): DOMRect | undefined => {
	const domNode = editorView.nodeDOM(pos);

	return domNode instanceof Element ? domNode.getBoundingClientRect() : undefined;
};

/**
 * Resolve every meaningful atom or block whose rendered bounds intersect a
 * viewport rectangle. Targets are deduplicated and retain document order.
 */
export const resolveNodeContextsInViewportRect = (
	editorView: EditorView,
	rect: EditorViewportRect,
): EditorNodeContext[] => {
	if (!isValidViewportRect(rect)) {
		return [];
	}

	const { doc } = editorView.state;
	const contexts = new Map<number, EditorNodeContext>();

	doc.descendants((node, pos) => {
		if (!node.isBlock && !(node.isAtom && !node.isText)) {
			return;
		}

		const context = resolveNodeContextAtDocumentPosition(doc, { node, pos }, pos + 1);
		if (!context || contexts.has(context.pos)) {
			return;
		}

		const bounds = getRenderedNodeBounds(editorView, context.pos);
		if (bounds && intersectsViewportRect(bounds, rect)) {
			contexts.set(context.pos, context);
		}
	});

	return Array.from(contexts.values());
};
