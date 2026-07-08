import paletteRaw from '@atlaskit/tokens/palettes-raw';
import tokenNames from '@atlaskit/tokens/token-names';
import { dark as darkTokensRaw, light as lightTokensRaw } from '@atlaskit/tokens/tokens-raw';

import { getSelectedRowAndColumn } from './getSelectedRowAndColumn';
import type { PaletteColor } from './Palettes/type';

export const DEFAULT_COLOR_PICKER_COLUMNS = 7;

type ThemeMode = 'light' | 'dark';
type RawToken = (typeof lightTokensRaw)[number];

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CSS_VAR_EXPRESSION_REGEX = /var\(([^,\)]+)(,.*)?\)/;

type CSSVariableParts = {
	fallback: string;
	variable: string;
};

const getCSSVariableParts = (variableExpression: string): CSSVariableParts | undefined => {
	const matcher = variableExpression.match(CSS_VAR_EXPRESSION_REGEX);
	if (!matcher) {
		return undefined;
	}

	return {
		fallback: matcher[2] ? matcher[2].replace(',', '').trim() : '',
		variable: matcher[1].trim(),
	};
};

// Build the reverse lookup (CSS variable -> token name) once at module load so that
// each lookup is O(1) instead of O(n) with an extra array allocation per call.
const cssVariableToTokenName = new Map<string, string>(
	Object.entries(tokenNames).map(([tokenName, cssVariable]) => [cssVariable, tokenName]),
);

const getTokenName = (cssVariable: string): string | undefined =>
	cssVariableToTokenName.get(cssVariable);

const resolveRawTokenValue = (value: RawToken['value']): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const paletteValue = paletteRaw.find(
		(paletteToken) => paletteToken.path[paletteToken.path.length - 1] === value,
	)?.value;

	return typeof paletteValue === 'string' ? paletteValue : value;
};

const getCurrentThemeMode = (): ThemeMode => {
	if (typeof document === 'undefined') {
		return 'light';
	}

	return document.documentElement.getAttribute('data-color-mode') === 'dark' ? 'dark' : 'light';
};

const getNonActiveThemeMode = (): ThemeMode =>
	getCurrentThemeMode() === 'dark' ? 'light' : 'dark';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getColorsPerRowFromPalette(
	palette: PaletteColor[],
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
): PaletteColor[][] {
	return palette.reduce((resultArray: PaletteColor[][], item: PaletteColor, index: number) => {
		const chunkIndex = Math.floor(index / cols);

		resultArray[chunkIndex] = resultArray[chunkIndex] || []; // start a new chunk
		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getSelectedRowAndColumnFromPalette(
	palette: PaletteColor[],
	selectedColor: string | null,
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
): {
	selectedColumnIndex: number;
	selectedRowIndex: number;
} {
	const colorsPerRow = getColorsPerRowFromPalette(palette, cols);
	return getSelectedRowAndColumn(colorsPerRow, selectedColor);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getTokenCSSVariableValue = (variableExpression: string): string => {
	const matcher = variableExpression.match(CSS_VAR_EXPRESSION_REGEX);
	if (matcher) {
		const variable = matcher[1].trim();
		const fallback = matcher[2] ? matcher[2].replace(',', '').trim() : '';
		if (typeof document === 'undefined') {
			return fallback;
		}
		const value = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(variable)
			.trim();

		return value || fallback;
	}

	return '';
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getTokenCSSVariableValueForNonActiveTheme = (
	variableExpression: string,
	fallback: string,
): string => {
	const cssVariableParts = getCSSVariableParts(variableExpression);
	const tokenName = cssVariableParts ? getTokenName(cssVariableParts.variable) : undefined;
	const rawToken = (getNonActiveThemeMode() === 'light' ? lightTokensRaw : darkTokensRaw).find(
		(token) => token.cleanName === tokenName,
	);

	if (rawToken) {
		return resolveRawTokenValue(rawToken.value) || fallback;
	}

	return cssVariableParts?.fallback || fallback;
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getSelectedRowAndColumn } from './getSelectedRowAndColumn';
