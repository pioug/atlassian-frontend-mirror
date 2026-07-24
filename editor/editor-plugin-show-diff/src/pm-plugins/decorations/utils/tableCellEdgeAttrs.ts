import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TableMap } from '@atlaskit/editor-tables/table-map';

export type CellEdgeAttrs = {
	reachesBottom: boolean;
	reachesLeft: boolean;
	reachesRight: boolean;
	reachesTop: boolean;
};

export const getRowCellEdgeAttrs = ({
	rowNode,
	rowStart,
	tableMap,
}: {
	rowNode: PMNode;
	rowStart: number;
	tableMap: TableMap;
}): CellEdgeAttrs[] => {
	const cellEdgeAttrs: CellEdgeAttrs[] = [];

	rowNode.content.forEach((cellNode, cellOffset) => {
		if (cellNode.type.name !== 'tableCell' && cellNode.type.name !== 'tableHeader') {
			return;
		}

		const cellRect = tableMap.findCell(rowStart + 1 + cellOffset);

		cellEdgeAttrs.push({
			reachesBottom: cellRect.bottom >= tableMap.height,
			reachesLeft: cellRect.left === 0,
			reachesRight: cellRect.right >= tableMap.width,
			reachesTop: cellRect.top === 0,
		});
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
		let cellIndex = 0;

		tableNode.content.forEach((rowNode, rowStart) => {
			getRowCellEdgeAttrs({ rowNode, rowStart, tableMap }).forEach((edgeAttrs) => {
				const cell = cells[cellIndex];
				cellIndex++;

				if (cell) {
					applyCellEdgeAttrs(cell, edgeAttrs);
				}
			});
		});
	} catch {
		// Table structure can be transient while widget DOM is being assembled.
	}
};
