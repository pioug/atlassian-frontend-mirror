import { CSSObject } from '@emotion/core';

import type { MenuGroupSizing } from '../../../types';

export const menuGroupCSS = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}: MenuGroupSizing): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
});
