import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns true if any cell in the first row of the table has a colwidth attribute set.
 *
 * Used by both the editor (as `hasTableColumnBeenResized`) and the renderer (as `hasColWidths`)
 * to determine whether a table has had its columns manually resized.
 */
export const hasTableColumnBeenResized = (tableNode: PMNode): boolean => {
	const firstRow = tableNode.content.firstChild;
	if (!firstRow) {
		return false;
	}
	for (let i = 0; i < firstRow.childCount; i++) {
		if (firstRow.child(i).attrs.colwidth) {
			return true;
		}
	}
	return false;
};
