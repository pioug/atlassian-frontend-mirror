import chalk from 'chalk';

import { colorToHex, compareHex, isValidColor } from './color-utils';

// so far allowing to remove only exact matches in values. Can be increased to auto-remove fallbacks with similar values
const ACCEPTABLE_COLOR_DIFFERENCE = 0;
const ACCEPTABLE_SPACE_DIFFERENCE = 0;
const ACCEPTABLE_NUMERIC_DIFFERENCE = 0;

export function normalizeValues(
	tokenKey: string,
	tokenValue: string | undefined,
	fallbackValue: string | undefined,
): {
	difference?: number;
	isAcceptableDifference?: boolean;
	tokenLogValue: string;
	fallbackLogValue: string;
	normalizedTokenValue: string | undefined;
	normalizedFallbackValue: string | undefined;
} {
	let tokenLogValue: string | undefined;
	let fallbackLogValue: string | undefined;
	let normalizedTokenValue = tokenValue;
	let normalizedFallbackValue = fallbackValue;
	const lowerCaseTokenKey = tokenKey?.toLowerCase();
	let difference: number | undefined;
	let isAcceptableDifference: boolean | undefined;

	if (lowerCaseTokenKey.startsWith('color') || lowerCaseTokenKey.startsWith('elevation')) {
		if (tokenValue && isValidColor(tokenValue)) {
			const normalizedHex = colorToHex(tokenValue);
			tokenLogValue = chalk.bgHex(normalizedHex)(tokenValue);
			normalizedTokenValue = normalizedHex;
		}
		if (fallbackValue && isValidColor(fallbackValue)) {
			const normalizedHex = colorToHex(fallbackValue);
			fallbackLogValue = chalk.bgHex(normalizedHex)(fallbackValue);
			normalizedFallbackValue = normalizedHex;
		}
		if (normalizedTokenValue && normalizedFallbackValue) {
			difference = compareHex(normalizedTokenValue, normalizedFallbackValue);
			isAcceptableDifference = difference <= ACCEPTABLE_COLOR_DIFFERENCE;
		}
	} else if (lowerCaseTokenKey.startsWith('space')) {
		const tokenValueInPx = tokenValue ? convertToPx(tokenValue) : undefined;
		const fallbackValueInPx = fallbackValue ? convertToPx(fallbackValue) : undefined;
		if (tokenValueInPx !== undefined && fallbackValueInPx !== undefined) {
			const maxVal = Math.max(tokenValueInPx, fallbackValueInPx);
			difference = (Math.abs(tokenValueInPx - fallbackValueInPx) / maxVal) * 100;
			isAcceptableDifference = difference <= ACCEPTABLE_SPACE_DIFFERENCE;
		}
		// Log the normalized values
		normalizedTokenValue = tokenValue;
		normalizedFallbackValue = fallbackValue;
		tokenLogValue = tokenValue;
		fallbackLogValue = fallbackValue;
	} else {
		// Handle other numeric comparisons
		const tokenValueNumber = parseFloat(tokenValue ?? '');
		const fallbackValueNumber = parseFloat(fallbackValue ?? '');
		if (!isNaN(tokenValueNumber) && !isNaN(fallbackValueNumber)) {
			const maxVal = Math.max(tokenValueNumber, fallbackValueNumber);
			difference = (Math.abs(tokenValueNumber - fallbackValueNumber) / maxVal) * 100;
			isAcceptableDifference = difference <= ACCEPTABLE_NUMERIC_DIFFERENCE;
		}
		// Log the normalized values
		normalizedTokenValue = tokenValue;
		normalizedFallbackValue = fallbackValue;
		tokenLogValue = tokenValue;
		fallbackLogValue = fallbackValue;
	}

	if (tokenLogValue === undefined) {
		tokenLogValue = chalk.magenta(tokenValue || '');
	}
	if (fallbackLogValue === undefined) {
		fallbackLogValue = chalk.yellow(fallbackValue || '');
	}

	return {
		difference,
		isAcceptableDifference,
		tokenLogValue,
		fallbackLogValue,
		normalizedTokenValue,
		normalizedFallbackValue,
	};
}

function convertToPx(value: string | number): number | undefined {
	// If the value is a number, return it directly
	if (typeof value === 'number') {
		return value;
	}
	// Check if the string is a plain number (without units)
	const plainNumberRegex = /^-?\d+(\.\d+)?$/;
	if (plainNumberRegex.test(value)) {
		return parseFloat(value);
	}
	// Regular expression to match CSS units
	const unitRegex = /^(-?\d+(\.\d+)?)(px|rem|em|%)$/;
	const match = value.match(unitRegex);
	if (!match) {
		return undefined;
	}
	const [, num, , unit] = match;
	const numericValue = parseFloat(num);
	switch (unit) {
		case 'px':
			return numericValue;
		case 'rem':
			return numericValue * 16; // Assuming 1rem = 16px
		case 'em':
			return numericValue * 16; // Assuming 1em = 16px
		default:
			return undefined;
	}
}
