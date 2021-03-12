import { CSSObject } from '@emotion/core';

import { baseItemCSS } from './base-item';

export const customItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  color: 'currentColor',
  ...baseItemCSS(isDisabled, isSelected),
});
