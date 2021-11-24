import React from 'react';
import chromatism from 'chromatism';
import Color from './Color';

import { ColorPaletteWrapper } from './styles';
import { PaletteColor } from './Palettes/type';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { N0, N500 } from '@atlaskit/theme/colors';

export interface Props {
  palette: PaletteColor[];
  selectedColor: string | null;
  onClick: (value: string, label: string) => void;
  cols?: number;
  className?: string;
  isShowingMoreColors?: boolean;
}

/**
 * For a given color pick the color from a list of colors with
 * the highest contrast
 *
 * @param color color string, suppports HEX, RGB, RGBA etc.
 * @return Highest contrast color in pool
 */
export function getContrastColor(color: string, pool: string[]): string {
  return pool.sort(
    (a, b) => chromatism.difference(b, color) - chromatism.difference(a, color),
  )[0];
}

const ColorPalette = (props: Props & WrappedComponentProps) => {
  const {
    palette,
    cols = 7,
    onClick,
    selectedColor,
    className,
    isShowingMoreColors,
    intl: { formatMessage },
  } = props;

  const colorsPerRow = React.useMemo(() => {
    return palette.reduce(
      (resultArray: PaletteColor[][], item: PaletteColor, index: number) => {
        const chunkIndex = Math.floor(index / cols);

        resultArray[chunkIndex] = resultArray[chunkIndex] || []; // start a new chunk
        resultArray[chunkIndex].push(item);

        return resultArray;
      },
      [],
    );
  }, [palette, cols]);

  return (
    <>
      {colorsPerRow.map((row, rowIdx) => (
        <ColorPaletteWrapper
          className={className}
          key={`row-first-color-${row[0].value}`}
          role="radiogroup"
        >
          {row.map(({ value, label, border, message }, colorIdx) => (
            <Color
              key={value}
              value={value}
              borderColor={border}
              label={message ? formatMessage(message) : label}
              onClick={onClick}
              isSelected={value === selectedColor}
              checkMarkColor={getContrastColor(value, [N0, N500])}
              autoFocus={isShowingMoreColors && rowIdx === 1 && colorIdx === 0}
            />
          ))}
        </ColorPaletteWrapper>
      ))}
    </>
  );
};

export default injectIntl(ColorPalette);
