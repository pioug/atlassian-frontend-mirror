import { ComponentClass, HTMLAttributes } from 'react';

import styled from 'styled-components';

import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const ShowMoreWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  margin-top: ${gridSize() / 2}px;
  padding: ${gridSize() / 2}px;
  padding-bottom: 0;
  border-top: 1px solid #dfe1e6;

  > button {
    flex-grow: 1;
  }
`;

export const TextColorIconWrapper = styled.div`
  position: relative;
`;

export const TextColorIconBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 16px;
  margin: auto;
  width: 12px;
  height: 3px;
  border-radius: ${borderRadius() + 'px'};

  ${({
    gradientColors,
    selectedColor,
  }: {
    gradientColors: string;
    selectedColor?: string | false | null;
  }) => {
    if (selectedColor) {
      return `background: ${selectedColor}`;
    }
    return `background: ${gradientColors}`;
  }};
`;

const createSteppedRainbow = (colors: string[]) => {
  return `
    linear-gradient(
      to right,
      ${colors
        .map((color, i) => {
          const inc = 100 / colors.length;
          const pos = i + 1;

          if (i === 0) {
            return `${color} ${pos * inc}%,`;
          }

          if (i === colors.length - 1) {
            return `${color} ${(pos - 1) * inc}%`;
          }

          return `
            ${color} ${(pos - 1) * inc}%,
            ${color} ${pos * inc}%,
          `;
        })
        .join('\n')}
    );
    `;
};

export const rainbow = createSteppedRainbow([
  colors.P300,
  colors.T300,
  colors.Y400,
  colors.R400,
]);
export const disabledRainbow = createSteppedRainbow([
  colors.N80,
  colors.N60,
  colors.N40,
  colors.N60,
]);
