import { useMemo } from 'react';

import { useColorMode } from '@atlaskit/app-provider';
import { getTokenValue } from '@atlaskit/tokens';

import { parseHex } from './color-utils/formats/hex';
import { type CustomTheme } from './get-custom-theme-styles';
import { useCustomTheme } from './use-custom-theme';

function toRGBString({ r, g, b }: { r: number; g: number; b: number }) {
	return `rgb(${r}, ${g}, ${b})`;
}

type ResultNew =
	| { isEnabled: false }
	| { isEnabled: true; style: React.CSSProperties; hasDefaultBackground: boolean };

/**
 * React hook that computes the custom theme style for the top navigation bar.
 *
 * Determines whether a custom theme is enabled, computes the resulting style,
 * and checks if the background color matches the default for the current color mode.
 *
 * @param theme Optional custom theme configuration object.
 * @returns An object indicating if the custom theme is enabled, the computed style,
 *          and a flag specifying if the default background color is used.
 */
export function useCustomThemeNew(theme: CustomTheme | undefined): ResultNew {
	const value = useCustomTheme(theme);

	/**
	 * We use the color mode to determine the default background color for the top nav.
	 * We need to use the hook because the user could change their color mode preference.
	 */
	const colorMode = useColorMode();

	const hasDefaultBackground = useMemo(() => {
		if (!value.isEnabled) {
			return true;
		}

		const defaultBackground = parseHex(
			getTokenValue('elevation.surface', colorMode === 'light' ? '#FFFFFF' : '#1F1F21'),
		);

		return defaultBackground
			? value.style.backgroundColor === toRGBString(defaultBackground)
			: true;
	}, [value, colorMode]);

	if (value.isEnabled) {
		return { ...value, hasDefaultBackground };
	}

	return value;
}
