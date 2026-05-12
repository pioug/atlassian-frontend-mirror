import { getGridStateFromStorage } from './get-grid-state-from-storage';
import type { DimensionNames } from './types';

export const resolveDimension = (
	key: DimensionNames,
	dimension: number = 0,
	shouldPersist: boolean = false,
): any => {
	if (shouldPersist) {
		const cachedGridState = getGridStateFromStorage('gridState');

		return cachedGridState && Object.keys(cachedGridState).length > 0 && cachedGridState[key]
			? cachedGridState[key]
			: dimension;
	}

	return dimension;
};
