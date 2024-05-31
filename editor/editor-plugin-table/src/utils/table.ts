import type { IntlShape } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';

export const getMergedCellsPositions = (tr: Transaction): number[] => {
	const table = findTable(tr.selection);
	if (!table) {
		return [];
	}

	const map = TableMap.get(table.node);
	const cellPositions = new Set();
	const mergedCells: number[] = [];

	map.map.forEach((value) => {
		if (cellPositions.has(value)) {
			mergedCells.push(value);
		} else {
			cellPositions.add(value);
		}
	});

	return mergedCells;
};

export const colsToRect = (cols: Array<number>, noOfRows: number): Rect => ({
	left: Math.min(...cols),
	right: Math.max(...cols) + 1,
	top: 0,
	bottom: noOfRows,
});

export const getAssistiveMessage = (
	prevTableNode: PmNode,
	currentTableNode: PmNode,
	intl: IntlShape,
) => {
	const { formatMessage } = intl;
	const prevTableMap = TableMap.get(prevTableNode);
	const currentTableMap = TableMap.get(currentTableNode);

	if (currentTableMap.width !== prevTableMap.width) {
		const diff = Math.abs(currentTableMap.width - prevTableMap.width);
		if (currentTableMap.width > prevTableMap.width) {
			return formatMessage(messages.columnsAreInserted, { count: diff });
		}
		if (currentTableMap.width < prevTableMap.width) {
			return formatMessage(messages.columnsAreRemoved, { count: diff });
		}
	}

	if (currentTableMap.height !== prevTableMap.height) {
		const diff = Math.abs(currentTableMap.height - prevTableMap.height);
		if (currentTableMap.height > prevTableMap.height) {
			return formatMessage(messages.rowsAreInserted, { count: diff });
		}
		if (currentTableMap.height < prevTableMap.height) {
			return formatMessage(messages.rowsAreRemoved, { count: diff });
		}
	}

	return '';
};
