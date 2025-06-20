import { token } from '@atlaskit/tokens';

import { themedButtonBackgroundHovered } from './button';
import { useHasCustomTheme } from './has-custom-theme-context';

export const themedSearchBorder = '--ds-top-bar-search-border';
export const themedSearchBorderFocused = '--ds-top-bar-search-border-focused';

/**
 * Theme object intended for use with Search Platform components while transitioning to nav4.
 *
 * This is for backwards compatibility with the legacy theming API that was designed for nav3.
 *
 * As nav4 matures we will ideally evolve the theming solution inside Search Platform,
 * at which point this legacy theme object will not be needed.
 */
const legacySearchTheme = {
	default: {
		backgroundColor: 'transparent',
		color: 'currentColor',
		borderColor: `var(${themedSearchBorder})`,
	},
	focus: {
		/**
		 * When expanded the input ignores the custom theme,
		 * except for its border which is derived from the highlight color.
		 */
		color: token('color.text'),
		backgroundColor: token('color.background.input.pressed'),
		borderColor: `var(${themedSearchBorderFocused})`,
		boxShadow: `inset 0px 0px 0px 1px var(${themedSearchBorderFocused})`,
	},
	hover: {
		/**
		 * This is not actually used for the search bar input (at least by the Search Platform components).
		 *
		 * Instead it's used as the hover background color for a close button when on mobile.
		 */
		backgroundColor: `var(${themedButtonBackgroundHovered})`,
	},
};

/**
 * We are just using the inferred type instead of declaring it as `SearchCSS` (the type `@atlassian/search-dialog` expects)
 *
 * Importing the type from `@atlassian/search-dialog` means we have to declare it as a full dependency,
 * rather than a dev dependency. Even though it's type-only, this is how local consumption is setup.
 *
 * This was failing typechecking in Post Office, presumably due to different versions of `@emotion/styled`.
 * It is also a code smell having an unnecessary dependency.
 *
 * We still have indirect type safety from our example + product integrations, so a PR that breaks the types won't be able to merge.
 */
type LegacySearchTheme = typeof legacySearchTheme;

/**
 * Provides the `theme` value for Search Platform components.
 *
 * This may be a `SearchCSS` object or undefined,
 * depending on if the top bar is using custom theming.
 */
export function useLegacySearchTheme(): LegacySearchTheme | undefined {
	const hasCustomTheme = useHasCustomTheme();

	if (hasCustomTheme) {
		return legacySearchTheme;
	}

	return undefined;
}
