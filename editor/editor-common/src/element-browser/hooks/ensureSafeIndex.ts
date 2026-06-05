export const ensureSafeIndex = (index: number, listSize: number): number => {
	if (index < 0) {
		return 0;
	}

	if (index > listSize) {
		return listSize;
	}

	return index;
};
