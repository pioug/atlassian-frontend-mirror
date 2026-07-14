import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette/text';
import { token } from '@atlaskit/tokens';

import { getTokenCSSVariableValueForNonActiveTheme } from './utils';

/**
 * Resolves a text (foreground) color to its equivalent value in the non-active
 * theme (i.e. dark when the editor is in light mode and vice versa).
 *
 * Shared between the text-color plugin state (`getColorInNonActiveTheme`) and the
 * color-accessibility selection walker so both evaluate colors identically.
 *
 * @param color - The raw text color mark (hex/token) or null for the default.
 * @param defaultColor - The plugin's default text color, used when `color` is
 * absent or explicitly the default.
 */
export const getTextColorInNonActiveTheme = (
	color: string | null,
	defaultColor: string,
): string => {
	if (!color || color === defaultColor) {
		return getTokenCSSVariableValueForNonActiveTheme(token('color.text'), defaultColor);
	}

	const colorValue = hexToEditorTextPaletteColor(color) || color;

	return getTokenCSSVariableValueForNonActiveTheme(colorValue, color);
};
