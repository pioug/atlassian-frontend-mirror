export const computeIndex = (index: number, page: number, rowsPerPage?: number): number => {
	const itemOnPreviousPages = rowsPerPage && isFinite(rowsPerPage) ? (page - 1) * rowsPerPage : 0;

	return index + itemOnPreviousPages;
};
