const calcRegex = /(^calc)/;

export const isCalc = (
	value: string | number | boolean | RegExp | null | undefined | any[] | bigint,
): boolean => {
	if (typeof value === 'string') {
		if (calcRegex.test(value)) {
			return true;
		}
	}
	return false;
};
