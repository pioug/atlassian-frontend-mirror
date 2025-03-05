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

export function formatValueWithNegativeSupport(value?: string | number, max?: number) {
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

function getSafeValue(value: string | number = 0) {
	const numericValue = +value;
	if (numericValue < 0) {
		return 0;
	}

	return value;
}

export function formatValue(value?: string | number, max?: number) {
	const safeValue = getSafeValue(value);
	const safeMax = getSafeValue(max);

	if (safeMax && safeMax < safeValue) {
		return `${safeMax}+`;
	}

	if (safeValue === Infinity) {
		return '∞';
	}

	return safeValue.toString();
}
