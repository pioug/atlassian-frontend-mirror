const emRegex = /(.*\d+)em$/;
const invalidSpacingUnitRegex = /(\d+rem$)|(vw$)|(vh$)/;

export const isValidSpacingValue = (
	value: string | number | boolean | RegExp | null | undefined | any[] | bigint,
	fontSize?: number | null | undefined,
): boolean => {
	if (typeof value === 'string') {
		if (invalidSpacingUnitRegex.test(value)) {
			return false;
		}
	} else if (Array.isArray(value)) {
		// could be array due to shorthand
		for (const val in value) {
			if (invalidSpacingUnitRegex.test(val)) {
				return false;
			}
		}
	}

	if (emRegex.test(value as string) && typeof fontSize !== 'number') {
		return false;
	}
	return true;
};
