import { findNodePosByLocalIds } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { isSupportedBlockNode } from './utils';

/**
 * Resolves the node to annotate for a `localId`: the node itself when it accepts an annotation
 * (allows the mark, or is a supported block node), otherwise its closest accepting ancestor.
 * Returns undefined when nothing in the ancestor chain accepts one.
 *
 * Kept in sync with the renderer implementation so both sides resolve the same node.
 */
export const resolveAnnotatableTargetFromLocalId = (
	state: EditorState,
	localId: string,
	opts: { supportedBlockNodes?: string[] },
): { node: Node; pos: number } | undefined => {
	const { supportedBlockNodes } = opts;

	const matches = findNodePosByLocalIds(state, [localId]);
	if (matches.length === 0) {
		return undefined;
	}

	const annotationMarkType = state.schema.marks.annotation;
	const nodeAcceptsAnnotation = (node: Node): boolean =>
		node.type.allowsMarkType(annotationMarkType) || isSupportedBlockNode(node, supportedBlockNodes);

	const { node, pos } = matches[0];

	if (nodeAcceptsAnnotation(node)) {
		return { node, pos };
	}

	// Ancestors only — never descendants.
	const $pos = state.doc.resolve(pos);
	for (let depth = $pos.depth; depth >= 0; depth--) {
		const ancestor = $pos.node(depth);
		if (nodeAcceptsAnnotation(ancestor)) {
			return { node: ancestor, pos: depth === 0 ? 0 : $pos.before(depth) };
		}
	}

	return undefined;
};
