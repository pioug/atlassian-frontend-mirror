import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type ContentNodeWithPos, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables';

export const getSelectedNode = (selection: Selection): ContentNodeWithPos | undefined => {
	if (selection instanceof NodeSelection) {
		return {
			node: selection.node,
			pos: selection.$from.pos,
			start: 0, // ?
			depth: selection.$from.depth,
		};
	} else if (selection instanceof CellSelection) {
		const tableSelected = findParentNodeOfType(selection.$from.doc.type.schema.nodes.table)(
			selection,
		);
		return tableSelected;
	} else if (selection instanceof TextSelection) {
		const { blockquote, bulletList, orderedList, taskList, codeBlock, paragraph, heading } =
			selection.$from.doc.type.schema.nodes;

		const quoteSelected = findParentNodeOfType([blockquote])(selection);
		if (quoteSelected) {
			return quoteSelected;
		}
		const codeBlockSelected = findParentNodeOfType([codeBlock])(selection);
		if (codeBlockSelected) {
			return codeBlockSelected;
		}
		const listSelected = findParentNodeOfType([bulletList, taskList, orderedList])(selection);
		if (listSelected) {
			return listSelected;
		}
		const paragraphOrHeading = findParentNodeOfType([paragraph, heading])(selection);
		if (paragraphOrHeading) {
			return paragraphOrHeading;
		}
	}

	return undefined;
};
