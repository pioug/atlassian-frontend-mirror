import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { CellSelection } from '@atlaskit/editor-tables/cell-selection';

export const cellSelectionNodesBetween = (
	selection: CellSelection,
	doc: Node,
	f: (node: Node, pos: number, parent: Node | null, index: number) => void | boolean,
	startPos?: number,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	selection.forEachCell((cell, cellPos) => {
		doc.nodesBetween(cellPos, cellPos + cell.nodeSize, f, startPos);
	});
};
