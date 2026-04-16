import { type HeadType } from '../types';

export const validateSortKey = (sortKey?: string, head?: HeadType): void => {
	if (!sortKey) {
		return;
	}
	const headHasKey = head && head.cells.map((cell) => cell.key).includes(sortKey);

	if (!headHasKey) {
		try {
			throw Error(`Cell with ${sortKey} key not found in head.`);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	}
};
