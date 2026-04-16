import { type RowType } from '../types';

export const getPageRows = (
	allRows: Array<RowType>,
	pageNumber?: number,
	rowsPerPage?: number,
): Array<RowType> => {
	if (!pageNumber || !rowsPerPage || !allRows.length) {
		return [];
	}
	return allRows.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
};
