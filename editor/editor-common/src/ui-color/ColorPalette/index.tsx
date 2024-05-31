/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import chromatism from 'chromatism';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { N0, N500 } from '@atlaskit/theme/colors';
import { token, useThemeObserver } from '@atlaskit/tokens';

import Color from './Color';
import getColorMessage from './Palettes/getColorMessage';
import type { PaletteColor, PaletteTooltipMessages } from './Palettes/type';
import { colorPaletteWrapper } from './styles';
import {
	DEFAULT_COLOR_PICKER_COLUMNS,
	getColorsPerRowFromPalette,
	getTokenCSSVariableValue,
} from './utils';

interface Props {
	selectedColor: string | null;
	onClick: (value: string, label: string) => void;
	cols?: number;
	className?: string;
	/**
	 * paletteOptions is the prop, where any configuration related to
	 * how palette should look or behave will be added.
	 */
	paletteOptions: {
		palette: PaletteColor[];
		/**
		 * If hexToPaletteColor is passed, it will be called to convert
		 *  hexCodes passed in palette props to DST token.
		 * Different color palette will set different mapping function.
		 * Such as text and background color palette uses different
		 *  mapping function to map tokens.
		 */
		hexToPaletteColor?: (hexColor: string) => string | undefined;
		/**
		 * We have pivoted from having logic inside ColorPalette determining
		 *  which tooltip messages should be used to consumer of ColorPalette giving
		 *  tooltip messages. Which is same as palette, where consumer determines which
		 *  colors ColorPalette should render.
		 * Same way now consumer will determine which tooltip messages should
		 *  be using paletteColorTooltipMessages option.
		 */
		paletteColorTooltipMessages?: PaletteTooltipMessages;
	};
}

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
	const contrastColor = [N0, N500].sort(
		(a, b) => chromatism.difference(b, colorValue) - chromatism.difference(a, colorValue),
	)[0];

	if (!useIconToken) {
		return contrastColor;
	}

	// Use of these token comes from guidance from designers in the Design System team
	// they are only intended for use with text colors (and there are different tokens
	// planned to be used when this extended to be used with other palettes).
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	return contrastColor === N0 ? token('color.icon.inverse', N0) : token('color.icon', N500);
}

const ColorPalette = (props: Props & WrappedComponentProps) => {
	const {
		cols = DEFAULT_COLOR_PICKER_COLUMNS,
		onClick,
		selectedColor,
		className,
		intl: { formatMessage },
		paletteOptions,
	} = props;
	const { palette, hexToPaletteColor, paletteColorTooltipMessages } = paletteOptions;

	const { colorMode: tokenTheme } = useThemeObserver();
	const useIconToken = !!hexToPaletteColor;

	const colorsPerRow = React.useMemo(() => {
		return getColorsPerRowFromPalette(palette, cols);
	}, [palette, cols]);

	return (
		<React.Fragment>
			{colorsPerRow.map((row) => (
				<div
					css={colorPaletteWrapper}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					key={`row-first-color-${row[0].value}`}
					role="radiogroup"
				>
					{row.map(({ value, label, border, message }) => {
						if (paletteColorTooltipMessages) {
							if (tokenTheme === 'dark') {
								message = getColorMessage(paletteColorTooltipMessages.dark, value.toUpperCase());
							}
							if (tokenTheme === 'light') {
								message = getColorMessage(paletteColorTooltipMessages.light, value.toUpperCase());
							}
						}
						return (
							<Color
								key={value}
								value={value}
								borderColor={border}
								label={message ? formatMessage(message) : label}
								onClick={onClick}
								isSelected={value === selectedColor}
								checkMarkColor={getCheckMarkColor(value, useIconToken)}
								hexToPaletteColor={hexToPaletteColor}
							/>
						);
					})}
				</div>
			))}
		</React.Fragment>
	);
};

export default injectIntl(ColorPalette);
