/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import chromatism from 'chromatism';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { N0, N500 } from '@atlaskit/theme/colors';
import { token, useThemeObserver } from '@atlaskit/tokens';

import Color from './Color';
import getColorMessage from './Palettes/getColorMessage';
import {
  newDarkPalette,
  newLightPalette,
} from './Palettes/paletteMessagesTokenModeNames';
import { PaletteColor } from './Palettes/type';
import { colorPaletteWrapper } from './styles';
import {
  DEFAULT_COLOR_PICKER_COLUMNS,
  getColorsPerRowFromPalette,
} from './utils';

interface Props {
  palette: PaletteColor[];
  selectedColor: string | null;
  onClick: (value: string, label: string) => void;
  cols?: number;
  className?: string;
  /**
   * When the color picker is used to present text colors we
   * make a number of changes to how it works
   * - the check mark color uses design tokens when available
   * - the colors use design tokens when available
   * @default false
   */
  textPalette?: boolean;
  hexToPaletteColor?: (hexColor: string) => string | undefined;
  /**
   * Used to detect if the useSomewhatSemanticTextColorNames feature flag
   * is true. If so, text color tooltips in the color picker will
   * show semantic names (excluding white/dark gray).
   * @default false
   */
  useSomewhatSemanticTextColorNames?: boolean;
}

/**
 * For a given color pick the color from a list of colors with
 * the highest contrast
 *
 * @param color color string, suppports HEX, RGB, RGBA etc.
 * @return Highest contrast color in pool
 */
function getCheckMarkColor(color: string, useIconToken: boolean): string {
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  const contrastColor = [N0, N500].sort(
    (a, b) => chromatism.difference(b, color) - chromatism.difference(a, color),
  )[0];

  if (!useIconToken) {
    return contrastColor;
  }

  // Use of these token comes from guidance from designers in the Design System team
  // they are only intended for use with text colors (and there are different tokens
  // planned to be used when this extended to be used with other palettes).
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  return contrastColor === N0
    ? token('color.icon.inverse', N0)
    : token('color.icon', N500);
}

const ColorPalette = (props: Props & WrappedComponentProps) => {
  const {
    palette,
    cols = DEFAULT_COLOR_PICKER_COLUMNS,
    onClick,
    selectedColor,
    className,
    intl: { formatMessage },
    textPalette = false,
    hexToPaletteColor,
    useSomewhatSemanticTextColorNames = false,
  } = props;

  const { colorMode: tokenTheme } = useThemeObserver();
  const useIconToken = !!hexToPaletteColor;

  const colorsPerRow = React.useMemo(() => {
    return getColorsPerRowFromPalette(palette, cols);
  }, [palette, cols]);

  return (
    <React.Fragment>
      {colorsPerRow.map((row, rowIdx) => (
        <div
          css={colorPaletteWrapper}
          className={className}
          key={`row-first-color-${row[0].value}`}
          role="radiogroup"
        >
          {row.map(({ value, label, border, message }, colorIdx) => {
            if (textPalette === true && useSomewhatSemanticTextColorNames) {
              if (tokenTheme === 'dark') {
                message = getColorMessage(newDarkPalette, value.toUpperCase());
              }
              if (tokenTheme === 'light') {
                message = getColorMessage(newLightPalette, value.toUpperCase());
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
