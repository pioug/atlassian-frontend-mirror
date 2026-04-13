import { useMemo } from 'react';

import { useColorMode } from '@atlaskit/app-provider';
import { getTokenValue } from '@atlaskit/tokens';

import { parseHex } from './color-utils/formats/hex';
import { type CustomTheme, getCustomThemeStyles } from './get-custom-theme-styles';

type ResultNew =
	| { isEnabled: false }
	| { isEnabled: true; style: React.CSSProperties; hasDefaultBackground: boolean };

function toRGBString({ r, g, b }: { r: number; g: number; b: number }) {
	return `rgb(${r}, ${g}, ${b})`;
}

// TODO: Fill in the hook {description}.
/**
 * {description}.
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

type Result = { isEnabled: false } | { isEnabled: true; style: React.CSSProperties };

/**
 * Processes the provided theme and returns theme styles if possible.
 */
export function useCustomTheme(theme: CustomTheme | undefined): Result {
	const value: Result = useMemo(
		() => {
			if (!theme?.backgroundColor || !theme?.highlightColor) {
				return { isEnabled: false };
			}

			/**
			 * Re-creating the `theme` object from it's pieces.
			 *
			 * _Technically_ we could just use `theme`, but that would involve an eslint opt out
			 * as we would be leveraging a value (`theme`) not in the dependency array.
			 *
			 * The current approach is the most correct™️ and avoids foot guns.
			 * We are only using values in the effect that are defined in the dependency array 🙌
			 */
			const value: CustomTheme = {
				backgroundColor: theme.backgroundColor,
				highlightColor: theme.highlightColor,
			};

			const style = getCustomThemeStyles(value);
			if (!style) {
				// Either the `backgroundColor` or `highlightColor` could not be parsed
				return {
					isEnabled: false,
				};
			}

			return {
				isEnabled: true,
				style,
			};
		},
		// Using individual properties as keys for improved memoization.
		// Now this effect will only run if the values change rather than
		// the reference to the object (which might be new on every call)
		[theme?.backgroundColor, theme?.highlightColor],
	);

	return value;
}
