export const inlineStylesIfRanking = (isRanking: boolean, width: number, height?: number): {} => {
	if (!isRanking) {
		return {};
	}

	if (height) {
		return { width, height };
	}

	return { width };
};
