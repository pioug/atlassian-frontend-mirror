import { type HeadType } from '../types';

export const assertIsSortable = (head?: HeadType): void => {
	if (!head || !head.cells) {
		return;
	}

	head.cells.forEach((cell) => {
		if (cell.isSortable && !cell.key) {
			try {
				throw Error("isSortable can't be set to true, if the 'key' prop is missing.");
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}
	});
};
