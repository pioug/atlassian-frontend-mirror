import { type RankEnd, type RowType } from '../types';

import { computeIndex } from './compute-index';

export const reorderRows = (
	rankEnd: RankEnd,
	rows: RowType[],
	page: number = 1,
	rowsPerPage?: number,
): RowType[] => {
	const { destination, sourceIndex } = rankEnd;

	if (!destination) {
		return rows;
	}

	const fromIndex = computeIndex(sourceIndex, page, rowsPerPage);
	const toIndex = computeIndex(destination.index, page, rowsPerPage);

	const reordered = rows.slice();
	const [removed] = reordered.splice(fromIndex, 1);
	reordered.splice(toIndex, 0, removed);

	return reordered;
};
