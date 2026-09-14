import { toJSON as nodeToJSON } from '@atlaskit/editor-json-transformer/toJSON';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { EditorNodeContext } from './nodeContextPluginType';

type EditorNodeTarget = { node: PMNode; pos: number };

const clamp = (value: number, minimum: number, maximum: number): number =>
	Math.max(minimum, Math.min(value, maximum));

const hasLocalId = (node: PMNode): boolean =>
	typeof node.attrs.localId === 'string' && node.attrs.localId.length > 0;

/**
 * Resolves a document position to the nearest meaningful node, preferring a
 * local-ID-bearing atom or block while retaining the closest block as a fallback.
 */
const resolveMeaningfulTargetAtDocumentPosition = (
	doc: PMNode,
	directTarget: EditorNodeTarget | undefined,
	position: number,
): EditorNodeTarget | undefined => {
	if (directTarget && hasLocalId(directTarget.node)) {
		return directTarget;
	}

	const resolvedPosition = doc.resolve(clamp(position, 0, doc.content.size));
	let closestTarget = directTarget;

	for (let depth = resolvedPosition.depth; depth > 0; depth--) {
		const node = resolvedPosition.node(depth);
		if (!node.isBlock) {
			continue;
		}

		const nodePosition = resolvedPosition.before(depth);
		closestTarget ??= { node, pos: nodePosition };
		if (hasLocalId(node)) {
			return { node, pos: nodePosition };
		}
	}

	return closestTarget;
};

const toEditorNodeContext = ({ node, pos }: EditorNodeTarget): EditorNodeContext => {
	const localId = node.attrs.localId;

	return {
		adf: nodeToJSON(node),
		...(typeof localId === 'string' && localId.length > 0 ? { localId } : {}),
		nodeType: node.type.name,
		pos,
	};
};

/** Resolve a document position to its nearest meaningful editor node. */
export const resolveNodeContextAtDocumentPosition = (
	doc: PMNode,
	directTarget: EditorNodeTarget | undefined,
	position: number,
): EditorNodeContext | undefined => {
	const target = resolveMeaningfulTargetAtDocumentPosition(doc, directTarget, position);

	return target ? toEditorNodeContext(target) : undefined;
};
