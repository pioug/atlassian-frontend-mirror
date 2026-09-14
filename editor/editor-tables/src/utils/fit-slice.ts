// Utilities used for copy/paste handling.
//
// This module handles pasting cell content into tables, or pasting
// anything into a cell selection, as replacing a block of cells with
// the content of the selection. When pasting cells into a cell, that
// involves placing the block of pasted content so that its top left
// aligns with the selection cell, optionally extending the table to
// the right or bottom to make sure it is large enough. Pasting into a
// cell selection is different, here the cells in the selection are
// clipped to the selection's rectangle, optionally repeating the
// pasted cells when they are smaller than the selection.

import type { NodeType, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';

export function fitSlice(nodeType: NodeType, slice: Slice): PMNode {
	const node = nodeType.createAndFill();
	if (!node) {
		throw new Error(`fitSlice: unable to create node`);
	}
	const tr = new Transform(node).replace(0, node.content.size, slice);
	return tr.doc;
}
