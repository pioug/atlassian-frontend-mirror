import { type RowType } from '../../../types';

import testData from './_data-json.json';

export const rows: any = testData;

export const row: any = rows[0];

export const rowsWithKeys: Array<RowType> = rows.map((tRow: RowType, rowIndex: number) => {
	return {
		key: `${rowIndex}`,
		...tRow,
	};
});

const rowWithKey: RowType = rowsWithKeys[0];

export const cellWithKey: import('../../../types').RowCellType = rowWithKey.cells[0];
