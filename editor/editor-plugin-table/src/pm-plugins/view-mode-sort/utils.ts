import { SortOrder } from '@atlaskit/editor-common/types';
import {
	convertProsemirrorTableNodeToArrayOfRows,
	createCompareNodes,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	IS_DISABLED_CLASS_NAME,
	SORT_INDEX_DATA_ATTRIBUTE,
	SORTING_ICON_CLASS_NAME,
} from './consts';
import type { TableSortMeta } from './types';

export const unsort = (
	oldOrder: { index: number; value: number }[],
	tableElement: HTMLElement,
): void => {
	const tbody = tableElement.querySelector(`:scope > tbody`);
	const rows = tableElement.querySelectorAll(`:scope > tbody > tr`);

	const sortedOrder = [...oldOrder].sort((a, b) => a.value - b.value);
	sortedOrder.forEach((item) => {
		tbody?.appendChild(rows[item.index + 1]);
	});
};

const getSortOrderFromTable = (tableNode: PMNode, sortIndex: number, direction: SortOrder) => {
	const tableArray = convertProsemirrorTableNodeToArrayOfRows(tableNode);
	tableArray.shift(); // remove header row

	// Keep track of the origin row index
	const tableArrayWithIndex = tableArray.map((node, index) => ({
		node,
		originalIndex: index,
	}));

	const compareNodesInOrder = createCompareNodes(
		{
			// TODO: ED-26961 - add inline card support
			getInlineCardTextFromStore() {
				return null;
			},
		},
		direction,
	);
	const order = tableArrayWithIndex
		.sort((a, b) => {
			return compareNodesInOrder(a.node[sortIndex], b.node[sortIndex]);
		})
		.map((tableRow, index) => ({
			value: tableRow.originalIndex,
			index,
		}));
	return [
		// Ensures the first tr is always first in the order
		{ value: -1, index: -1 },
		...order,
	];
};

export const toggleSort = (view: EditorView, event: Event, pluginState: TableSortMeta): void => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}
	const widget = target.closest(`.${SORTING_ICON_CLASS_NAME}`);
	if (widget?.classList.contains(IS_DISABLED_CLASS_NAME) || !widget) {
		return;
	}
	const dataSortIndex = target
		?.closest('.ProseMirror-widget')
		?.getAttribute(SORT_INDEX_DATA_ATTRIBUTE);
	const tr = view.state.tr;
	const tableElement = target.closest('table');
	if (!tableElement || !dataSortIndex) {
		return;
	}
	const tablePos = view.posAtDOM(tableElement, 0);
	const tableNode = view.state.doc.nodeAt(tablePos - 1);
	const tableId = tableNode?.attrs.localId;

	if (!tableId || !tableNode || tableNode?.type?.name !== 'table') {
		return;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line prefer-const
	let { index, direction, order: oldOrder } = pluginState?.[tableId] || {};

	// Unsort if there was already a sort
	if (direction !== SortOrder.NO_ORDER && oldOrder !== undefined) {
		unsort(oldOrder, tableElement);
	}

	const sortIndex = parseInt(dataSortIndex);
	if (sortIndex === index) {
		switch (direction) {
			case SortOrder.NO_ORDER:
				direction = SortOrder.ASC;
				break;
			case SortOrder.ASC:
				direction = SortOrder.DESC;
				break;
			case SortOrder.DESC:
				direction = SortOrder.NO_ORDER;
				break;
		}
	} else {
		direction = SortOrder.ASC; // default direction when a new index is clicked
	}

	const order = getSortOrderFromTable(tableNode, sortIndex, direction);

	if (direction === SortOrder.NO_ORDER) {
		tr.setMeta('tableSortMeta', {
			[tableId]: {},
		});
	} else {
		tr.setMeta('tableSortMeta', {
			[tableId]: {
				index: sortIndex,
				direction,
				order,
				tableElement,
			},
		});
	}
	view.dispatch(tr);
};

export const getTableElements = (tableId: string) => {
	const tableElement = document.querySelector(`table[data-table-local-id="${tableId}"]`);
	const tbody = tableElement?.querySelector(':scope > tbody');

	const rows = tableElement?.querySelectorAll(':scope > tbody > tr');
	return { tbody, rows };
};
