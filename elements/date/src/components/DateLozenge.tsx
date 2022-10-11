/** @jsx jsx */

import React from 'react';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import {
  R50,
  R500,
  R75,
  Y50,
  Y500,
  Y75,
  B50,
  B500,
  B75,
  G50,
  G500,
  G75,
  P50,
  P500,
  P75,
  N30A,
  N800,
  N40,
  DN60,
  DN70,
  DN800,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { jsx } from '@emotion/react';

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
        token('color.background.accent.red.subtlest', R50),
        token('color.text.accent.red', R500),
        token('color.background.accent.red.subtler', R75),
      ] as ColoursTuple;
      return { light: colorArray, dark: colorArray };
    }
    case 'yellow': {
      const colorArray = [
        token('color.background.accent.yellow.subtlest', Y50),
        token('color.text.accent.yellow', Y500),
        token('color.background.accent.yellow.subtler', Y75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'blue': {
      const colorArray = [
        token('color.background.accent.blue.subtlest', B50),
        token('color.text.accent.blue', B500),
        token('color.background.accent.blue.subtler', B75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'green': {
      const colorArray = [
        token('color.background.accent.green.subtlest', G50),
        token('color.text.accent.green', G500),
        token('color.background.accent.green.subtler', G75),
      ] as ColoursTuple;
      return {
        light: colorArray,
        dark: colorArray,
      };
    }
    case 'purple': {
      const colorArray = [
        token('color.background.accent.purple.subtlest', P50),
        token('color.text.accent.purple', P500),
        token('color.background.accent.purple.subtler', P75),
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
          token('color.background.neutral', N30A),
          token('color.text', N800),
          token('color.background.neutral.hovered', N40),
        ],
        dark: [
          token('color.background.neutral', DN70),
          token('color.text', DN800),
          token('color.background.neutral.hovered', DN60),
        ],
      };
  }
};

export const DateLozenge = (props: Props) => {
  const theme = useGlobalTheme();
  let colors = themed(resolveColors(props.color))({ theme });
  if (colors === '') {
    colors = ['', '', ''];
  }
  const [background, color, hoverBackground]: ColoursTuple = colors;

  return (
    <span
      css={{
        borderRadius: borderRadius(),
        padding: '2px 4px',
        margin: '0 1px',
        position: 'relative',
        transition: 'background 0.3s',
        whiteSpace: 'nowrap',
        cursor: props.onClick ? 'pointer' : 'unset',
        background: background,
        color: color,
        '&:hover': {
          background: hoverBackground,
        },
      }}
    >
      {props.children}
    </span>
  );
};
