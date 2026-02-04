import { type ActiveTokens } from '@atlaskit/tokens';
import tokenNames from '@atlaskit/tokens/token-names';

import { baseTokenNames } from '../components/base-token-editor';

import type { BaseTokens, ColorMode, Theme } from './types';

const url = new URL(window.location.href);
const params = new URLSearchParams(window.location.search);

export const isHex = (value: string): RegExpMatchArray | null => value.match(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/);

// Get search params
export const getSearchParams = (): {
	theme: Theme;
	baseTokens: BaseTokens;
	colorMode: ColorMode;
} => {
	const urlSearchParams = params;
	const paramEntries = Object.fromEntries(urlSearchParams.entries());
	var objectTheme = {};
	try {
		objectTheme = JSON.parse(paramEntries.customTheme || '""');
	} catch (error) {
		console.error(error);
	}

	const filteredTheme = Object.entries(objectTheme)
		.map(([key, value]) => {
			if (Object.keys(tokenNames).includes(key)) {
				return {
					name: key as ActiveTokens,
					value: value,
				};
			}
		})
		.filter((value) => value !== undefined) as Theme;

	const objectBaseTokens: Record<string, string> =
		JSON.parse(paramEntries.baseTokens || '""') || {};
	const filteredBaseTokens = Object.fromEntries(
		Object.entries(objectBaseTokens).filter(
			([key, value]) => baseTokenNames.includes(key) && typeof value === 'string' && isHex(value),
		),
	);

	return {
		colorMode: ['light', 'dark'].includes(paramEntries.colorMode || '')
			? (paramEntries.colorMode as ColorMode)
			: 'light',
		baseTokens: filteredBaseTokens,
		theme: filteredTheme,
	};
};

// Set search params
export const setSearchParams = (
	theme: { name: string; value: string }[],
	baseTokens: BaseTokens,
	colorMode: ColorMode,
): void => {
	let objectTheme: { [index: string]: string } = {};
	theme.forEach((value: { name: string; value: string }) => {
		objectTheme[value.name] = value.value;
	});
	url.searchParams.set('colorMode', colorMode);
	url.searchParams.set('customTheme', JSON.stringify(objectTheme));
	url.searchParams.set('baseTokens', JSON.stringify(baseTokens));

	// set window query params to the newly generated URL
	window.history.replaceState({}, '', url.toString());
};
