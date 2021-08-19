import { CSSObject } from '@emotion/core';

import {
  B100,
  B400,
  B50,
  B75,
  DN600,
  N0,
  N200,
  N30,
  N40,
  N500,
  N600,
  N700,
  N800,
  N900,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const textColor = {
  light: token('color.text.highEmphasis', N900),
  dark: token('color.text.highEmphasis', DN600),
};
const textColorMedium = token('color.text.mediumEmphasis', N600);
const todayColor = {
  light: token('color.text.selected', B400),
  dark: token('color.text.selected', B100),
};
const hoverBackground = {
  light: token('color.background.transparentNeutral.hover', N30),
  dark: token('color.background.transparentNeutral.hover', N800),
};
const textSelected = {
  light: token('color.text.selected', N0),
  dark: token('color.text.selected', N700),
};
const selectedBackground = {
  light: token('color.background.selected.resting', N500),
  dark: token('color.background.selected.resting', N0),
};
const borderColorFocused = {
  light: token('color.border.focus', B100),
  dark: token('color.border.focus', B75),
};

export const dateCellStyles = (mode: ThemeModes = 'light'): CSSObject => ({
  all: 'unset',
  display: 'block',
  padding: '4px 9px',
  position: 'relative',
  backgroundColor: 'transparent',
  border: '2px solid transparent',
  borderRadius: 3,
  color: textColor[mode],
  cursor: 'pointer',
  fontSize: 14,
  textAlign: 'center',
  '&[data-sibling]': {
    color: token('color.text.lowEmphasis', N200),
  },
  '&[data-today]': {
    color: todayColor[mode],
    fontWeight: 'bold',
    '&::after': {
      display: 'block',
      height: 2,
      position: 'absolute',
      right: 2,
      bottom: 2,
      left: 2,
      backgroundColor: 'currentColor',
      content: '""',
    },
  },
  '&[data-prev-selected]': {
    backgroundColor: token('color.background.subtleBrand.resting', B50),
    color: token('color.text.mediumEmphasis', N600),
  },
  '&[data-selected]': {
    backgroundColor: selectedBackground[mode],
    color: textSelected[mode],
  },
  '&[data-disabled]': {
    color: token('color.text.disabled', N40),
    cursor: 'not-allowed',
  },
  '&[data-focused]': {
    border: `2px solid ${borderColorFocused[mode]}`,
  },
  '&:hover': {
    backgroundColor: hoverBackground[mode],
    color: textColor[mode],
  },
  '&:active': {
    backgroundColor: token('color.background.transparentNeutral.pressed', B50),
    color: textColor[mode],
  },
  '&[data-selected]:hover': {
    color: textColorMedium,
  },
  '&[data-prev-selected]:hover': {
    backgroundColor: token('color.background.subtleBrand.resting', B50),
    color: textColorMedium,
  },
  '&[data-sibling]:hover': {
    color: token('color.text.lowEmphasis', N200),
  },
  '&[data-disabled]:hover': {
    backgroundColor: 'transparent',
    color: token('color.text.disabled', N40),
  },
});
