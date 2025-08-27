import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { transformNodeToTargetType } from './transforms/transformNodeToTargetType';
import type { FormatNodeTargetType } from './transforms/types';

/**
 * Formats the current node or selection to the specified target type
 * @param currentNode - The current node
 * @param targetType - The target node type to convert to
 */
export const formatNode = (
	currentNode: PMNode,
	targetType: FormatNodeTargetType,
): EditorCommand => {
	return ({ tr }) => {
		const { selection } = tr;

		try {
			return transformNodeToTargetType(tr, currentNode, selection.from, targetType);
		} catch (e) {
			return null;
		}
	};
};
