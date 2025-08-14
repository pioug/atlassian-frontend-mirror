import React, { useMemo } from 'react';

import chromatism from 'chromatism';
import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { Color } from './Color';
import getColorMessage from './getColorMessage';
import type { ColorPaletteProps } from './types';
import {
	DEFAULT_COLOR_PICKER_COLUMNS,
	getColorsPerRowFromPalette,
	getTokenCSSVariableValue,
} from './utils';

const styles = cssMap({
	paletteWrapper: {
		display: 'flex',
	},
});

/**
 * For a given color pick the color from a list of colors with
 * the highest contrast
 *
 * @param color color string, supports HEX, RGB, RGBA etc.
 * @param useIconToken boolean, describes if a token should be used for the icon color
 * @return Highest contrast color in pool
 */
function getCheckMarkColor(color: string, useIconToken: boolean): string {
	const tokenVal = getTokenCSSVariableValue(color);
	const colorValue = !!tokenVal ? tokenVal : color;

	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	const contrastColor = ['#FFFFFF', '#42526E'].sort(
		(a, b) => chromatism.difference(b, colorValue) - chromatism.difference(a, colorValue),
	)[0];

	if (!useIconToken) {
		return contrastColor;
	}

	// Use of these token comes from guidance from designers in the Design System team
	// they are only intended for use with text colors (and there are different tokens
	// planned to be used when this extended to be used with other palettes).
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	return contrastColor === '#FFFFFF' ? token('color.icon.inverse') : token('color.icon');
}

/**
 * ColorPalette component for displaying a grid of selectable colors
 *
 * Features:
 * - Responsive grid layout
 * - Keyboard navigation support
 * - Accessibility compliance (ARIA attributes)
 * - Theme-aware tooltips
 * - Design token integration
 * - Customizable color mapping
 */
const ColorPalette = ({
	cols = DEFAULT_COLOR_PICKER_COLUMNS,
	onClick,
	onKeyDown,
	selectedColor,
	paletteOptions,
}: ColorPaletteProps) => {
	const { formatMessage } = useIntl();
	const { palette, hexToPaletteColor, paletteColorTooltipMessages } = paletteOptions;

	const { colorMode: tokenTheme } = useThemeObserver();
	const useIconToken = !!hexToPaletteColor;

	const colorsPerRow = useMemo(() => {
		return getColorsPerRowFromPalette(palette, cols);
	}, [palette, cols]);

	return (
		<>
			{colorsPerRow.map((row) => (
				<Box xcss={styles.paletteWrapper} key={`row-first-color-${row[0].value}`} role="radiogroup">
					{row.map(({ value, label, border, message, decorator }) => {
						let tooltipMessage = message;

						// Override with theme-specific tooltip messages if provided
						if (paletteColorTooltipMessages) {
							if (tokenTheme === 'dark') {
								tooltipMessage = getColorMessage(
									paletteColorTooltipMessages.dark,
									value.toUpperCase(),
								);
							}
							if (tokenTheme === 'light') {
								tooltipMessage = getColorMessage(
									paletteColorTooltipMessages.light,
									value.toUpperCase(),
								);
							}
						}

						return (
							<Color
								key={value}
								value={value}
								borderColor={border}
								label={tooltipMessage ? formatMessage(tooltipMessage) : label}
								onClick={onClick}
								onKeyDown={onKeyDown}
								isSelected={value === selectedColor}
								checkMarkColor={getCheckMarkColor(value, useIconToken)}
								hexToPaletteColor={hexToPaletteColor}
								decorator={decorator}
							/>
						);
					})}
				</Box>
			))}
		</>
	);
};

export default ColorPalette;
