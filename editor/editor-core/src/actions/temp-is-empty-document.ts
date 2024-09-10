/**
 * Temporary file which extracts function from `editor-common`.
 *
 * Eventually we will deprecate and delete EditorActions. This is here to
 * help decouple it from editor-common
 */
import { type Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Checks if node is an empty paragraph.
 */
export function isEmptyParagraph(node?: Node | null): boolean {
	return !!node && node.type.name === 'paragraph' && !node.childCount;
}

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
