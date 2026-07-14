import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette/text-background-color';
import { token } from '@atlaskit/tokens';

import { getTokenCSSVariableValueForNonActiveTheme } from './utils';

/**
 * Resolves a highlight (background) color to its equivalent value in the
 * non-active theme.
 *
 * Shared between the highlight plugin state (`getActiveColorInNonActiveTheme`)
 * and the color-accessibility selection walker.
 *
 * @param color - The raw highlight color mark (hex/token) or null for no
 * highlight.
 * @param options - Default background color and optional transparent sentinel.
 * @param options.defaultBackgroundColor - Fallback value returned when the color
 * cannot be resolved to a raw token (used for the default surface background).
 * @param options.transparentColor - Optional sentinel representing an explicit
 * transparent highlight. When provided, a color equal to this value is treated
 * the same as no highlight (mapped to the surface elevation). The single-value
 * plugin state never carries this sentinel, but the selection walker reads raw
 * node marks that can, so callers walking the document should pass it.
 */
export const getHighlightColorInNonActiveTheme = (
	color: string | null,
	{
		defaultBackgroundColor,
		transparentColor,
	}: { defaultBackgroundColor: string; transparentColor?: string },
): string => {
	if (!color || (transparentColor !== undefined && color === transparentColor)) {
		return getTokenCSSVariableValueForNonActiveTheme(
			token('elevation.surface'),
			defaultBackgroundColor,
		);
	}

	const colorValue = hexToEditorTextBackgroundPaletteColor(color) || color;

	return getTokenCSSVariableValueForNonActiveTheme(colorValue, color);
};
