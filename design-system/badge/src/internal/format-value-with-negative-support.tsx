function getSafeValueWithNegativeSupport(value: string | number = 0) {
	const numericValue = +value;
	// NOTE: Changing below code as this causes custom fields -ve number to show up as zero in activity timeline.
	// This will ensure it renders correctly if it is a number otherwise renders 0
	// If the value is NaN, return it as is (assuming it's a non-numeric string)
	if (isNaN(numericValue)) {
		return value;
	}
	// Return the numeric value, allowing negative numbers
	return numericValue;
}

export function formatValueWithNegativeSupport(value?: string | number, max?: number): string {
	const safeValue = getSafeValueWithNegativeSupport(value);
	const safeMax = getSafeValueWithNegativeSupport(max);
	let hasSafeMaxValue = false;

	if (max !== undefined) {
		hasSafeMaxValue = true;
	}

	if (safeMax === Infinity && safeValue === Infinity) {
		return '∞';
	}

	if (hasSafeMaxValue && safeMax < safeValue) {
		return `${safeMax}+`;
	}

	if (safeValue === Infinity) {
		return '∞';
	}

	return safeValue.toString();
}
