import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findTable } from './find-table';
import { isSelectionType } from './is-selection-type';
import { isTableSelected } from './is-table-selected';
import { removeRow } from './remove-row';
import { removeTable } from './remove-table';

// Returns a new transaction that removes selected rows.
export const removeSelectedRows = (tr: Transaction): Transaction => {
	const { selection } = tr;
	if (isTableSelected(selection)) {
		return removeTable(tr);
	}
	if (isSelectionType(selection, 'cell')) {
		const table = findTable(selection);
		if (table) {
			const map = TableMap.get(table.node);
			const rect = map.rectBetween(
				selection.$anchorCell.pos - table.start,
				selection.$headCell.pos - table.start,
			);

			if (rect.top === 0 && rect.bottom === map.height) {
				return tr;
			}

			const pmTableRect = {
				...rect,
				map,
				table: table.node,
				tableStart: table.start,
			};

			for (let i = pmTableRect.bottom - 1; ; i--) {
				removeRow(tr, pmTableRect, i);
				if (i === pmTableRect.top) {
					break;
				}
				pmTableRect.table = pmTableRect.tableStart
					? (tr.doc.nodeAt(pmTableRect.tableStart - 1) as PMNode)
					: tr.doc;
				pmTableRect.map = TableMap.get(pmTableRect.table);
			}

			return cloneTr(tr);
		}
	}

	return tr;
};
