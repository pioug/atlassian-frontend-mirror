import { useMemo } from 'react';

import { type CustomTheme, getCustomThemeStyles } from './get-custom-theme-styles';

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
