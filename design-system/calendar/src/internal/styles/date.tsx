import { CSSObject } from '@emotion/react';

import {
  B200,
  B400,
  B50,
  N0,
  N200,
  N30,
  N40,
  N500,
  N600,
  N900,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const dateCellStyles = (): CSSObject => ({
  all: 'unset',
  display: 'block',
  padding: `${token('space.050', '4px')} 9px`,
  position: 'relative',
  backgroundColor: 'transparent',
  border: '2px solid transparent',
  borderRadius: 3,
  color: token('color.text', N900),
  cursor: 'pointer',
  flexGrow: 1,
  font: token('font.body'),
  textAlign: 'center',
  '&[data-sibling]': {
    color: token('color.text.subtlest', N200),
  },
  '&[data-today]': {
    color: token('color.text.selected', B400),
    fontWeight: token('font.weight.bold', 'bold'),
    '&::after': {
      display: 'block',
      height: 2,
      position: 'absolute',
      right: token('space.025', '2px'),
      bottom: token('space.025', '2px'),
      left: token('space.025', '2px'),
      backgroundColor: 'currentColor',
      content: '""',
    },
  },
  '&[data-prev-selected]': {
    backgroundColor: token('color.background.selected', B50),
    color: token('color.text.subtle', N600),
  },
  '&[data-selected]': {
    backgroundColor: token('color.background.selected', N500),
    color: token('color.text.selected', N0),
  },
  '&[data-disabled]': {
    color: token('color.text.disabled', N40),
    cursor: 'not-allowed',
  },
  '&:focus-visible': {
    border: `2px solid ${token('color.border.focused', B200)}`,
  },
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N30),
    color: token('color.text', N900),
  },
  '&:active': {
    backgroundColor: token('color.background.neutral.subtle.pressed', B50),
    color: token('color.text', N900),
  },
  '&[data-selected]:hover': {
    backgroundColor: token('color.background.selected.hovered', B50),
    color: token('color.text.selected', N600),
  },
  '&[data-prev-selected]:hover': {
    color: token('color.text.subtle', N600),
  },
  '&[data-sibling]:hover': {
    color: token('color.text.subtlest', N200),
  },
  '&[data-disabled]:hover': {
    backgroundColor: 'transparent',
    color: token('color.text.disabled', N40),
  },
});
