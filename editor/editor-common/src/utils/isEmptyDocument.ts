import type { Node } from '@atlaskit/editor-prosemirror/model';

import { isEmptyParagraph } from './isEmptyParagraph';

/**
 * Checks if a node looks like an empty document
 */
export function isEmptyDocument(node: Node): boolean {
	const nodeChild = node.content.firstChild;
	if (node.childCount !== 1 || !nodeChild) {
		return false;
	}
	return isEmptyParagraph(nodeChild);
}
