import { CSSObject } from '@emotion/core';

import { baseItemCSS } from './base-item';

export const linkItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...baseItemCSS(isDisabled, isSelected),
});
