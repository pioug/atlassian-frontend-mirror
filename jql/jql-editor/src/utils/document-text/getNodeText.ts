import { type Node } from '@atlaskit/editor-prosemirror/model';

import { getFragmentText } from './getFragmentText';

/**
 * Get all text between positions `from` and `to` with a newline char between block nodes.
 */
export const getNodeText = (node: Node, from: number, to: number): string => {
	return getFragmentText(node.content, from, to);
};
