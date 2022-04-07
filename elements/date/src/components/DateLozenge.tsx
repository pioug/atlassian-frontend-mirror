import React from 'react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
//TODO: THis should be more specific
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import styled from 'styled-components';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
  clickable?: boolean;
  color?: Color;
};

type ColoursTuple = [string, string, string];

export const resolveColors = (
  color?: Color,
): { light: ColoursTuple; dark: ColoursTuple } => {
  switch (color) {
    case 'red': {
      const colorArray = [
        token('color.background.accent.red.subtlest', colors.R50),
        token('color.text.accent.red', colors.R500),
        token('color.background.accent.red.subtler', colors.R75),
      ] as ColoursTuple;
      return { light: colorArray, dark: colorArray };
    }
    case 'yellow': {
      const colorArray = [
        token('color.background.accent.yellow.subtlest', colors.Y50),
        token('color.text.accent.yellow', colors.Y500),
        token('color.background.accent.yellow.subtler', colors.Y75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'blue': {
      const colorArray = [
        token('color.background.accent.blue.subtlest', colors.B50),
        token('color.text.accent.blue', colors.B500),
        token('color.background.accent.blue.subtler', colors.B75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'green': {
      const colorArray = [
        token('color.background.accent.green.subtlest', colors.G50),
        token('color.text.accent.green', colors.G500),
        token('color.background.accent.green.subtler', colors.G75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'purple': {
      const colorArray = [
        token('color.background.accent.purple.subtlest', colors.P50),
        token('color.text.accent.purple', colors.P500),
        token('color.background.accent.purple.subtler', colors.P75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'grey':
    default:
      return {
        light: [
          token('color.background.neutral', colors.N30A),
          token('color.text', colors.N800),
          token('color.background.neutral.hovered', colors.N40),
        ],
        dark: [
          token('color.background.neutral', colors.DN70),
          token('color.text', colors.DN800),
          token('color.background.neutral.hovered', colors.DN60),
        ],
      };
  }
};

export const DateLozenge = styled.span<Props>`
  border-radius: ${borderRadius()}px;
  padding: 2px 4px;
  margin: 0 1px;
  position: relative;
  transition: background 0.3s;
  white-space: nowrap;
  cursor: ${(props: Props) => (props.onClick ? 'pointer' : 'unset')};

  ${(props) => {
    var colors = themed(resolveColors(props.color))(props);
    if (colors === '') {
      colors = ['', '', ''];
    }
    const [background, color, hoverBackground]: ColoursTuple = colors;
    /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
    return `
      background: ${background};
      color: ${color};
      &:hover {
        background: ${hoverBackground};
      }
    `;
    /* eslint-enable  @atlaskit/design-system/ensure-design-token-usage */
  }};
` as React.ComponentType<Props>;
