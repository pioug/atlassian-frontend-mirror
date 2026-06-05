import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

/**
 * Checks if the node before selection is a media node
 * If there is no node before, checks the node before the parent node
 * Includes media, mediaInline, mediaGroup, mediaSingle
 * @param $pos The position of the selection
 * @param state The editor state
 */
export const isNodeBeforeMediaNode = ($pos: ResolvedPos, state: EditorState): boolean => {
	let nodeBefore = $pos.nodeBefore;
	if (!nodeBefore) {
		const depthOfParent = $pos.depth - 1 || 1;
		const parentNode = findParentNodeOfType([
			state.schema.nodes[`${$pos.node(depthOfParent).type.name}`],
		])(state.selection);

		const resolvedPosOfParentNode = parentNode ? state.tr.doc.resolve(parentNode.pos) : undefined;

		const nodeBeforeParent =
			resolvedPosOfParentNode && resolvedPosOfParentNode.pos < state.doc.nodeSize
				? resolvedPosOfParentNode.nodeBefore
				: undefined;

		if (nodeBeforeParent) {
			nodeBefore = nodeBeforeParent;
		}
	}

	if (nodeBefore) {
		return ['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(nodeBefore.type.name);
	}

	return false;
};
