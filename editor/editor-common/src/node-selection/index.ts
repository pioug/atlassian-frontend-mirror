import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';

/**
 * Returns a NodeSelection for the node at `start`.
 * Matches the `platform_editor_block_menu=true` path in block-controls:
 * mediaGroup with a single child → select the child; all others → select the node.
 * Returns false when no node exists at `start`.
 */
export const getNodeSelectionForPos = (doc: PMNode, start: number): NodeSelection | false => {
	const node = doc.nodeAt(start);
	if (!node) {
		return false;
	}

	if (node.type.name === 'mediaGroup' && node.childCount === 1) {
		return new NodeSelection(doc.resolve(start + 1));
	}

	return new NodeSelection(doc.resolve(start));
};

/** Applies a CellSelection to `tr` for the table node at `tableNodePos`. */
export const selectTableNodeAtPos = (tr: Transaction, tableNodePos: number): Transaction => {
	selectTableClosestToPos(tr, tr.doc.resolve(tableNodePos + 1));
	return tr;
};

/**
 * Selects the node at `nodePos` without any plugin-API dependency.
 * Tables use CellSelection; all other nodes use NodeSelection.
 */
export const selectNodeAtPos = (
	tr: Transaction,
	nodePos: number,
	nodeType: string,
): Transaction => {
	if (nodeType === 'table') {
		return selectTableNodeAtPos(tr, nodePos);
	}

	const selection = getNodeSelectionForPos(tr.doc, nodePos);
	if (selection) {
		tr.setSelection(selection);
	}

	return tr;
};
