import { type RowType } from '../../../types';

import rows from './_data-json.json';

export const rowsWithKeys: Array<RowType> = rows.map((tRow: RowType, rowIndex: number) => {
	return {
		key: `${rowIndex}`,
		...tRow,
	};
});
