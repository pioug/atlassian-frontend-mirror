import type React from 'react';

import { themedLogoIcon, themedLogoText } from '../nav-logo/logo-renderer';

import {
	themedButtonBackground,
	themedButtonBackgroundHovered,
	themedButtonBackgroundPressed,
	themedButtonBorder,
	themedButtonDisabledBackground,
	themedButtonDisabledText,
	themedButtonPrimaryBackground,
	themedButtonPrimaryBackgroundHovered,
	themedButtonPrimaryBackgroundPressed,
	themedButtonPrimaryText,
	themedButtonSelectedBackground,
	themedButtonSelectedBackgroundHovered,
	themedButtonSelectedBackgroundPressed,
	themedButtonSelectedBorder,
	themedButtonSelectedText,
} from './button';
import {
	type ColorMode,
	getColorMode,
	getTextColor,
	isLight,
	simpleAlphaComposite,
} from './color-utils';
import { parseHex } from './color-utils/formats/hex';
import type { RGB, RGBA } from './color-utils/types';
import { palette, paletteRgba } from './palette';
import { themedSearchBorder, themedSearchBorderFocused } from './search';

/**
 * Expects colors to be passed as `RGB` objects.
 *
 * Allows `string` for hex strings only, for backwards compatibility.
 * This will likely be removed in the future.
 *
 * Allows `null` for ergonomic reasons, because our color parsing utilities can return
 * `null` if they cannot parse a color string.
 */
export type CustomTheme = {
	backgroundColor: string | RGB | null;
	highlightColor: string | RGB | null;
};

function toRGBString({ r, g, b }: RGB) {
	return `rgb(${r}, ${g}, ${b})`;
}

function toRGBAString({ r, g, b, a }: RGBA) {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type StyleObject = Record<string, string>;

// Using raw hex codes because custom colors break out of the tokens model
// We will need to invert the colors based on backgroundColor independently of the app's color mode (dark/light)
// Values here are not final
const buttonStyles: Record<ColorMode, StyleObject> = {
	light: {
		[themedButtonBackground]: 'transparent',
		[themedButtonBackgroundHovered]: palette.Neutral200A,
		[themedButtonBackgroundPressed]: palette.Neutral300A,
		[themedButtonBorder]: palette.Neutral300A,
		[themedButtonSelectedBackground]: palette.Neutral300A,
		[themedButtonSelectedBackgroundHovered]: palette.Neutral400A,
		[themedButtonSelectedBackgroundPressed]: palette.Neutral500A,
		[themedButtonDisabledText]: palette.Neutral400A,
		[themedButtonDisabledBackground]: palette.Neutral100A,
	},
	dark: {
		[themedButtonBackground]: 'transparent',
		[themedButtonBackgroundHovered]: palette.DarkNeutral200A,
		[themedButtonBackgroundPressed]: palette.DarkNeutral300A,
		[themedButtonBorder]: palette.DarkNeutral300A,
		[themedButtonSelectedBackground]: palette.DarkNeutral300A,
		[themedButtonSelectedBackgroundHovered]: palette.DarkNeutral400A,
		[themedButtonSelectedBackgroundPressed]: palette.DarkNeutral500A,
		[themedButtonDisabledText]: palette.DarkNeutral400A,
		[themedButtonDisabledBackground]: palette.DarkNeutral100A,
	},
};

const logoStyles: Record<ColorMode, StyleObject> = {
	light: {
		[themedLogoIcon]: palette.DarkNeutral0,
		[themedLogoText]: palette.DarkNeutral0,
	},
	dark: {
		[themedLogoIcon]: palette.Neutral0,
		[themedLogoText]: palette.Neutral0,
	},
};

/**
 * Provides a `style` prop value for the `TopNav` that defines required CSS variables.
 *
 * If a provided `backgroundColor` or `highlightColor` cannot be parsed,
 * then `null` will be returned.
 */
export function getCustomThemeStyles({
	backgroundColor,
	highlightColor,
}: CustomTheme): React.CSSProperties | null {
	const backgroundRgb: RGB | null =
		typeof backgroundColor === 'string' ? parseHex(backgroundColor) : backgroundColor;

	const highlightRgb: RGB | null =
		typeof highlightColor === 'string' ? parseHex(highlightColor) : highlightColor;

	if (!backgroundRgb || !highlightRgb) {
		return null;
	}

	const textColor = getTextColor(backgroundRgb);
	const colorMode = getColorMode(backgroundRgb);

	const highlightTextColor = getTextColor(highlightRgb);

	return {
		backgroundColor: toRGBString(backgroundRgb),
		color: textColor.hex,
		...buttonStyles[colorMode],
		...logoStyles[colorMode],
		...getSelectedStyles({ backgroundColor: backgroundRgb, colorMode }),
		/**
		 * Search colors are the same as Nav 3
		 */
		[themedSearchBorder]: toRGBAString({ ...textColor.rgb, a: 0.5 }),
		[themedSearchBorderFocused]: toRGBAString({ ...highlightRgb, a: 0.8 }),
		/**
		 * Primary button colors are the same as Nav 3,
		 * except the text color which can sometimes differ because we're
		 * now following WCAG
		 */
		[themedButtonPrimaryBackground]: toRGBString(highlightRgb),
		[themedButtonPrimaryBackgroundHovered]: toRGBAString({ ...highlightRgb, a: 0.8 }),
		[themedButtonPrimaryBackgroundPressed]: toRGBAString({ ...highlightRgb, a: 0.65 }),
		[themedButtonPrimaryText]: highlightTextColor.hex,
	} as React.CSSProperties;
}

/**
 * Precomputed RGBA values for the selected backgrounds
 */
const selectedBackgroundRGBA: Record<ColorMode, RGBA> = {
	light: paletteRgba.Neutral300A,
	dark: paletteRgba.DarkNeutral300A,
};

function getSelectedStyles({
	backgroundColor,
	colorMode,
}: {
	/**
	 * The top bar background color
	 */
	backgroundColor: RGB;
	colorMode: ColorMode;
}): StyleObject {
	/**
	 * The background color of the selected button in its default state.
	 *
	 * We are referring to this as a foreground color because it is semi-transparent,
	 * so is not the actual color displayed when the button is on top of a background color.
	 */
	const foregroundColor = selectedBackgroundRGBA[colorMode];

	/**
	 * The blended color seen when the selected background is over the top bar.
	 */
	const blendedBackground = simpleAlphaComposite({
		background: backgroundColor,
		foreground: foregroundColor,
	});

	return {
		[themedButtonSelectedText]: getTextColor(blendedBackground).hex,
		// Border colors are chosen to match the text, while remaining in the palette
		[themedButtonSelectedBorder]: isLight(blendedBackground)
			? palette.Neutral1100
			: palette.DarkNeutral1100,
	};
}
