const emRegex = /(.*\d+)em$/;
const percentageRegex = /(%$)/;

export const emToPixels = <T extends unknown>(
	value: T,
	fontSize: number | null | undefined,
): number | T | null => {
	if (typeof value === 'string') {
		const emMatch = value.match(emRegex);
		if (emMatch && typeof fontSize === 'number') {
			return Number(emMatch[1]) * fontSize;
		} else if (value.match(percentageRegex)) {
			return value;
		} else {
			return null;
		}
	}
	return value;
};
