import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	akEditorFullWidthLayoutWidth,
	akEditorMaxLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { updateCellsMarkup } from './table-transform-utils';

export type TableMeasurement = {
	colWidths: Array<number>;
	tableWidth: number;
};

const tableWidth = (contentWidth: number) => {
	const maxEditorWidth =
		expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
		expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
			? akEditorMaxLayoutWidth
			: akEditorFullWidthLayoutWidth;

	return Math.min(maxEditorWidth, contentWidth);
};

export const getTableMeasurement = (tableRef: HTMLTableElement): TableMeasurement => {
	const colWidths = getRenderedColgroupColumnWidths(tableRef);
	const totalContentWidth = colWidths.reduce((acc, current) => acc + current, 0);

	return {
		colWidths,
		tableWidth: tableWidth(totalContentWidth),
	};
};

export const applyTableMeasurement = (
	tr: Transaction,
	tableNode: PMNode,
	{ colWidths, tableWidth }: TableMeasurement,
	tablePos: number,
): Transaction => {
	tr = updateCellsMarkup(tr, tableNode, tablePos, (cell, _rowIndex, colIndex) => {
		const newColWidths = colWidths.slice(colIndex, colIndex + cell.attrs.colspan);
		return cell.type.createChecked(
			{
				...cell.attrs,
				colwidth: newColWidths.length ? newColWidths : null,
			},
			cell.content,
			cell.marks,
		);
	});

	return tr.setNodeMarkup(tablePos, undefined, {
		...tableNode.attrs,
		width: tableWidth,
	});
};

function getRenderedColgroupColumnWidths(tableRef: HTMLTableElement): Array<number> {
	const cols = Array.from(tableRef.querySelectorAll<HTMLElement>(':scope > colgroup > col'));

	return cols.map((col) => {
		const width = col.getBoundingClientRect().width;
		return Math.max(Math.round(width), tableCellMinWidth);
	});
}
