import type { Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Checks if node is an empty paragraph.
 */
export function isEmptyParagraph(node?: Node | null): boolean {
	return !!node && node.type.name === 'paragraph' && !node.childCount;
}
