import { CSSObject } from '@emotion/core';

import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultBorderRadius } from '../../../constants';

// NOTE:
// "-moz-focus-inner" removes some inbuilt padding that Firefox adds (taken from reduced-ui-pack)
// the focus ring is red unless combined with hover, then uses default blue
export const removeButtonStyles = ({
  backgroundColor,
  backgroundColorHover,
  focusBoxShadowColor,
}: {
  backgroundColor: string;
  backgroundColorHover: string;
  focusBoxShadowColor: string;
}): CSSObject => ({
  position: 'absolute',
  right: 0,

  backgroundColor: 'transparent',
  alignItems: 'center',
  alignSelf: 'center',
  appearance: 'none',
  border: 'none',
  borderRadius: defaultBorderRadius,
  color: token('color.text.highEmphasis', N500),
  display: 'flex',
  justifyContent: 'center',
  height: '16px',
  margin: 0,
  padding: 0,
  cursor: 'pointer',
  pointerEvents: 'auto',
  '&::-moz-focus-inner': {
    border: 0,
    margin: 0,
    padding: 0,
  },

  '&:focus': {
    boxShadow: `0 0 0 2px ${focusBoxShadowColor} inset`,
    outline: 'none',
  },
});
