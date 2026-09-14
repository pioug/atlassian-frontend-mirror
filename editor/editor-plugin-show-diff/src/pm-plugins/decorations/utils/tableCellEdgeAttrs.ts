import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TableMap } from '@atlaskit/editor-tables/table-map';

export type CellEdgeAttrs = {
	reachesBottom: boolean;
	reachesLeft: boolean;
	reachesRight: boolean;
	reachesTop: boolean;
};

export const getTableTopAndBottomCellEdgeAttrs = (
	tableMap: TableMap,
): Map<number, CellEdgeAttrs> => {
	const edgeAttrsByOffset = new Map<number, CellEdgeAttrs>();
	const addLogicalRow = (offsets: number[], edge: 'bottom' | 'top'): void => {
		offsets.forEach((offset, columnIndex) => {
			const edgeAttrs = edgeAttrsByOffset.get(offset) ?? {
				reachesBottom: false,
				reachesLeft: false,
				reachesRight: false,
				reachesTop: false,
			};

			edgeAttrs.reachesBottom ||= edge === 'bottom';
			edgeAttrs.reachesLeft ||= columnIndex === 0;
			edgeAttrs.reachesRight ||= columnIndex === tableMap.width - 1;
			edgeAttrs.reachesTop ||= edge === 'top';
			edgeAttrsByOffset.set(offset, edgeAttrs);
		});
	};

	const topRow = tableMap.mapByRow[0];
	const bottomRow = tableMap.mapByRow[tableMap.height - 1];

	if (topRow) {
		addLogicalRow(topRow, 'top');
	}
	if (bottomRow) {
		addLogicalRow(bottomRow, 'bottom');
	}

	return edgeAttrsByOffset;
};

export const getRowCellEdgeAttrs = ({
	edgeAttrsByOffset,
	rowNode,
	rowStart,
}: {
	edgeAttrsByOffset: ReadonlyMap<number, CellEdgeAttrs>;
	rowNode: PMNode;
	rowStart: number;
}): Array<CellEdgeAttrs | undefined> => {
	const cellEdgeAttrs: Array<CellEdgeAttrs | undefined> = [];

	rowNode.content.forEach((cellNode, cellOffset) => {
		if (cellNode.type.name !== 'tableCell' && cellNode.type.name !== 'tableHeader') {
			return;
		}

		cellEdgeAttrs.push(edgeAttrsByOffset.get(rowStart + 1 + cellOffset));
	});

	return cellEdgeAttrs;
};

export const applyCellEdgeAttrs = (cell: HTMLElement, edgeAttrs?: CellEdgeAttrs): void => {
	if (!edgeAttrs) {
		return;
	}

	if (edgeAttrs.reachesTop) {
		cell.setAttribute('data-reaches-top', 'true');
	}
	if (edgeAttrs.reachesBottom) {
		cell.setAttribute('data-reaches-bottom', 'true');
	}
	if (edgeAttrs.reachesLeft) {
		cell.setAttribute('data-reaches-left', 'true');
	}
	if (edgeAttrs.reachesRight) {
		cell.setAttribute('data-reaches-right', 'true');
	}
};

export const applyTableCellEdgeAttrs = ({
	element,
	tableNode,
}: {
	element: HTMLElement;
	tableNode: PMNode;
}): void => {
	try {
		const table = element instanceof HTMLTableElement ? element : element.querySelector('table');

		if (!(table instanceof HTMLTableElement)) {
			return;
		}

		const tableMap = TableMap.get(tableNode);
		const cells = Array.from(table.rows).flatMap((row) => Array.from(row.cells));
		const cellsByOffset = new Map<number, HTMLTableCellElement>();
		let cellIndex = 0;

		tableNode.content.forEach((rowNode, rowStart) => {
			rowNode.content.forEach((cellNode, cellOffset) => {
				if (cellNode.type.name === 'tableCell' || cellNode.type.name === 'tableHeader') {
					const cell = cells[cellIndex];
					cellIndex++;

					if (cell) {
						cellsByOffset.set(rowStart + 1 + cellOffset, cell);
					}
				}
			});
		});

		getTableTopAndBottomCellEdgeAttrs(tableMap).forEach((edgeAttrs, offset) => {
			const cell = cellsByOffset.get(offset);

			if (cell) {
				applyCellEdgeAttrs(cell, edgeAttrs);
			}
		});
	} catch {
		// Table structure can be transient while widget DOM is being assembled.
	}
};
