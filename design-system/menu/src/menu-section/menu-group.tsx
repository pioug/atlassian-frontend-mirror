/** @jsx jsx */
import { jsx } from '@emotion/core';

import { menuGroupCSS } from '../internal/styles/menu-section/menu-group';
import type { MenuGroupProps } from '../types';

const MenuGroup = ({
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  testId,
  ...rest
}: MenuGroupProps) => (
  <div
    css={menuGroupCSS({ maxHeight, maxWidth, minHeight, minWidth })}
    data-testid={testId}
    {...rest}
  />
);

export default MenuGroup;
