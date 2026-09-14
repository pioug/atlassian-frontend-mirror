import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorNodeContext, EditorViewportPoint } from './nodeContextPluginType';
import { resolveNodeContextAtDocumentPosition } from './resolve-node-context-at-document-position';

/** Resolve one viewport point to its nearest meaningful editor node. */
export const resolveNodeContextAtCoords = (
	editorView: EditorView,
	point: EditorViewportPoint,
): EditorNodeContext | undefined => {
	const positionAtCoords = editorView.posAtCoords({ left: point.x, top: point.y });
	if (!positionAtCoords) {
		return undefined;
	}

	const { doc } = editorView.state;
	const directNode = positionAtCoords.inside >= 0 ? doc.nodeAt(positionAtCoords.inside) : undefined;
	const directTarget =
		directNode?.isAtom && !directNode.isText
			? { node: directNode, pos: positionAtCoords.inside }
			: undefined;
	const resolvedPosition =
		positionAtCoords.inside >= 0 && positionAtCoords.inside < doc.content.size
			? positionAtCoords.inside + 1
			: positionAtCoords.pos;

	return resolveNodeContextAtDocumentPosition(doc, directTarget, resolvedPosition);
};
