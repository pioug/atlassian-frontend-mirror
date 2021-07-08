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

const textColor = { light: N900, dark: DN600 };
const primaryColor = { light: B400, dark: B100 };
const transparent = { light: 'transparent', dark: 'transparent' };
const selectedBackground = { light: N500, dark: N0 };
const prevSelectedBackground = { light: B50, dark: B50 };
const borderColorFocused = { light: B100, dark: B75 };
const textDisabled = { light: N40, dark: N40 };
const textSelected = { light: N0, dark: N700 };
const textSibling = { light: N200, dark: N200 };
const textPreviouslySelected = { light: N600, dark: N600 };
const hoverPreviouslySelectedBackground = { light: B50, dark: B50 };
const activeBackground = { light: B50, dark: B50 };
const hoverBackground = { light: N30, dark: N800 };
const textHoverSelected = { light: N600, dark: N600 };
const backgroundColorSelectedAfter = { light: N700, dark: N700 };

export const dateCellStyle = (mode: ThemeModes): CSSObject => ({
  all: 'unset',
  display: 'block',
  backgroundColor: transparent[mode],
  border: `2px solid ${transparent[mode]}`,
  borderRadius: 3,
  color: textColor[mode],
  cursor: 'pointer',
  fontSize: 14,
  padding: '4px 9px',
  position: 'relative',
  textAlign: 'center',
  '&[data-sibling]': {
    color: textSibling[mode],
  },
  '&[data-today]': {
    color: primaryColor[mode],
    fontWeight: 'bold',
    '&::after': {
      backgroundColor: primaryColor[mode],
      bottom: 2,
      content: '""',
      display: 'block',
      height: 2,
      left: 2,
      position: 'absolute',
      right: 2,
    },
    '&[data-selected]': {
      '&::after': {
        backgroundColor: backgroundColorSelectedAfter[mode],
      },
    },
  },
  '&[data-prev-selected]': {
    backgroundColor: prevSelectedBackground[mode],
    color: textPreviouslySelected[mode],
  },
  '&[data-selected]': {
    backgroundColor: selectedBackground[mode],
    color: textSelected[mode],
  },
  '&[data-disabled]': {
    cursor: 'not-allowed',
    color: textDisabled[mode],
  },
  '&[data-focused]': {
    border: `2px solid ${borderColorFocused[mode]}`,
  },
  '&:hover': {
    backgroundColor: hoverBackground[mode],
    color: textColor[mode],
  },
  '&:active': {
    backgroundColor: activeBackground[mode],
    color: textHoverSelected[mode],
  },
  '&[data-selected]:hover': {
    color: textHoverSelected[mode],
  },
  '&[data-prev-selected]:hover': {
    backgroundColor: hoverPreviouslySelectedBackground[mode],
    color: textHoverSelected[mode],
  },
  '&[data-sibling]:hover': {
    color: textSibling[mode],
  },
  '&[data-disabled]:hover': {
    backgroundColor: transparent[mode],
    color: textDisabled[mode],
  },
});
