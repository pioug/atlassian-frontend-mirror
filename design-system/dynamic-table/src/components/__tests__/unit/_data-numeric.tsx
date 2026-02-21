import { type RowType } from '../../../types';

import testDataNumeric from './_data-numeric-json.json';

export const sortKey = 'first_name';
export const numericSortKey = 'numeric';

// Numeric data
export const headNumeric: {
	cells: {
		key: string;
		content: string;
		isSortable: boolean;
	}[];
} = {
	cells: [
		{ key: sortKey, content: 'first name', isSortable: true },
		{ key: numericSortKey, content: 'Arbitrary numeric', isSortable: true },
	],
};

export const rowsNumeric: any = testDataNumeric;

export const rowsNumericWithKeys: Array<RowType> = rowsNumeric.map(
	(tRow: RowType, rowIndex: number) => {
		return {
			key: `${rowIndex}`,
			...tRow,
		};
	},
);

export const rowNumericWithKey: RowType = rowsNumericWithKeys[0];

export const cellNumericWithKey: import('../../../types').RowCellType = rowNumericWithKey.cells[0];
