import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import React from 'react';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Color as ColorType } from '../Status';
import Color from './color';

// color value, label, background, borderColor
const palette: [ColorType, string, string][] = [
  ['neutral', colors.N40, colors.N400],
  ['purple', colors.P50, colors.P400],
  ['blue', colors.B50, colors.B400],
  ['red', colors.R50, colors.R400],
  ['yellow', colors.Y75, colors.Y400],
  ['green', colors.G50, colors.G400],
];

const ColorPaletteWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: ${gridSize()}px ${gridSize()}px 0 ${gridSize()}px;
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;

interface ColorPaletteProps {
  selectedColor?: ColorType;
  onClick: (value: ColorType) => void;
  onHover?: (value: ColorType) => void;
  cols?: number;
  className?: string;
}

export default ({
  cols = 7,
  onClick,
  selectedColor,
  className,
  onHover,
}: ColorPaletteProps) => (
  <ColorPaletteWrapper className={className} style={{ maxWidth: cols * 32 }}>
    {palette.map(([colorValue, backgroundColor, borderColor]) => (
      <Color
        key={colorValue}
        value={colorValue}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        onClick={onClick}
        onHover={onHover}
        isSelected={colorValue === selectedColor}
      />
    ))}
  </ColorPaletteWrapper>
);
