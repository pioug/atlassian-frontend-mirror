import { CSSObject } from '@emotion/core';

import { baseItemCSS } from './base-item';

export const buttonItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  margin: 0,
  width: '100%',
  ...baseItemCSS(isDisabled, isSelected),
});
