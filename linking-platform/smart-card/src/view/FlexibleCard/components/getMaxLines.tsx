export const getMaxLines = (
	value: number,
	defaultValue: number,
	max: number,
	min: number,
): number => {
	if (value > max) {
		return defaultValue;
	}

	if (value < min) {
		return min;
	}

	return value;
};
